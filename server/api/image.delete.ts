import { serverSupabaseUser } from '#supabase/server';
import { createStorage } from 'unstorage';
import s3Driver from 'unstorage/drivers/s3';
import type { ApiResponse } from '~/types';

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

export default defineEventHandler(
    async (event): Promise<ApiResponse<{ path: string }>> => {
        try {
            const user = await serverSupabaseUser(event);
            if (!user) throw new Error();
        } catch {
            return {
                error: { status: 403, message: 'Forbidden.' },
                data: null,
            };
        }

        const query: { name: string; prefix: string } = getQuery(event);

        if (!query.name)
            return {
                error: { status: 400, message: 'No path provided.' },
                data: null,
            };

        const target = query.prefix
            ? `${query.prefix}/${query.name}`
            : query.name;

        console.log('Deleting image on R2.', target);
        await storage.del(target);

        if (await storage.has(target)) {
            console.error('Failed to delete image on R2.', target);
            return {
                error: { status: 400, message: 'Delete on R2 failed.' },
                data: null,
            };
        }

        return {
            error: null,
            data: { path: target },
        };
    }
);
