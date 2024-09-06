import type { Languages } from "./i18n";

export const useFetchBooth = async ({
    id = null,
    url = null,
}: {
    id: number | number[] | null;
    url: string | null;
}) => {
    const storeBoothItems = useBoothItems();
    const { AddItem } = storeBoothItems;
    const { boothItems } = storeToRefs(storeBoothItems);

    if (id) {
        if (!Array.isArray(id)) {
            if (boothItems.value[id]) {
                // console.log("Returning cached item", id);
                return boothItems.value[id];
            }
        }
    }

    const runtimeConfig = useRuntimeConfig();
    let apiUrl: string;

    if (id) {
        if (Array.isArray(id)) {
            const query = id.map((i) => `id=${i}`).join("&");
            apiUrl = `/api/GetBoothItem?${query}`;
        } else {
            apiUrl = `/api/GetBoothItem?id=${encodeURIComponent(id)}`;
        }
    } else if (url) {
        apiUrl = `/api/GetBoothItem?url=${encodeURIComponent(url)}`;
    } else {
        throw new Error("Invalid type for id. Expected number or string.");
    }

    const response: {
        status: number;
        body: BoothItem;
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

    AddItem(response.body.id, response.body);
    // idを配列で受け取った場合の処理の追加が必要

    return response.body;
};

export interface BoothItem {
    id: number;
    name: string;
    short: Languages;
    thumbnail: string;
    price: string;
    category: number;
    shop: string;
    shopId: string;
    shopThumbnail: string;
    shopVerified: boolean;
    nsfw: boolean;
    outdated: boolean;
}
