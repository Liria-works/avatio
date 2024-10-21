import sharp from 'sharp';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import authMiddleware from './Auth';

export default defineEventHandler(async (event) => {
    await authMiddleware(event);

    const runtime = useRuntimeConfig();

    const formData = await readFormData(event);
    const file = formData.get('file') as File;
    const size = formData.get('size') as string;
    const res = formData.get('res') as string;
    const path = formData.get('path') as string;

    if (!file || !file.size)
        throw createError({ statusCode: 400, message: 'No file provided' });

    if (!size || !res)
        throw createError({
            statusCode: 400,
            message: "Query parameter 'size' and 'res' are required",
        });

    try {
        const input = await file.arrayBuffer();
        const image = sharp(input);

        const maxRes = parseInt(res, 10);
        if (isNaN(maxRes) || maxRes <= 0)
            throw createError({
                statusCode: 400,
                message: 'Invalid size parameter',
            });

        let resolution = maxRes;
        const width = (await image.metadata()).width;
        const height = (await image.metadata()).height;

        if (width && height) {
            if (Math.max(width, height) < maxRes) {
                resolution = Math.max(width, height);
            }
        }

        const compressed = await image
            .resize({ width: resolution, height: resolution, fit: 'inside' })
            .toFormat('jpeg')
            .toBuffer();

        const unixTime = Math.floor(Date.now());
        console.log('unixTime', unixTime);
        let base64UnixTime = Buffer.from(unixTime.toString()).toString(
            'base64'
        );
        base64UnixTime = base64UnixTime.replace(/[\\/:*?"<>|]/g, '');

        const fileName = path
            ? `${path}/${base64UnixTime}.jpg`
            : `${base64UnixTime}.jpg`;

        const S3 = new S3Client({
            region: 'auto',
            endpoint: runtime.r2Endpoint,
            credentials: {
                accessKeyId: runtime.r2AccessKey,
                secretAccessKey: runtime.r2SecretKey,
            },
        });

        const put = new PutObjectCommand({
            ACL: 'public-read',
            Body: compressed,
            ContentType: 'image/jpeg',
            Bucket: 'avatio',
            Key: fileName,
        });

        const result = await S3.send(put);

        return Response.json({ path: fileName, result: result });
    } catch (error) {
        console.error(error);
        throw createError({
            statusCode: 400,
            message: 'Faild to upload image',
        });
    }
});
