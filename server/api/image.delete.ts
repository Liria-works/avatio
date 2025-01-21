import { serverSupabaseUser } from '#supabase/server';
import { createStorage } from 'unstorage';
import s3Driver from 'unstorage/drivers/s3';

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
    try {
        const user = await serverSupabaseUser(event);
        if (!user) throw new Error();
    } catch {
        return Response.json({
            error: 'Forbidden.',
            data: null,
        });
    }

    const query: { path: string } = getQuery(event);

    if (!query.path)
        return Response.json({
            error: { status: 400, message: 'No path provided.' },
            data: null,
        });

    await storage.del(query.path);
    if (!(await storage.has(query.path)))
        return Response.json({
            error: { status: 400, message: 'Delete on R2 failed.' },
            data: null,
        });

    return Response.json({
        error: null,
        data: {
            path: query.path,
        },
    });
});
