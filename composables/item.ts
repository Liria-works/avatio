export interface Item {
    id: number;
    updated_at: string;
    category: number;
    name: string;
    thumbnail: string;
    price: string | null;
    shop: { id: string; name: string; thumbnail: string; verified: boolean };
    nsfw: boolean;
    outdated: boolean;
}

export interface SetupItem extends Item {
    note: string;
    unsupported: boolean;
}

export const useFetchBooth = async (id: number): Promise<Item | null> => {
    if (!id) return null;

    const client = await useSBClient();
    const { data: itemData } = await client
        .from('items')
        .select(
            'id, name, thumbnail, price, category, shop:shop_id(id, name, thumbnail, verified), nsfw, outdated, updated_at'
        )
        .eq('id', id)
        .maybeSingle();

    // 時間の差分が1日を超えている場合、処理継続する
    if (itemData) {
        const timeDifference =
            new Date().getTime() - new Date(itemData.updated_at).getTime();

        if (timeDifference < 24 * 60 * 60 * 1000) {
            return itemData as unknown as Item;
        }
        console.log('Data is old, fetching from Booth');
    }

    const response = await $fetch('/api/item/booth', {
        method: 'GET',
        query: { id: encodeURIComponent(id) },
    });

    if (!response.data || response.data?.outdated) {
        return null;
    }

    // AddItem(response.body.id, response.body);

    return {
        id: response.data.id,
        updated_at: new Date().toISOString(),
        category: response.data.category,
        name: response.data.name,
        thumbnail: response.data.thumbnail,
        price: response.data.price,
        shop: response.data.shop,
        nsfw: response.data.nsfw,
        outdated: false,
    };
};

export const useGetOwnedAvatars = async (): Promise<
    { id: number; name: string; thumbnail: string }[] | null
> => {
    const client = await useSBClient();
    const user = useSupabaseUser();

    if (!user.value) return null;

    const { data, error } = await client
        .from('setups')
        .select('avatar')
        .eq('author', user.value.id);

    if (error) {
        console.error(error);
        return null;
    }

    const response = [];

    let owned = data.map((obj: { avatar: number }) => obj.avatar);
    owned = [...new Set(owned)];

    for (const i of owned) {
        const result = await useFetchBooth(Number(i));
        if (!result) continue;

        response.push({
            id: result.id,
            name: result.name,
            thumbnail: result.thumbnail,
        });
    }
    return response;
};

export const useGetPopularAvatars = async (): Promise<
    { id: number; name: string; thumbnail: string }[] | null
> => {
    const client = await useSBClient();

    const { data, error } = await client.rpc('avatars_order_by_count');

    if (error) {
        console.error(error);
        return null;
    }

    const response = [];

    for (const key in data) {
        const result = await useFetchBooth(data[key].avatar);
        if (!result) continue;

        response.push({
            id: result.id,
            name: result.name,
            thumbnail: result.thumbnail,
        });
    }

    return response;
};
