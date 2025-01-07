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

    const query: { path: string } = getQuery(event);

    if (!query.path)
        return Response.json({ message: 'No path provided', status: 400 });

    await storage.del(query.path);
    const success = !(await storage.has(query.path));

    return Response.json({
        path: query.path,
        success: success,
    });
});
