

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "admin";


ALTER SCHEMA "admin" OWNER TO "postgres";


CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "pg_catalog";






CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgroonga" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "moddatetime" WITH SCHEMA "public";






CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pg_trgm" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "wrappers" WITH SCHEMA "extensions";






CREATE TYPE "public"."setup_with_details" AS (
	"setup_id" bigint,
	"created_at" timestamp with time zone,
	"name" "text",
	"description" "text",
	"updated_at" timestamp with time zone,
	"image" "text",
	"avatar_note" "text",
	"avatar" bigint,
	"author" "uuid",
	"user_id" "uuid",
	"user_name" "text",
	"item_id" bigint,
	"item_name" "text",
	"tag" "text"
);


ALTER TYPE "public"."setup_with_details" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_password"("user_id" "uuid", "plain_password" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  is_password_correct BOOLEAN;
BEGIN
  SELECT
    CASE 
      WHEN encrypted_password IS NOT NULL AND encrypted_password = crypt(plain_password, encrypted_password::TEXT) 
      THEN TRUE
      ELSE FALSE
    END INTO is_password_correct
  FROM
    auth.users
  WHERE
    id = user_id;

  RETURN is_password_correct;
END;
$$;


ALTER FUNCTION "public"."check_password"("user_id" "uuid", "plain_password" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$begin
  insert into public.users (id, name)
  values (new.id, substring(md5(random()::text), 1, 10));
  return new;
end;$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."items" (
    "id" bigint NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "category" bigint NOT NULL,
    "price" "text",
    "thumbnail" "text" NOT NULL,
    "nsfw" boolean NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "outdated" boolean DEFAULT false NOT NULL,
    "shop_id" "text" NOT NULL
);


ALTER TABLE "public"."items" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."popular_avatars"() RETURNS SETOF "public"."items"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
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
$$;


ALTER FUNCTION "public"."popular_avatars"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."search_items"("keywords" "text") RETURNS TABLE("id" bigint, "name" "text", "shop_id" "text", "shop" "text", "shop_thumbnail" "text", "category" bigint, "price" "text", "thumbnail" "text", "score" double precision)
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
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
$$;


ALTER FUNCTION "public"."search_items"("keywords" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."search_setups"("word" "text", "items" bigint[], "tags" "text"[]) RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN (
    SELECT jsonb_agg(result)
    FROM (
      SELECT DISTINCT
        s.id, 
        s.created_at, 
        s.name, 
        s.description, 
        s.image, 
        jsonb_build_object(
          'id', u.id,
          'name', u.name,
          'avatar', u.avatar
        ) AS author,
        jsonb_agg(
          DISTINCT jsonb_build_object(
            'data', jsonb_build_object(
              'id', i.id,
              'name', i.name,
              'thumbnail', i.thumbnail,
              'category', i.category
            ),
            'note', si.note,
            'unsupported', si.unsupported
          )
        ) AS items, 
        jsonb_agg(DISTINCT st.tag) AS tags
      FROM 
        setups s
        JOIN users u ON s.author = u.id
        LEFT JOIN setup_items si ON s.id = si.setup_id
        LEFT JOIN public.items i ON si.item_id = i.id
        LEFT JOIN setup_tags st ON s.id = st.setup_id
      WHERE
        (word = '''' AND array_length(items, 1) IS NULL OR s.id IN (
          SELECT si.setup_id
          FROM setup_items si
          WHERE si.item_id = ANY (items)
        ))
        OR (word <> '''' AND s.name &@~ word)
        OR (tags IS NOT NULL AND st.tag = ANY (tags))
      GROUP BY s.id, s.created_at, s.name, s.description, s.image, u.id
      ORDER BY s.created_at DESC
    ) AS result
  );
END;
$$;


ALTER FUNCTION "public"."search_setups"("word" "text", "items" bigint[], "tags" "text"[]) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."search_tags"("keywords" "text", "exclude" "text"[]) RETURNS TABLE("tag" "text", "score" double precision)
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT t.tag, pgroonga_score(t.tableoid, t.ctid) AS score
    FROM public.setup_tags t
    WHERE t.tag &@~ keywords
      AND NOT t.tag = ANY(exclude)
    ORDER BY score DESC
    LIMIT 6;
END;
$$;


ALTER FUNCTION "public"."search_tags"("keywords" "text", "exclude" "text"[]) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."tags_order_by_count"() RETURNS "json"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
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
$$;


ALTER FUNCTION "public"."tags_order_by_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_item_updated_at"("item_id" bigint) RETURNS "void"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
BEGIN
    UPDATE public.items
    SET updated_at = now()
    WHERE id = item_id;
END;
$$;


ALTER FUNCTION "public"."update_item_updated_at"("item_id" bigint) OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."articles" (
    "slug" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text" NOT NULL,
    "content" "text" NOT NULL,
    "published" boolean DEFAULT false NOT NULL,
    "category" "text"
);


ALTER TABLE "public"."articles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."badges" (
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "developer" boolean DEFAULT false NOT NULL,
    "contributor" boolean DEFAULT false NOT NULL,
    "translator" boolean DEFAULT false NOT NULL,
    "alpha_tester" boolean DEFAULT false NOT NULL,
    "shop_owner" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."badges" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bookmarks" (
    "user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "post" bigint NOT NULL,
    "id" bigint NOT NULL
);


ALTER TABLE "public"."bookmarks" OWNER TO "postgres";


ALTER TABLE "public"."bookmarks" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."bookmarks_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."feedback" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "contents" "text" NOT NULL,
    "dealt" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."feedback" OWNER TO "postgres";


ALTER TABLE "public"."feedback" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."feedback_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."report_setup" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "reporter" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "spam" boolean DEFAULT false NOT NULL,
    "hate" boolean DEFAULT false NOT NULL,
    "infringement" boolean DEFAULT false NOT NULL,
    "nsfw_image" boolean DEFAULT false NOT NULL,
    "other" boolean DEFAULT false NOT NULL,
    "additional" "text",
    "setup_id" bigint NOT NULL,
    "dealt" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."report_setup" OWNER TO "postgres";


COMMENT ON COLUMN "public"."report_setup"."dealt" IS '報告が解決済みかどうか';



ALTER TABLE "public"."report_setup" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."report_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."report_user" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "reporter" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "spam" boolean DEFAULT false NOT NULL,
    "hate" boolean DEFAULT false NOT NULL,
    "infringement" boolean DEFAULT false NOT NULL,
    "other" boolean DEFAULT false NOT NULL,
    "additional" "text",
    "dealt" boolean DEFAULT false NOT NULL,
    "reportee" "uuid" NOT NULL
);


ALTER TABLE "public"."report_user" OWNER TO "postgres";


COMMENT ON COLUMN "public"."report_user"."dealt" IS '報告が解決済みかどうか';



ALTER TABLE "public"."report_user" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."report_user_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."setup_items" (
    "id" bigint NOT NULL,
    "setup_id" bigint NOT NULL,
    "item_id" bigint,
    "note" "text" DEFAULT ''::"text" NOT NULL,
    "unsupported" boolean DEFAULT false NOT NULL,
    CONSTRAINT "setup_items_note_check" CHECK (("length"("note") < 141))
);


