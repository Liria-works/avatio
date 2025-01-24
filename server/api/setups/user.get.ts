import { serverSupabaseClient } from '#supabase/server';
import type { ApiResponse, SetupClient } from '~/types/types';
import setupMoldingClient from '~/utils/setupMoldingClient';

interface RequestQuery {
    userId: string;
    page: number;
    perPage: number;
}

export default defineEventHandler(
    async (
        event
    ): Promise<ApiResponse<{ setups: SetupClient[]; hasMore: boolean }>> => {
        const query: RequestQuery = await getQuery(event);

        const supabase = await serverSupabaseClient(event);

        const { data, count } = await supabase
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
                `,
                { count: 'estimated' }
            )
            .eq('author', query.userId)
            .range(
                query.page * query.perPage,
                query.page * query.perPage + (query.perPage - 1)
            )
            .order('created_at', { ascending: false });

        if (!data || !count)
            return {
                data: null,
                error: {
                    status: 500,
                    message: 'Failed to get setups.',
                },
            };

        return {
            data: {
                setups: data.map((setup) => setupMoldingClient(setup)),
                hasMore: count > query.page * query.perPage + query.perPage,
            },
            error: null,
        };
    }
);
