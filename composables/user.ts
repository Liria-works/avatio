export const useSaveUsername = async (username: string) => {
    const client = await useSBClient();
    const user = useSupabaseUser();

    if (username === '') return useAddToast('ユーザー名を入力してください');

    const { error } = await client
        .from('users')
        .update({ name: username } as never)
        .eq('id', user.value.id);

    if (error) {
        useAddToast('ユーザー名の変更に失敗しました');
        throw error;
    }

    useAddToast('ユーザー名を変更しました');
};

export const useSaveBio = async (bio: string) => {
    const client = await useSBClient();
    const user = useSupabaseUser();

    const { error } = await client
        .from('users')
        .update({ bio: useLineBreak(bio) } as never)
        .eq('id', user.value.id);

    if (error) {
        useAddToast('bioの変更に失敗しました');
        throw error;
    }

    useAddToast('bioを変更しました');
};

export const useSaveLink = async (links: string[]) => {
    const client = await useSBClient();
    const user = useSupabaseUser();

    const { error } = await client
        .from('users')
        .update({ links: links } as never)
        .eq('id', user.value.id);

    if (error) {
        useAddToast('リンクの変更に失敗しました');
        throw error;
    }

    useAddToast('リンクを変更しました');
};
