export const useFetchBooth = async ({
    id = null,
    url = null,
}: {
    id: number | null;
    url: string | null;
}) => {
    const storeBoothItems = useBoothItems();
    const { AddItem } = storeBoothItems;
    const { boothItems } = storeToRefs(storeBoothItems);

    let boothId: number | null = null;

    if (url) boothId = extractId(url);
    if (id) boothId = id;

    if (!boothId) return null;

    if (boothItems.value[boothId]) {
        // console.log("Returning cached item", id);
        return boothItems.value[boothId];
    }

    const client = await useSBClient();
    const { data: boothData } = await client
        .from("items")
        .select(
            "id, name, thumbnail, price, category, shop_id(id, name, thumbnail, verified), nsfw, outdated, updated_at, created_at"
        )
        .eq("id", boothId)
        .maybeSingle();

    if (boothData) {
        let avatar_details = null;
        const { data } = await client
            .from("avatar_details")
            .select("id, short_ja, short_en, short_kr, vrc_sample, vrc_world")
            .eq("id", boothId)
            .maybeSingle();
        avatar_details = data;

        const res: BoothItem = {
            id: boothData.id,
            name: boothData.name,
            thumbnail: boothData.thumbnail,
            price: boothData.price,
            category: boothData.category,
            avatar_details: avatar_details,
            shopId: boothData.shop_id.id,
            shop: boothData.shop_id.name,
            shopThumbnail: boothData.shop_id.thumbnail,
            shopVerified: boothData.shop_id.verified,
            nsfw: boothData.nsfw,
            outdated: boothData.outdated,
        };

        const timeDifference =
            new Date().getTime() - new Date(boothData.updated_at).getTime();

        // 時間の差分が1日を超えている場合、処理継続する
        if (timeDifference < 24 * 60 * 60 * 1000) {
            if (boothData.outdated) {
                res.outdated = true;
                return res;
            }
            return res;
        }
        console.log("Data is old, fetching from Booth");
    }

    const apiUrl = `/api/GetBoothItem?id=${encodeURIComponent(boothId)}`;

    const runtimeConfig = useRuntimeConfig();

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

    return response.body;
};

function extractId(url: string): number | null {
    try {
        const url_parse = new URL(url);
        const pathSegments = url_parse.pathname
            .split("/")
            .filter((segment) => segment);
        const itemsIndex = pathSegments.indexOf("items");

        return itemsIndex !== -1 && itemsIndex + 1 < pathSegments.length
            ? Number(pathSegments[itemsIndex + 1])
            : null;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export interface BoothItem {
    id: number;
    name: string;
    thumbnail: string;
    price: string;
    category: number;
    avatar_details: {
        short_ja: string;
        short_en: string;
        short_kr: string;
        vrc_sample: string;
        vrc_world: string;
    } | null;
    shop: string;
    shopId: string;
    shopThumbnail: string;
    shopVerified: boolean;
    nsfw: boolean;
    outdated: boolean;
}
