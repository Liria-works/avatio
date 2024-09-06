export const useAddBookmark = async (id: number) => {
    const client = await useSupabaseClient();

    const { data, error } = await client
        .from("bookmarks")
        .insert({ post: id } as never);
    if (error) {
        throw error;
    }
    useAddToast("ブックマークに追加しました。");
    return data;
};

export const useRemoveBookmark = async (id: number) => {
    const client = await useSupabaseClient();

    const { data, error } = await client
        .from("bookmarks")
        .delete()
        .eq("post", id);
    if (error) {
        throw error;
    }
    useAddToast("ブックマークから削除しました。");
    return data;
};

export const useCheckBookmark = async (id: number) => {
    const client = await useSBClient();
    const user = useSupabaseUser();

    if (!user.value) {
        return false;
    }

    const { data, error } = await client
        .from("bookmarks")
        .select("post")
        .eq("user_id", user.value.id)
        .eq("post", id);
    if (error) {
        throw error;
    }
    return Boolean(data.length);
};

export const useListBookmarks = async (): Promise<{ post: Setup }[]> => {
    const client = await useSupabaseClient();

    const { data, error } = await client
        .from("bookmarks")
        .select(
            "post(id, description, created_at, name, author, avatar, image)"
        );
    if (error) {
        throw error;
    }
    return data;
};
