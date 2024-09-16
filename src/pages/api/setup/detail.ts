import { supabase } from "../../../lib/supabase";

export async function GET({ id }: { id: number }) {
	const { data, error } = await supabase
		.from("setups")
		.select(
			"id, created_at, name, description, avatar, avatar_note, tags, author, image, setup_items(item_id, note, unsupported)",
		)
		.eq("id", id)
		.maybeSingle();

	if (error) console.error(error);

	return new Response(
		JSON.stringify({
			body: data,
		}),
	);
}
