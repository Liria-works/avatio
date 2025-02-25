import { serverSupabaseClient } from '#supabase/server';
import type { ApiResponse, SetupClient } from '~/types';

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
                unity,
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
                        likes,
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
                tags:setup_tags(tag),
                co_authors:setup_coauthors(
                    user_id(
                        id,
                        name,
                        avatar
                    ),
                    note
                )
                `
            )
            .eq('id', Number(query.id))
            .maybeSingle();

        if (!data)
            return {
                data: null,
                error: { status: 404, message: 'Failed to get setup.' },
            };

        // アイテムをカテゴリごとに動的にグループ化
        const groupedItems: Record<string, any[]> = {};
        for (const i of data.items) {
            if (!i.data) continue;
            const category = i.data.category;
            if (!groupedItems[category]) groupedItems[category] = [];
            groupedItems[category].push({
                ...i.data,
                note: i.note,
                unsupported: i.unsupported,
            });
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
                unity: data.unity,
                tags: data.tags.map((t) => t.tag),
                co_authors: data.co_authors.map((c) => ({
                    id: c.user_id.id,
                    name: c.user_id.name || 'Unknown',
                    avatar: c.user_id.avatar,
                    note: c.note,
                })),
                images: data.images,
                items: groupedItems,
            },
            error: null,
        };
    }
);
