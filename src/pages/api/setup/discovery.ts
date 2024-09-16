import { supabase } from "../../../lib/supabase";

export async function GET() {
	const { data: setups, error } = await supabase
		.from("setups")
		.select(
			"id, created_at, updated_at, author(id, name, avatar), name, image, avatar(name, thumbnail)",
		)
		.range(0, 20)
		.order("created_at", { ascending: false });

	if (error) console.error(error);

	return new Response(
		JSON.stringify({
			body: setups,
		}),
	);
}
