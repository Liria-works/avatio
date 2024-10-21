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

export const useListBookmarks = async (): Promise<{ post: Setup }[]> => {
    const client = await useSBClient();

    const { data, error } = await client
        .from('bookmarks')
        .select(
            'post(id, created_at, updated_at, author(id, name, avatar), name, description, image, avatar(name, thumbnail))'
        );
    if (error) throw error;

    return data as never as { post: Setup }[];
};
