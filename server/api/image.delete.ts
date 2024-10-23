import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import authMiddleware from './auth';

export default defineEventHandler(async (event) => {
    await authMiddleware(event);

    const runtime = useRuntimeConfig();

    const S3 = new S3Client({
        region: 'auto',
        endpoint: runtime.r2Endpoint,
        credentials: {
            accessKeyId: runtime.r2AccessKey,
            secretAccessKey: runtime.r2SecretKey,
        },
    });

    const query = getQuery(event);
    const path = query.path;

    if (!path)
        return Response.json({ message: 'No path provided', status: 400 });

    const del = new DeleteObjectCommand({
        Bucket: 'avatio',
        Key: path.toString(),
    });

    const result = await S3.send(del);

    return result;
});
