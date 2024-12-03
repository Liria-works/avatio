drop function if exists "public"."search_tags"(keywords text);

drop index if exists "public"."pgroonga_item_search_index";

drop index if exists "public"."pgroonga_search_tags_index";

drop index if exists "public"."pgroonga_setup_search_index_description";

drop index if exists "public"."pgroonga_setup_search_index_name";

drop index if exists "public"."pgroonga_shop_search_index";

CREATE INDEX pgroonga_item_search ON public.items USING pgroonga (name) WITH (normalizers='NormalizerNFKC100("unify_to_romaji", true, "unify_hyphen_and_prolonged_sound_mark", true)', tokenizer='TokenBigramSplitSymbolAlphaDigit', token_filters='TokenFilterNFKC100("unify_to_romaji", true, "unify_kana", true, "unify_hyphen_and_prolonged_sound_mark", true)');

CREATE INDEX pgroonga_search_tags ON public.setup_tags USING pgroonga (tag) WITH (normalizers='NormalizerNFKC100("unify_to_romaji", true, "unify_hyphen_and_prolonged_sound_mark", true)', tokenizer='TokenBigramSplitSymbolAlphaDigit', token_filters='TokenFilterNFKC100("unify_to_romaji", true, "unify_kana", true, "unify_hyphen_and_prolonged_sound_mark", true)');

CREATE INDEX pgroonga_shop_search ON public.shops USING pgroonga (name) WITH (normalizers='NormalizerNFKC100("unify_to_romaji", true, "unify_hyphen_and_prolonged_sound_mark", true)', tokenizer='TokenBigramSplitSymbolAlphaDigit', token_filters='TokenFilterNFKC100("unify_to_romaji", true, "unify_kana", true, "unify_hyphen_and_prolonged_sound_mark", true)');

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_password(user_id uuid, plain_password text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  is_password_correct BOOLEAN;
BEGIN
  SELECT
    CASE WHEN encrypted_password = crypt (plain_password, encrypted_password) 
      THEN TRUE
      ELSE FALSE
    END INTO is_password_correct
  FROM
    auth.users
  WHERE
    id = user_id;
  RETURN
   is_password_correct;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.search_setups(method text, query text[])
 RETURNS SETOF setup_with_details
 LANGUAGE plpgsql
AS $function$

BEGIN

  IF method = 'item' THEN
    RETURN QUERY
    SELECT DISTINCT
      s.*
    FROM
      setups s
      join users u on s.author = u.id
      join items i on s.avatar = i.id
      join setup_items si on s.id = si.setup_id
      left join setup_tags st on s.id = st.setup_id
    WHERE
      si.item_id = ANY (query::bigint[])
      -- OR query::bigint[] @> ARRAY[s.avatar_id]::bigint[]
    ORDER BY s.created_at DESC;

  ELSEIF method = 'tag' THEN
    RETURN QUERY
    SELECT DISTINCT
      s.*
    FROM setups s
    WHERE
      s.tags @> query
    ORDER BY s.created_at DESC;
  
  ELSEIF method = 'word' THEN
    RETURN QUERY
    SELECT DISTINCT
      s.*
    FROM setups s
    WHERE
      s.name &@ query[1]
    ORDER BY s.created_at DESC;

  END IF;

END;
$function$
;

create type "public"."setup_with_details" as ("setup_id" bigint, "created_at" timestamp with time zone, "name" text, "description" text, "updated_at" timestamp with time zone, "image" text, "avatar_note" text, "avatar" bigint, "author" uuid, "user_id" uuid, "user_name" text, "item_id" bigint, "item_name" text, "tag" text);

CREATE OR REPLACE FUNCTION public.avatars_order_by_count()
 RETURNS json
 LANGUAGE plpgsql
AS $function$declare
    result json;
begin
    select json_agg(t)
    into result
    from (
        select
            setups.avatar,
            count(*) as occurrence_count
        from
            setups
        group by
            setups.avatar
        order by
            occurrence_count desc
        limit 6
    ) t;

    return result;
end;$function$
;

CREATE OR REPLACE FUNCTION public.gen_random_key(bytea_length integer)
 RETURNS text
 LANGUAGE sql
AS $function$
    SELECT string_agg(lpad(to_hex(width_bucket(random(), 0, 1, 256) - 1), 2, '0'), '') FROM generate_series(1, $1);
$function$
;

CREATE OR REPLACE FUNCTION public.get_public_id(user_id uuid)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
    result text;
BEGIN
    SELECT public_id INTO result
    FROM public.users
    WHERE id = user_id;

    RETURN result;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
  insert into public.users (id, name)
  values (new.id, substring(md5(random()::text), 1, 10));
  return new;
end;$function$
;

CREATE OR REPLACE FUNCTION public.popular_avatars()
 RETURNS SETOF items
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    i.*
  FROM
    public.setups s
    JOIN public.items i ON s.avatar = i.id
  WHERE
    i.outdated = false
  GROUP BY
    i.id
  ORDER BY
    COUNT(*) DESC;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.search_items(keywords text)
 RETURNS TABLE(id bigint, name text, shop_id text, shop text, shop_thumbnail text, category bigint, price text, thumbnail text, score double precision)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY 
  SELECT 
    i.id, 
    i.name, 
    i.shop_id, 
    s.name as shop, 
    s.thumbnail as shop_thumbnail, 
    i.category, 
    i.price, 
    i.thumbnail, 
    pgroonga_score(i.tableoid, i.ctid) AS score 
  FROM public.items i JOIN public.shops s ON i.shop_id = s.id
  WHERE 
    i.name &@~ keywords 
    and i.outdated = false
    and i.nsfw = false
  ORDER BY score DESC;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.search_tags(keywords text, exclude text[])
 RETURNS TABLE(tag text, score double precision)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT DISTINCT t.tag, pgroonga_score(t.tableoid, t.ctid) AS score
    FROM public.setup_tags t
    WHERE t.tag &@~ keywords
      AND NOT t.tag = ANY(exclude)
    ORDER BY score DESC
    LIMIT 6;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.tags_order_by_count()
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
    result json;
begin
    select json_agg(t)
    into result
    from (
        WITH tag_counts AS (
    SELECT
        unnest(tags) AS tag,
        COUNT(*) AS count
    FROM
        setups
    GROUP BY
        tag
)
SELECT
    tag,
    count
FROM
    tag_counts
ORDER BY
    count DESC
LIMIT
    6
    ) t;

    return result;
end;
$function$
;