ALTER TABLE "public"."setup_items" OWNER TO "postgres";


ALTER TABLE "public"."setup_items" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."setup_items_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."setup_tags" (
    "id" bigint NOT NULL,
    "setup_id" bigint NOT NULL,
    "tag" "text" NOT NULL
);


ALTER TABLE "public"."setup_tags" OWNER TO "postgres";


ALTER TABLE "public"."setup_tags" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."setup_tags_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."setups" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text" DEFAULT ''::"text" NOT NULL,
    "id" bigint NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "image" "text",
    "avatar_note" "text",
    "avatar" bigint,
    "author" "uuid" DEFAULT "auth"."uid"(),
    CONSTRAINT "setups_avatar_note_check" CHECK (("length"("avatar_note") < 141)),
    CONSTRAINT "setups_description_check" CHECK (("length"("description") < 141)),
    CONSTRAINT "setups_name_check" CHECK (("length"("name") < 25))
);


ALTER TABLE "public"."setups" OWNER TO "postgres";


ALTER TABLE "public"."setups" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."setups_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."shops" (
    "id" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "verified" boolean NOT NULL,
    "thumbnail" "text",
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."shops" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" NOT NULL,
    "avatar" "text",
    "name" "text",
    "bio" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "links" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    CONSTRAINT "users_bio_check" CHECK (("length"("bio") < 141)),
    CONSTRAINT "users_links_check" CHECK (("array_length"("links", 1) < 9)),
    CONSTRAINT "users_name_check" CHECK ((("length"("name") > 0) AND ("length"("name") < 17)))
);


