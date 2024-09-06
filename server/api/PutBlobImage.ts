import { serverSupabaseClient } from "#supabase/server";
import authMiddleware from "./Auth";

export default defineEventHandler(async (event) => {
    await authMiddleware(event);

    const formData = await readFormData(event);
    const file = formData.get("file") as File;
    const size = formData.get("size") as string;
    const res = formData.get("res") as string;
    const path = formData.get("path") as string;

    if (!file || !file.size) {
        throw createError({ statusCode: 400, message: "No file provided" });
    }

    // const query = getQuery(event);

    if (!size || !res) {
        throw createError({
            statusCode: 400,
            message: "Query parameter 'size' and 'res' are required",
        });
    }

    try {
        const client = await serverSupabaseClient(event);

        // formData.append("size", size);
        // formData.append("res", res);

        // const url =
        //     "https://imbxeblwlopxrgexztsx.supabase.co/functions/v1/compress-image" +
        //     `?size=${query.size}&res=${query.res}`;

        // const result: any = await $fetch(url, {
        //     method: "POST",
        //     headers: {
        //         Authorization: "Bearer " + process.env.SUPABASE_KEY,
        //     },
        //     body: formData,
        // });

        const { data, error } = await client.functions.invoke(
            "compress-image",
            {
                body: formData as FormData,
            }
        );

        if (error) {
            console.error(error);
            throw createError({
                statusCode: 400,
                message: "Faild to compress image",
            });
        }

        console.log(data);
        const compressed = await data.arrayBuffer();
        const compressedBlob = new Blob([compressed], {
            type: "image/jpeg",
        });

        const unixTime = Math.floor(Date.now() / 1000);
        console.log("unixTime", unixTime);
        let base64UnixTime = Buffer.from(unixTime.toString()).toString(
            "base64"
        );
        base64UnixTime = base64UnixTime.replace(/[\\/:*?"<>|]/g, "");

        const fileName = path
            ? `${path}/${base64UnixTime}.jpg`
            : `${base64UnixTime}.jpg`;

        return await client.storage
            .from("images")
            .upload(fileName, compressedBlob, {
                cacheControl: "3600",
                upsert: false,
            });
    } catch (error) {
        console.error(error);
        throw createError({
            statusCode: 400,
            message: "Faild to upload image",
        });
    }
});
