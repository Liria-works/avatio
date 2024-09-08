import { serverSupabaseClient } from "#supabase/server";

import authMiddleware from "./Auth";

export default eventHandler(async (event): Promise<string | null> => {
    await authMiddleware(event);

    const query = getQuery(event);

    if (!query.path) {
        return null;
    }

    const client = await serverSupabaseClient(event);
    const { data } = await client.storage
        .from("images")
        .getPublicUrl(query.path.toString());

    return data.publicUrl;
});
