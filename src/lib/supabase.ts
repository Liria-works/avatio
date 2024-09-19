import { createClient } from "@supabase/supabase-js";
// import type { Database } from "../../database.types";

// export const supabase = createClient<Database>(
// 	import.meta.env.SUPABASE_URL,
// 	import.meta.env.SUPABASE_ANON_KEY,
// );

export const supabase = await createClient(
	import.meta.env.PUBLIC_SUPABASE_URL,
	import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
);