ALTER TABLE "public"."users" OWNER TO "postgres";


ALTER TABLE ONLY "public"."articles"
    ADD CONSTRAINT "articles_pkey" PRIMARY KEY ("slug");



ALTER TABLE ONLY "public"."badges"
    ADD CONSTRAINT "badges_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."bookmarks"
    ADD CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."feedback"
    ADD CONSTRAINT "feedback_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."items"
    ADD CONSTRAINT "items_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."items"
    ADD CONSTRAINT "items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."report_setup"
    ADD CONSTRAINT "report_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."report_user"
    ADD CONSTRAINT "report_user_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."setup_items"
    ADD CONSTRAINT "setup_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."setup_tags"
    ADD CONSTRAINT "setup_tags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."setups"
    ADD CONSTRAINT "setups_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."setups"
    ADD CONSTRAINT "setups_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."shops"
    ADD CONSTRAINT "shops_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



CREATE INDEX "pgroonga_item_search" ON "public"."items" USING "pgroonga" ("name") WITH ("normalizers"='NormalizerNFKC100("unify_to_romaji", true, "unify_hyphen_and_prolonged_sound_mark", true)', "tokenizer"='TokenBigramSplitSymbolAlphaDigit', "token_filters"='TokenFilterNFKC100("unify_to_romaji", true, "unify_kana", true, "unify_hyphen_and_prolonged_sound_mark", true)');



CREATE INDEX "pgroonga_search_tags" ON "public"."setup_tags" USING "pgroonga" ("tag") WITH ("normalizers"='NormalizerNFKC100("unify_to_romaji", true, "unify_hyphen_and_prolonged_sound_mark", true)', "tokenizer"='TokenBigramSplitSymbolAlphaDigit', "token_filters"='TokenFilterNFKC100("unify_to_romaji", true, "unify_kana", true, "unify_hyphen_and_prolonged_sound_mark", true)');



CREATE INDEX "pgroonga_setups_description" ON "public"."setups" USING "pgroonga" ("description") WITH ("normalizers"='NormalizerNFKC100("unify_to_romaji", true, "unify_hyphen_and_prolonged_sound_mark", true)', "tokenizer"='TokenBigramSplitSymbolAlphaDigit', "token_filters"='TokenFilterNFKC100("unify_to_romaji", true, "unify_kana", true, "unify_hyphen_and_prolonged_sound_mark", true)');



CREATE INDEX "pgroonga_setups_name" ON "public"."setups" USING "pgroonga" ("name") WITH ("normalizers"='NormalizerNFKC100("unify_to_romaji", true, "unify_hyphen_and_prolonged_sound_mark", true)', "tokenizer"='TokenBigramSplitSymbolAlphaDigit', "token_filters"='TokenFilterNFKC100("unify_to_romaji", true, "unify_kana", true, "unify_hyphen_and_prolonged_sound_mark", true)');



