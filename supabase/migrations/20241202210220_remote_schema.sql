drop function if exists "public"."search_tags"(keywords text);

drop index if exists "public"."pgroonga_item_search_index";

drop index if exists "public"."pgroonga_search_tags_index";

drop index if exists "public"."pgroonga_setup_search_index_description";

drop index if exists "public"."pgroonga_setup_search_index_name";

drop index if exists "public"."pgroonga_shop_search_index";

CREATE INDEX pgroonga_item_search ON public.items USING pgroonga (name) WITH (
  normalizers = 'NormalizerNFKC100("unify_to_romaji", true, "unify_hyphen_and_prolonged_sound_mark", true)',
  tokenizer = 'TokenBigramSplitSymbolAlphaDigit',
  token_filters = 'TokenFilterNFKC100("unify_to_romaji", true, "unify_kana", true, "unify_hyphen_and_prolonged_sound_mark", true)'
);

CREATE INDEX pgroonga_search_tags ON public.setup_tags USING pgroonga (tag) WITH (
  normalizers = 'NormalizerNFKC100("unify_to_romaji", true, "unify_hyphen_and_prolonged_sound_mark", true)',
  tokenizer = 'TokenBigramSplitSymbolAlphaDigit',
  token_filters = 'TokenFilterNFKC100("unify_to_romaji", true, "unify_kana", true, "unify_hyphen_and_prolonged_sound_mark", true)'
);

CREATE INDEX pgroonga_shop_search ON public.shops USING pgroonga (name) WITH (
  normalizers = 'NormalizerNFKC100("unify_to_romaji", true, "unify_hyphen_and_prolonged_sound_mark", true)',
  tokenizer = 'TokenBigramSplitSymbolAlphaDigit',
  token_filters = 'TokenFilterNFKC100("unify_to_romaji", true, "unify_kana", true, "unify_hyphen_and_prolonged_sound_mark", true)'
);

set
  check_function_bodies = off;

CREATE
OR REPLACE FUNCTION public.check_password(user_id uuid, plain_password text) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER AS $ function $ DECLARE is_password_correct BOOLEAN;

BEGIN
SELECT
  CASE
    WHEN encrypted_password = crypt (plain_password, encrypted_password) THEN TRUE
    ELSE FALSE
  END INTO is_password_correct
FROM
  auth.users
WHERE
  id = user_id;

RETURN is_password_correct;

END;

$ function $;

CREATE
OR REPLACE FUNCTION public.search_setups(method text, query text []) RETURNS SETOF setup_with_details LANGUAGE plpgsql AS $ function $ BEGIN IF method = 'item' THEN RETURN QUERY
SELECT
  DISTINCT s.*
FROM
  setups s
  join users u on s.author = u.id
  join items i on s.avatar = i.id
  join setup_items si on s.id = si.setup_id
  left join setup_tags st on s.id = st.setup_id
WHERE
  si.item_id = ANY (query :: bigint []) -- OR query::bigint[] @> ARRAY[s.avatar_id]::bigint[]
ORDER BY
  s.created_at DESC;

ELSEIF method = 'tag' THEN RETURN QUERY
SELECT
  DISTINCT s.*
FROM
  setups s
WHERE
  s.tags @ > query
ORDER BY
  s.created_at DESC;

ELSEIF method = 'word' THEN RETURN QUERY
SELECT
  DISTINCT s.*
FROM
  setups s
WHERE
  s.name & @ query [1]
ORDER BY
  s.created_at DESC;

END IF;

END;

$ function $;

create type "public"."setup_with_details" as (
  "setup_id" bigint,
  "created_at" timestamp with time zone,
  "name" text,
  "description" text,
  "updated_at" timestamp with time zone,
  "image" text,
  "avatar_note" text,
  "avatar" bigint,
  "author" uuid,
  "user_id" uuid,
  "user_name" text,
  "item_id" bigint,
  "item_name" text,
  "tag" text
);