export interface Item {
    id: number;
    updated_at: string;
    category: number;
    name: string;
    thumbnail: string;
    price: string;
    shop_id: { id: string; name: string; thumbnail: string; verified: boolean };
    nsfw: boolean;
    outdated: boolean;
}

export interface SetupItem {
    note: string;
    unsupported: boolean;
    id: number;
    updated_at: string;
    category: number;
    name: string;
    thumbnail: string;
    price: string;
    shop_id: { id: string; name: string; thumbnail: string; verified: boolean };
    nsfw: boolean;
    outdated: boolean;
}

export const useFetchBooth = async (id: number): Promise<Item | null> => {
    if (!id) return null;

    const client = await useSBClient();
    const { data: itemData } = await client
        .from('items')
        .select(
            'id, name, thumbnail, price, category, shop_id(id, name, thumbnail, verified), nsfw, outdated, updated_at'
        )
        .eq('id', id)
        .maybeSingle();

    if (itemData) {
        const timeDifference =
            new Date().getTime() - new Date(itemData.updated_at).getTime();

        // 時間の差分が1日を超えている場合、処理継続する
        if (timeDifference < 24 * 60 * 60 * 1000) {
            return itemData as unknown as Item;
        }
        console.log('Data is old, fetching from Booth');
    }

    const response: { status: number; body: Item } = await $fetch(
        `/api/item/booth?id=${encodeURIComponent(id)}`,
        { method: 'GET' }
    );

    if (response.status !== 200 || response.body.outdated) {
        // console.error("Failed to fetch item data:", response.body);
        return null;
    }

    // AddItem(response.body.id, response.body);

    return response.body;
};

export const useGetOwnedAvatars = async (): Promise<
    { id: number; name: string; thumbnail: string }[] | null
> => {
    const client = await useSBClient();
    const user = useSupabaseUser();

    if (!user.value) {
        return null;
    }

    const { data, error } = await client
        .from('setups')
        .select('avatar')
        .eq('author', user.value.id);

    if (!error) {
        const response = [];

        let owned = data.map((obj: { avatar: number }) => obj.avatar);
        owned = [...new Set(owned)];

        for (const i of owned) {
            const result = await useFetchBooth(Number(i));
            if (!result) {
                continue;
            }
            response.push({
                id: result.id,
                name: result.name,
                thumbnail: result.thumbnail,
            });
        }
        return response;
    } else {
        console.error(error);
        return null;
    }
};

export const useGetPopularAvatars = async (): Promise<
    { id: number; name: string; thumbnail: string }[] | null
> => {
    const client = await useSBClient();

    const { data, error } = await client.rpc('avatars_order_by_count');

    if (!error) {
        const response = [];

        for (const key in data) {
            const result = await useFetchBooth(data[key].avatar);
            if (!result) {
                continue;
            }
            response.push({
                id: result.id,
                name: result.name,
                thumbnail: result.thumbnail,
            });
        }

        return response;
    } else {
        console.error(error);
        return null;
    }
};