CREATE INDEX "pgroonga_shop_search" ON "public"."shops" USING "pgroonga" ("name") WITH ("normalizers"='NormalizerNFKC100("unify_to_romaji", true, "unify_hyphen_and_prolonged_sound_mark", true)', "tokenizer"='TokenBigramSplitSymbolAlphaDigit', "token_filters"='TokenFilterNFKC100("unify_to_romaji", true, "unify_kana", true, "unify_hyphen_and_prolonged_sound_mark", true)');



CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."items" FOR EACH ROW EXECUTE FUNCTION "public"."moddatetime"('updated_at');



CREATE OR REPLACE TRIGGER "handle_updated_at_shops" BEFORE UPDATE ON "public"."shops" FOR EACH ROW EXECUTE FUNCTION "public"."moddatetime"('updated_at');



CREATE OR REPLACE TRIGGER "vercel-deploy" AFTER INSERT OR DELETE OR UPDATE ON "public"."articles" FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request"('https://api.vercel.com/v1/integrations/deploy/prj_QpcYQLzkTBemcNIDs4HRWne4ecbW/0vU2dp1jK5', 'POST', '{"Content-type":"application/json"}', '{}', '5000');



ALTER TABLE ONLY "public"."badges"
    ADD CONSTRAINT "badges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bookmarks"
    ADD CONSTRAINT "bookmarks_post_fkey" FOREIGN KEY ("post") REFERENCES "public"."setups"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bookmarks"
    ADD CONSTRAINT "bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."feedback"
    ADD CONSTRAINT "feedback_user_fkey" FOREIGN KEY ("user") REFERENCES "public"."users"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."items"
    ADD CONSTRAINT "items_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "public"."shops"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."report_setup"
    ADD CONSTRAINT "report_setup_id_fkey" FOREIGN KEY ("setup_id") REFERENCES "public"."setups"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."report_setup"
    ADD CONSTRAINT "report_setup_reporter_fkey" FOREIGN KEY ("reporter") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."report_user"
    ADD CONSTRAINT "report_user_reportee_fkey" FOREIGN KEY ("reportee") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."report_user"
    ADD CONSTRAINT "report_user_reporter_fkey" FOREIGN KEY ("reporter") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."report_user"
    ADD CONSTRAINT "report_user_user_id_fkey" FOREIGN KEY ("reportee") REFERENCES "public"."users"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."setup_items"
    ADD CONSTRAINT "setup_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."setup_items"
    ADD CONSTRAINT "setup_items_setup_id_fkey" FOREIGN KEY ("setup_id") REFERENCES "public"."setups"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."setup_tags"
    ADD CONSTRAINT "setup_tags_setup_id_fkey" FOREIGN KEY ("setup_id") REFERENCES "public"."setups"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."setups"
    ADD CONSTRAINT "setups_author_fkey" FOREIGN KEY ("author") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."setups"
    ADD CONSTRAINT "setups_avatar_fkey" FOREIGN KEY ("avatar") REFERENCES "public"."items"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Allow update for users themselves." ON "public"."users" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Enable delete for users based on author" ON "public"."setups" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "author"));



CREATE POLICY "Enable delete for users based on user_id" ON "public"."bookmarks" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Enable insert for authenticated users only" ON "public"."bookmarks" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."feedback" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."report_setup" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."report_user" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."setup_items" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."setup_tags" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."setups" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable read access for all users" ON "public"."articles" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."badges" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."bookmarks" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Enable read access for all users" ON "public"."items" USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."setup_items" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."setup_tags" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."setups" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."shops" USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."users" FOR SELECT USING (true);



ALTER TABLE "public"."articles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."badges" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bookmarks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."feedback" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."report_setup" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."report_user" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."setup_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."setup_tags" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."setups" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."shops" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";





GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";
GRANT USAGE ON SCHEMA "public" TO "postgres";















































































































































































































































































































































































































































































































































































































































































































































































































