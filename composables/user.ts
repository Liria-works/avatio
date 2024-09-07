export const useSaveUsername = async (username: string) => {
    const client = await useSupabaseClient();
    const user = useSupabaseUser();

    if (username === "") {
        useAddToast("ユーザー名を入力してください");
        return;
    }
    const { error } = await client
        .from("users")
        .update({ name: username } as never)
        .eq("id", user.value.id);

    if (error) {
        useAddToast("ユーザー名の変更に失敗しました");
        throw error;
    }

    useAddToast("ユーザー名を変更しました");
};

export const useSaveBio = async (bio: string) => {
    const client = await useSupabaseClient();
    const user = useSupabaseUser();

    const { error } = await client
        .from("users")
        .update({ bio: useLineBreak(bio) } as never)
        .eq("id", user.value.id);

    if (error) {
        useAddToast("bioの変更に失敗しました");
        throw error;
    }

    useAddToast("bioを変更しました");
};

export const useChangeAvatar = async () => {
    const client = await useSupabaseClient();
    const user = useSupabaseUser();

    const storeMyAvatar = useMyAvatar();
    const { GetMyAvatar } = storeMyAvatar;

    const { open, onChange } = useFileDialog({
        accept: "image/png, image/jpeg, image/tiff", // Set to accept only image files
        multiple: false,
    });

    const faild = () => {
        useAddToast("アバターの変更に失敗しました");
        throw new Error("Failed to change avatar");
    };

    open();
    onChange(async (files) => {
        if (!files || files.length === 0) throw new Error("No files selected");
        const file = files[0];

        const uploaded = await useUploadAvatar(file);

        if (!uploaded) {
            faild();
            return;
        }

        const legacy = await client
            .from("users")
            .select("avatar")
            .eq("id", user.value.id)
            .single();

        const { error } = await client
            .from("users")
            .update({ avatar: uploaded } as never)
            .eq("id", user.value.id);

        if (error) {
            faild();
            return;
        }

        if (legacy.data) {
            await client.storage.from("images").remove([legacy.data.avatar]);
        }

        await GetMyAvatar();
        useAddToast("アバターを変更しました");
    });
};

export const useSaveLink = async (links: string[]) => {
    const client = await useSBClient();
    const user = useSupabaseUser();

    const { error } = await client
        .from("users")
        .update({ links: links } as never)
        .eq("id", user.value.id);

    if (error) {
        useAddToast("リンクの変更に失敗しました");
        throw error;
    }

    useAddToast("リンクを変更しました");
};
