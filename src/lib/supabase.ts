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

export async function checkSupabaseSession(cookies) {
	let authorized = false;

	const accessToken = cookies.get("sb-access-token");
	const refreshToken = cookies.get("sb-refresh-token");

	if (accessToken && refreshToken) {
		const { data, error } = await supabase.auth.setSession({
			refresh_token: refreshToken.value,
			access_token: accessToken.value,
		});

		if (error) {
			cookies.delete("sb-access-token", {
				path: "/",
			});
			cookies.delete("sb-refresh-token", {
				path: "/",
			});

			authorized = false;
		}

		if (data) {
			authorized = true;
		}
	}

	return authorized;
}
