import { get } from "@vercel/edge-config";

export default defineEventHandler(async (event) => {
    const key = getRouterParam(event, "key");

    if (!key) return Response.json({ message: "No key provided", status: 400 });

    const value = await get(key);

    if (!value) return Response.json({ message: "Not found", status: 404 });

    return Response.json({
        message: "Success",
        key: key,
        value: value,
        status: 200,
    });
});