GRANT ALL ON FUNCTION "public"."check_password"("user_id" "uuid", "plain_password" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."check_password"("user_id" "uuid", "plain_password" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_password"("user_id" "uuid", "plain_password" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."moddatetime"() TO "anon";
GRANT ALL ON FUNCTION "public"."moddatetime"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."moddatetime"() TO "service_role";
GRANT ALL ON FUNCTION "public"."moddatetime"() TO "postgres";



GRANT ALL ON TABLE "public"."items" TO "anon";
GRANT ALL ON TABLE "public"."items" TO "authenticated";
GRANT ALL ON TABLE "public"."items" TO "service_role";



GRANT ALL ON FUNCTION "public"."popular_avatars"() TO "anon";
GRANT ALL ON FUNCTION "public"."popular_avatars"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."popular_avatars"() TO "service_role";



GRANT ALL ON FUNCTION "public"."search_items"("keywords" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."search_items"("keywords" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_items"("keywords" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."search_setups"("word" "text", "items" bigint[], "tags" "text"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."search_setups"("word" "text", "items" bigint[], "tags" "text"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_setups"("word" "text", "items" bigint[], "tags" "text"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."search_tags"("keywords" "text", "exclude" "text"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."search_tags"("keywords" "text", "exclude" "text"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_tags"("keywords" "text", "exclude" "text"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."tags_order_by_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."tags_order_by_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."tags_order_by_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_item_updated_at"("item_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."update_item_updated_at"("item_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_item_updated_at"("item_id" bigint) TO "service_role";



























GRANT ALL ON TABLE "public"."articles" TO "anon";
GRANT ALL ON TABLE "public"."articles" TO "authenticated";
GRANT ALL ON TABLE "public"."articles" TO "service_role";



GRANT ALL ON TABLE "public"."badges" TO "anon";
GRANT ALL ON TABLE "public"."badges" TO "authenticated";
GRANT ALL ON TABLE "public"."badges" TO "service_role";



GRANT ALL ON TABLE "public"."bookmarks" TO "anon";
GRANT ALL ON TABLE "public"."bookmarks" TO "authenticated";
GRANT ALL ON TABLE "public"."bookmarks" TO "service_role";



GRANT ALL ON SEQUENCE "public"."bookmarks_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."bookmarks_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."bookmarks_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."feedback" TO "anon";
GRANT ALL ON TABLE "public"."feedback" TO "authenticated";
GRANT ALL ON TABLE "public"."feedback" TO "service_role";



GRANT ALL ON SEQUENCE "public"."feedback_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."feedback_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."feedback_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."report_setup" TO "anon";
GRANT ALL ON TABLE "public"."report_setup" TO "authenticated";
GRANT ALL ON TABLE "public"."report_setup" TO "service_role";



GRANT ALL ON SEQUENCE "public"."report_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."report_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."report_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."report_user" TO "anon";
GRANT ALL ON TABLE "public"."report_user" TO "authenticated";
GRANT ALL ON TABLE "public"."report_user" TO "service_role";



GRANT ALL ON SEQUENCE "public"."report_user_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."report_user_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."report_user_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."setup_items" TO "anon";
GRANT ALL ON TABLE "public"."setup_items" TO "authenticated";
GRANT ALL ON TABLE "public"."setup_items" TO "service_role";



GRANT ALL ON SEQUENCE "public"."setup_items_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."setup_items_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."setup_items_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."setup_tags" TO "anon";
GRANT ALL ON TABLE "public"."setup_tags" TO "authenticated";
GRANT ALL ON TABLE "public"."setup_tags" TO "service_role";



GRANT ALL ON SEQUENCE "public"."setup_tags_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."setup_tags_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."setup_tags_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."setups" TO "anon";
GRANT ALL ON TABLE "public"."setups" TO "authenticated";
GRANT ALL ON TABLE "public"."setups" TO "service_role";



GRANT ALL ON SEQUENCE "public"."setups_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."setups_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."setups_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."shops" TO "anon";
GRANT ALL ON TABLE "public"."shops" TO "authenticated";
GRANT ALL ON TABLE "public"."shops" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";



























RESET ALL;
