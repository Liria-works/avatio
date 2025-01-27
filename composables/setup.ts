import type { ApiResponse } from '#types';

const client = await useSupabaseClient();

export const useDeleteSetup = async (id: number) => {
    const { error } = await $fetch<ApiResponse<{ id: number }>>('/api/setup', {
        method: 'DELETE',
        body: { id: id },
    });

    if (error)
        return useAddToast(
            'セットアップの削除に失敗しました',
            `エラーコード : ${error.status}`
        );

    useAddToast('セットアップを削除しました');
    navigateTo('/');
};

export const useAddBookmark = async (id: number) => {
    const { data, error } = await client
        .from('bookmarks')
        .insert({ post: id } as never);
    if (error) throw error;

    useAddToast('ブックマークに追加しました。');
    return data;
};

export const useRemoveBookmark = async (id: number) => {
    const { data, error } = await client
        .from('bookmarks')
        .delete()
        .eq('post', id);
    if (error) throw error;

    useAddToast('ブックマークから削除しました。');
    return data;
};

export const useCheckBookmark = async (id: number) => {
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
