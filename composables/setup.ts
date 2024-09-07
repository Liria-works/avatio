export interface Setup {
    id: number;
    name: string;
    avatar: number;
    avatar_note: string;
    setup_items: { item_id: number; note: string; unsupported: boolean }[];
    description: string;
    tags: string[];
    author: string;
    image: string;
    created_at: string;
}

export const usePublishSetup = async (
    setup: {
        name: string;
        description: string;
        tags: string[];
        avatar: number;
        avatar_note: string;
        items: { id: number; note: string; unsupported: boolean }[];
    },
    file?: File | null
): Promise<number> => {
    const client = await useSBClient();

    let image: string | null = null;

    if (file) {
        image = await usePostImage(file);
        // image = await uploadImage();

        if (!image) {
            useAddToast(
                "画像のアップロードに失敗したため、投稿をキャンセルしました。",
                "画像の形式が非対応の可能性があります。"
            );
            throw new Error();
        }
    }

    const responseSetup = await client
        .from("setups")
        .insert({
            name: setup.name,
            description: setup.description,
            tags: setup.tags,
            avatar: setup.avatar,
            avatar_note: setup.avatar_note,
            image: image,
        } as never)
        .select("id")
        .single();

    if (responseSetup.error) {
        throw responseSetup.error;
    }

    for (const item of setup.items) {
        const responseItems = await client
            .from("setup_items")
            .insert({
                setup_id: responseSetup.data.id,
                item_id: item.id,
                note: item.note,
                unsupported: item.unsupported,
            } as never)
            .maybeSingle();

        if (responseItems.error) {
            throw responseItems.error;
        }
    }

    return responseSetup.data.id;
};

export const useUpdateSetup = async (
    id: number,
    setup: {
        name: string;
        description: string;
        tags: string[];
        avatar: number | null;
        avatar_note: string;
    },
    items: {
        avatar: number | null;
        avatar_note: string;
        items: {
            id: number;
            category: number;
            note: string;
            unsupported: boolean;
        }[];
    }
) => {
    const client = await useSBClient();

    try {
        const { error: deleteError } = await client
            .from("setup_items")
            .delete()
            .eq("setup_id", Number(id));
        if (deleteError) {
            throw deleteError;
        }

        const { error: insertError } = await client.from("setup_items").insert(
            items.items.map((item) => ({
                setup_id: Number(id),
                item_id: item.id,
                note: useLineBreak(item.note),
                unsupported: item.unsupported,
            })) as never
        );
        if (insertError) {
            throw insertError;
        }

        const { error: updateError } = await client
            .from("setups")
            .update(setup as never)
            .eq("id", Number(id));

        if (updateError) {
            throw updateError;
        }

        return;
    } catch (error) {
        console.error(error);
        throw new Error("Faild to update setup");
    }
};

export const useDeleteSetup = async (id: number, image: string) => {
    const client = await useSBClient();
    const router = useRouter();

    const { error } = await client.from("setups").delete().eq("id", id);

    if (error) {
        useAddToast("セットアップの削除に失敗しました");
        return new Error("Faild to delete setup");
    }

    await client.storage.from("images").remove([image]);

    useAddToast("セットアップを削除しました");
    router.push("/");
};
