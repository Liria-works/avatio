import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';
import type { ApiResponse } from '~/types/types';

export interface RequestBody {
    id: number;
}

export default defineEventHandler(
    async (event): Promise<ApiResponse<{ id: number }>> => {
        try {
            const user = await serverSupabaseUser(event);
            if (!user) throw new Error();
        } catch {
            return {
                error: { status: 403, message: 'Forbidden.' },
                data: null,
            };
        }

        const body: RequestBody = await readBody(event);

        const supabase = await serverSupabaseClient(event);

        const { data: setupData } = await supabase
            .from('setups')
            .select('images:setup_images(name)')
            .eq('id', body.id)
            .maybeSingle();

        if (!setupData)
            return {
                error: { status: 404, message: 'Failed to get setup.' },
                data: null,
            };

        const { error } = await supabase
            .from('setups')
            .delete()
            .eq('id', body.id);

        if (error)
            return {
                error: { status: 1, message: 'Failed to delete setup.' },
                data: null,
            };

        const failed = [];

        for (const image of setupData.images) {
            const res: ApiResponse<{ path: string }> = await event.$fetch(
                `/api/image`,
                {
                    method: 'DELETE',
                    query: { name: image.name, prefix: 'setup' },
                }
            );
            if (res.error) failed.push(image.name);
        }

        if (failed.length)
            return {
                error: {
                    status: 2,
                    message: `Failed to delete images. ${failed.join(', ')}`,
                },
                data: null,
            };

        return {
            error: null,
            data: { id: body.id },
        };
    }
);
