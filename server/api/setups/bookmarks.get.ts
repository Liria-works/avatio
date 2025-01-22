import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';
import type { ApiResponse, SetupClient, SetupDB } from '~/types/types';
import setupMoldingClient from '~/utils/setupMoldingClient';

interface RequestQuery {
    userId: string;
    page: number;
    perPage: number;
}

export default defineEventHandler(
    async (event): Promise<ApiResponse<SetupClient[]>> => {
        try {
            const user = await serverSupabaseUser(event);
            if (!user) throw new Error();
        } catch {
            return {
                error: { status: 403, message: 'Forbidden.' },
                data: null,
            };
        }

        const query: RequestQuery = await getQuery(event);

        const supabase = await serverSupabaseClient(event);

        const { data } = await supabase
            .from('bookmarks')
            .select(
                `
                post(
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
                )
                `
            )
            .range(
                query.page * query.perPage,
                query.page * query.perPage + (query.perPage - 1)
            )
            .order('created_at', { ascending: false })
            .returns<{ post: SetupDB }[]>();

        if (!data)
            return {
                data: null,
                error: {
                    status: 500,
                    message: 'Failed to get setups.',
                },
            };

        return {
            data: data
                .map((post) => post.post)
                .map((setup) => setupMoldingClient(setup)),
            error: null,
        };
    }
);
