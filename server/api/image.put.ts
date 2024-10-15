import { serverSupabaseClient } from "#supabase/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import authMiddleware from "./Auth";

export default defineEventHandler(async (event) => {
    await authMiddleware(event);

    const runtime = useRuntimeConfig();

    const formData = await readFormData(event);
    const file = formData.get("file") as File;
    const size = formData.get("size") as string;
    const res = formData.get("res") as string;
    const path = formData.get("path") as string;

    if (!file || !file.size) {
        throw createError({ statusCode: 400, message: "No file provided" });
    }

    if (!size || !res) {
        throw createError({
            statusCode: 400,
            message: "Query parameter 'size' and 'res' are required",
        });
    }

    try {
        const client = await serverSupabaseClient(event);

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
        // const compressedBlob = new Blob([compressed], {
        //     type: "image/jpeg",
        // });

        const unixTime = Math.floor(Date.now() / 1000);
        console.log("unixTime", unixTime);
        let base64UnixTime = Buffer.from(unixTime.toString()).toString(
            "base64"
        );
        base64UnixTime = base64UnixTime.replace(/[\\/:*?"<>|]/g, "");

        const fileName = path
            ? `${path}/${base64UnixTime}.jpg`
            : `${base64UnixTime}.jpg`;

        const S3 = new S3Client({
            region: "auto",
            endpoint: runtime.r2Endpoint,
            credentials: {
                accessKeyId: runtime.r2AccessKey,
                secretAccessKey: runtime.r2SecretKey,
            },
        });

        const put = new PutObjectCommand({
            ACL: "public-read",
            Body: compressed,
            Bucket: "avatio",
            Key: fileName,
        });

        const result = await S3.send(put);

        return Response.json({ path: fileName, result: result });
    } catch (error) {
        console.error(error);
        throw createError({
            statusCode: 400,
            message: "Faild to upload image",
        });
    }
});
