import { defineMiddleware } from "astro:middleware";
import { supabase } from "../lib/supabase";

export const onRequest = defineMiddleware(
	async ({ locals, url, cookies, redirect }, next) => {
		const accessToken = cookies.get("sb-access-token");
		const refreshToken = cookies.get("sb-refresh-token");

		if (!accessToken) {
			cookies.delete("sb-refresh-token", {
				path: "/",
			});
			return next();
		}

		if (!refreshToken) {
			cookies.delete("sb-access-token", {
				path: "/",
			});
			return next();
		}

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
		}

		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		cookies.set("sb-access-token", data?.session?.access_token!, {
			sameSite: "strict",
			path: "/",
			secure: true,
		});
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		cookies.set("sb-refresh-token", data?.session?.refresh_token!, {
			sameSite: "strict",
			path: "/",
			secure: true,
		});

		return next();
	},
);
