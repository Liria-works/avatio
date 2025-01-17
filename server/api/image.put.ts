import sharp from 'sharp';
import { createStorage } from 'unstorage';
import s3Driver from 'unstorage/drivers/s3';
import authMiddleware from './auth';

const runtime = useRuntimeConfig();

const storage = createStorage({
    driver: s3Driver({
        accessKeyId: runtime.r2.accessKey,
        secretAccessKey: runtime.r2.secretKey,
        endpoint: runtime.r2.endpoint,
        bucket: 'avatio',
        region: 'auto',
    }),
});

export default defineEventHandler(async (event) => {
    const authenticated = await authMiddleware(event);
    if (!authenticated)
        return sendError(
            event,
            createError({ statusCode: 403, statusMessage: 'Forbidden' })
        );

    const formData = await readFormData(event);
    const file = formData.get('file') as File;
    const size = formData.get('size') as string;
    const res = formData.get('res') as string;
    const path = (formData.get('path') as string) ?? '';

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

        if (width && height)
            if (Math.max(width, height) < maxRes)
                resolution = Math.max(width, height);

        const compressed = await image
            .resize({ width: resolution, height: resolution, fit: 'inside' })
            .toFormat('jpeg')
            .toBuffer();

        const metadata = await sharp(compressed).metadata();

        const unixTime = Math.floor(Date.now());
        let base64UnixTime = Buffer.from(unixTime.toString()).toString(
            'base64'
        );
        base64UnixTime = base64UnixTime.replace(/[\\/:*?"<>|]/g, '');

        const fileName = `${base64UnixTime}.jpg`;
        const fileNamePrefixed = `${path.length ? `${path}:` : ''}${fileName}`;

        await storage.setItemRaw(fileNamePrefixed, compressed);
        const success = await storage.has(fileNamePrefixed);

        return Response.json({
            success: success,
            path: fileName,
            prefix: path,
            width: metadata.width,
            height: metadata.height,
        });
    } catch (error) {
        console.error(error);
        throw createError({
            statusCode: 400,
            message: 'Faild to upload image',
        });
    }
});
