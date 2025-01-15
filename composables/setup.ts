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

    if (image) await useDeleteImage(`setup:${image}`);

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
