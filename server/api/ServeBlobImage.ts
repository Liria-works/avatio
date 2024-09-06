import { serverSupabaseClient } from "#supabase/server";

import authMiddleware from "./Auth";

export default eventHandler(async (event) => {
    await authMiddleware(event);

    const startTime = Date.now();
    const query = getQuery(event);

    if (!query.path) {
        return null;
    }

    const client = await serverSupabaseClient(event);
    const { data } = await client.storage
        .from("images")
        // .download(query.path.toString());
        .getPublicUrl(query.path.toString());
    // const result = await hubBlob().serve(event, query.path.toString());
    // logDuration(startTime);
    return data;
});

function logDuration(startTime: number) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`Fetch Image Done : ${duration}ms`);
}
