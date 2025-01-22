import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';
import type { ApiResponse } from '~/types/types';

export interface RequestBody {
    name: string;
    description: string;
    tags: string[];
    image: string | null;
    items: { id: number; note: string; unsupported: boolean }[];
}

// Error Codes:
// 1: Failed to upload image.
// 2: DB insert error. Table: setups
// 3: DB insert error. Table: setup_items
// 4: DB insert error. Table: setup_tags
// 5: DB insert error. Table: setup_images
// 403: User is not authenticated.

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

        let image: {
            path: string;
            prefix: string;
            width?: number;
            height?: number;
        } | null = null;

        if (body.image) {
            const response = await event.$fetch<
                ApiResponse<{
                    path: string;
                    prefix: string;
                    width?: number;
                    height?: number;
                }>
            >('/api/image', {
                method: 'PUT',
                body: {
                    image: body.image,
                    resolution: 1920,
                    size: 1500,
                    prefix: 'setup',
                },
            });
            if (!response.data)
                return {
                    error: { status: 1, message: 'Failed to upload image.' },
                    data: null,
                };
            image = response.data;
        }

        const supabase = await serverSupabaseClient(event);

        const { data: setupData, error: setupError } = await supabase
            .from('setups')
            .insert({
                name: body.name,
                description: body.description,
            })
            .select('id')
            .single();
        if (setupError)
            return {
                error: { status: 2, message: 'Failed to insert on DB.' },
                data: null,
            };

        const { error: itemsError } = await supabase.from('setup_items').insert(
            body.items.map((i) => {
                return {
                    setup_id: setupData.id,
                    item_id: i.id,
                    note: i.note,
                    unsupported: i.unsupported,
                };
            })
        );
        if (itemsError)
            return {
                error: { status: 3, message: 'Failed to insert on DB.' },
                data: null,
            };

        const { error: tagsError } = await supabase.from('setup_tags').insert(
            body.tags.map((i) => {
                return {
                    setup_id: setupData.id,
                    tag: i,
                };
            })
        );
        if (tagsError)
            return {
                error: { status: 4, message: 'Failed to insert on DB.' },
                data: null,
            };

        if (image) {
            const { error: imageError } = await supabase
                .from('setup_images')
                .insert({
                    name: image.path,
                    setup_id: setupData.id,
                    width: image.width,
                    height: image.height,
                });
            if (imageError)
                return {
                    error: { status: 5, message: 'Failed to insert on DB.' },
                    data: null,
                };
        }

        return {
            error: null,
            data: {
                id: setupData.id,
            },
        };
    }
);
