import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

export const supabaseServiceRole = await createClient(
	import.meta.env.PUBLIC_SUPABASE_URL,
	import.meta.env.SUPABASE_SERVICE_ROLE_KEY,
);

export const POST: APIRoute = async ({ request }) => {
	const requestBody = await request.json();
	const id = requestBody.id;

	if (!requestBody || !id)
		return new Response("Request body required", { status: 400 });

	const { data, error } = await supabaseServiceRole.functions.invoke(
		"get-booth-item",
		{
			body: { id: id },
		},
	);

	if (error || !data) {
		await supabaseServiceRole
			.from("items")
			.update({ outdated: true })
			.eq("id", id);
		// アイテムがDBに無い場合エラーを返すが、アイテムを登録する目的ではないため問題なし

		return new Response(error.message, { status: 400 });
	}

	const itemData = {
		id: data.id,
		name: data.name,
		thumbnail: data.thumbnail,
		price: data.price,
		category: data.category,
		shop_id: data.shop_id,
		nsfw: data.nsfw,
		// todo: outdated
	};

	const shopData = {
		id: data.shop_id,
		name: data.shop,
		thumbnail: data.shop_thumbnail,
		verified: data.shop_verified,
		// todo: ショップが存在しない場合の処理
	};

	const { error: shopError } = await supabaseServiceRole
		.from("shops")
		.upsert(shopData)
		.eq("id", data.shop_id);

	if (shopError) {
		return new Response(shopError.message, { status: 400 });
	}

	const { error: itemError } = await supabaseServiceRole
		.from("items")
		.upsert(itemData)
		.eq("id", id);

	if (itemError) {
		return new Response(itemError.message, { status: 400 });
	}

	return new Response(JSON.stringify(data), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
};
