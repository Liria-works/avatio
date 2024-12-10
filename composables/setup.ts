export const usePublishSetup = async (
    setup: {
        name: string;
        description: string;
        tags: string[];
        items: { id: number; note: string; unsupported: boolean }[];
    },
    file?: File | null
): Promise<number> => {
    const client = await useSBClient();

    let image: string | null = null;

    if (file) {
        image = await usePostImage(file);

        if (!image) {
            useAddToast(
                '画像のアップロードに失敗したため、投稿をキャンセルしました。',
                '画像の形式が非対応の可能性があります。'
            );
            throw new Error();
        }
    }

    const { data: setupData, error: setupError } = await client
        .from('setups')
        .insert({
            name: setup.name,
            description: setup.description,
            image: image,
        })
        .select('id')
        .single();
    if (setupError) throw setupError;

    const { error: itemsError } = await client.from('setup_items').insert(
        setup.items.map((i) => {
            return {
                setup_id: setupData.id,
                item_id: i.id,
                note: i.note,
                unsupported: i.unsupported,
            };
        })
    );
    if (itemsError) throw itemsError;

    const { error: tagsError } = await client.from('setup_tags').insert(
        setup.tags.map((i) => {
            return {
                setup_id: setupData.id,
                tag: i,
            };
        })
    );
    if (tagsError) throw tagsError;

    return setupData.id;
};

export const useDeleteSetup = async (id: number, image: string | null) => {
    const client = await useSBClient();

    const { error: errorDeleteSetup } = await client
        .from('setups')
        .delete()
        .eq('id', id);

    if (errorDeleteSetup) {
        useAddToast('セットアップの削除に失敗しました');
        return new Error('Faild to delete setup');
    }

    if (image) await useDeleteImage(image);

    useAddToast('セットアップを削除しました');
    navigateTo('/');
};

export const useGetPopularTags = async () => {
    const client = await useSBClient();

    const { data, error } = await client.rpc('tags_order_by_count');

    if (!error) {
        return data.map((obj: { tag: string }) => obj.tag);
    } else {
        console.error(error);
        return null;
    }
};

export const useAddBookmark = async (id: number) => {
    const client = await useSBClient();

    const { data, error } = await client
        .from('bookmarks')
        .insert({ post: id } as never);
    if (error) throw error;

    useAddToast('ブックマークに追加しました。');
    return data;
};

export const useRemoveBookmark = async (id: number) => {
    const client = await useSBClient();

    const { data, error } = await client
        .from('bookmarks')
        .delete()
        .eq('post', id);
    if (error) throw error;

    useAddToast('ブックマークから削除しました。');
    return data;
};

export const useCheckBookmark = async (id: number) => {
    const client = await useSBClient();
    const user = useSupabaseUser();

    if (!user.value) return false;

    const { data, error } = await client
        .from('bookmarks')
        .select('post')
        .eq('user_id', user.value.id)
        .eq('post', id);
    if (error) throw error;

    return Boolean(data.length);
};

export const useBookmarks = async (): Promise<Setup[]> => {
    const client = await useSBClient();

    const { data, error } = await client
        .from('bookmarks')
        .select(
            `
            post(
                id,
                created_at,
                author(id, name, avatar),
                name,
                description,
                image,
                items:setup_items(
                    data:item_id(
                        id, updated_at, outdated, category, name, thumbnail, price, shop:shop_id(id, name, thumbnail, verified), nsfw
                    ),
                    note,
                    unsupported
                )
            )
            `
        )
        .order('created_at', { ascending: false });
    if (error) throw error;

    return data.map((i) => i.post as unknown as Setup);
};
