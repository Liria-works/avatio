import { serverSupabaseClient } from '#supabase/server';

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
                    avatar,
                    badges:user_badges(
                        created_at,
                        name
                    )
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
                    unsupported,
                    category
                ),
                tags:setup_tags(tag),
                co_authors:setup_coauthors(
                    user:user_id(
                        id,
                        name,
                        avatar,
                        badges:user_badges(
                            created_at,
                            name
                        )
                    ),
                    note
                )
                `
            )
            .eq('id', Number(query.id))
            .maybeSingle<SetupDB>();

        if (!data)
            return {
                data: null,
                error: {
                    status: 404,
                    message: 'Failed to get setup.',
                },
            };

        // アイテムをカテゴリごとに動的にグループ化
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const groupedItems: Record<string, any[]> = {};
        for (const i of data.items) {
            if (!i.data) continue;

            const category = i.category || i.data.category;
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
                    badges: data.author!.badges,
                },
                name: data.name,
                description: data.description,
                unity: data.unity,
                tags: data.tags.map((t) => t.tag),
                co_authors: data.co_authors.map((c) => ({
                    id: c.user.id,
                    name: c.user.name || 'Unknown',
                    avatar: c.user.avatar,
                    badges: c.user.badges,
                    note: c.note,
                })),
                images: data.images,
                items: groupedItems,
            },
            error: null,
        };
    }
);
