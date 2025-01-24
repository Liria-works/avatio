import { serverSupabaseClient } from '#supabase/server';
import type { ApiResponse, SetupClient } from '~/types/types';

export interface RequestQuery {
    id: number;
}

export default defineEventHandler(
    async (event): Promise<ApiResponse<SetupClient>> => {
        const query: RequestQuery = await getQuery(event);

        const supabase = await serverSupabaseClient(event);

        const { data } = await supabase
            .from('setups')
            .select(
                `
                id,
                created_at,
                name,
                description,
                author(
                    id,
                    name,
                    avatar
                ),
                images:setup_images(
                    name,
                    width,
                    height
                ),
                items:setup_items(
                    data:item_id(
                        id,
                        updated_at,
                        outdated,
                        category,
                        name,
                        thumbnail,
                        price,
                        shop:shop_id(
                            id,
                            name,
                            thumbnail,
                            verified
                        ),
                        nsfw,
                        source
                    ),
                    note,
                    unsupported
                ),
                tags:setup_tags(tag)
                `
            )
            .eq('id', Number(query.id))
            .maybeSingle();

        if (!data)
            return {
                data: null,
                error: { status: 404, message: 'Failed to get setup.' },
            };

        const items: Pick<SetupClient, 'items'> = {
            items: { avatar: [], cloth: [], accessory: [], other: [] },
        };

        for (const i of data.items) {
            if (!i.data) continue;

            const item = {
                ...i.data,
                note: i.note,
                unsupported: i.unsupported,
            };

            if (i.data.category === 'avatar') items.items.avatar.push(item);
            else if (i.data.category === 'cloth') items.items.cloth.push(item);
            else if (i.data.category === 'accessory')
                items.items.accessory.push(item);
            else items.items.other.push(item);
        }

        return {
            data: {
                id: data.id,
                created_at: data.created_at,
                author: {
                    id: data.author!.id,
                    name: data.author!.name || 'Unknown',
                    avatar: data.author!.avatar,
                },
                name: data.name,
                description: data.description,
                tags: data.tags.map((t) => t.tag),
                images: data.images,
                items: items.items,
            },
            error: null,
        };
    }
);
