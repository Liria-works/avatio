export interface Setup {
    id: number;
    created_at: string;
    updated_at: string;
    name: string;
    description: string | null;
    avatar: Item;
    avatar_note: string | null;
    setup_tags: { tag: string }[];
    author: {
        id: string;
        name: string;
        avatar: string;
    };
    image: string;
    setup_items: {
        item_id: Item;
        note: string;
        unsupported: boolean;
    }[];
}

export interface SetupSimple {
    id: number;
    created_at: string;
    updated_at: string;
    name: string;
    avatar: { name: string; thumbnail: string; outdated: boolean };
    author: { id: string; name: string; avatar: string };
    image: string;
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
                '画像のアップロードに失敗したため、投稿をキャンセルしました。',
                '画像の形式が非対応の可能性があります。'
            );
            throw new Error();
        }
    }

    const responseSetup = await client
        .from('setups')
        .insert({
            name: setup.name,
            description: setup.description,
            avatar: setup.avatar,
            avatar_note: setup.avatar_note,
            image: image,
        } as never)
        .select('id')
        .single();

    if (responseSetup.error) throw responseSetup.error;

    for (const item of setup.items) {
        const { error } = await client
            .from('setup_items')
            .insert({
                setup_id: responseSetup.data.id,
                item_id: item.id,
                note: item.note,
                unsupported: item.unsupported,
            } as never)
            .maybeSingle();

        if (error) throw error;
    }

    for (const tag of setup.tags) {
        const { error } = await client
            .from('setup_tags')
            .insert({
                setup_id: responseSetup.data.id,
                tag: tag,
            } as never)
            .maybeSingle();

        if (error) throw error;
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
            .from('setup_items')
            .delete()
            .eq('setup_id', Number(id));
        if (deleteError) throw deleteError;

        const { error: insertError } = await client.from('setup_items').insert(
            items.items.map((item) => ({
                setup_id: Number(id),
                item_id: item.id,
                note: useLineBreak(item.note),
                unsupported: item.unsupported,
            })) as never
        );
        if (insertError) throw insertError;

        const { error: updateError } = await client
            .from('setups')
            .update(setup as never)
            .eq('id', Number(id));

        if (updateError) throw updateError;

        return;
    } catch (error) {
        console.error(error);
        throw new Error('Faild to update setup');
    }
};

export const useDeleteSetup = async (id: number, image: string) => {
    const client = await useSBClient();

    const { error: errorDeleteSetup } = await client
        .from('setups')
        .delete()
        .eq('id', id);

    if (errorDeleteSetup) {
        useAddToast('セットアップの削除に失敗しました');
        return new Error('Faild to delete setup');
    }

    // await client.storage.from("images").remove([image]);
    await useDeleteImage(image);

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
