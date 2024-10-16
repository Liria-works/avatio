export const useFetchBooth = async (id: number): Promise<Item | null> => {
    // const storeBoothItems = useBoothItems();
    // const { AddItem } = storeBoothItems;
    // const { boothItems } = storeToRefs(storeBoothItems);

    if (!id) return null;

    // if (boothItems.value[id]) {
    //     // console.log("Returning cached item", id);
    //     return boothItems.value[id];
    // }

    const client = await useSBClient();
    const { data: itemData } = await client
        .from("items")
        .select(
            "id, name, thumbnail, price, category, shop_id(id, name, thumbnail, verified), nsfw, outdated, updated_at"
        )
        .eq("id", id)
        .maybeSingle();

    if (itemData) {
        const timeDifference =
            new Date().getTime() - new Date(itemData.updated_at).getTime();

        // 時間の差分が1日を超えている場合、処理継続する
        if (timeDifference < 24 * 60 * 60 * 1000) {
            return itemData as unknown as Item;
        }
        console.log("Data is old, fetching from Booth");
    }

    const apiUrl = `/api/item/booth?id=${encodeURIComponent(id)}`;

    const runtimeConfig = useRuntimeConfig();

    const response: {
        status: number;
        body: Item;
    } = await $fetch(apiUrl, {
        method: "GET",
        headers: {
            Authorization: runtimeConfig.public.token,
        },
    });

    if (response.status !== 200 || response.body.outdated) {
        // console.error("Failed to fetch item data:", response.body);
        return null;
    }

    // AddItem(response.body.id, response.body);

    return response.body;
};

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
