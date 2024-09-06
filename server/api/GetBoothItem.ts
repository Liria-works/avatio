/* eslint-disable @typescript-eslint/no-explicit-any */
import authMiddleware from "./Auth";

import { serverSupabaseClient } from "#supabase/server";

const url_base = "https://booth.pm/ja/items/";

const allowed_category_id = [
    // 3Dモデル
    208, // 3Dキャラクター
    209, // 3D衣装
    217, // 3D装飾品
    210, // 3D小道具
    214, // 3Dテクスチャ
    215, // 3Dツール・システム
    216, // 3Dモーション・アニメーション
    211, // 3D環境・ワールド
    212, // VRoid
    127, // 3Dモデル（その他）
    // 素材データ
    125, // イラスト素材
    213, // イラスト3D素材
    126, // 背景画像
    128, // フォント・書体
    129, // アイコン
    22, //ロゴ
    123, //BGM素材
    124, //効果音
    134, // 素材（その他）
];

export default defineEventHandler(async (event) => {
    // console.log(getQuery(event));
    const id: string | object | undefined = extractId(getQuery(event));

    if (typeof id === "string") {
        return GetBoothItem(event, Number(id));
    } else if (typeof id === "object") {
        const itemList: { [key: number]: any } = {};

        for (const key in id as any) {
            itemList[Number(id[key])] = await GetBoothItem(
                event,
                Number(id[key])
            );
        }
        return { status: 200, body: itemList };
    } else {
        return {
            status: 400,
            body: { error: "No ID or URL provided" },
        };
    }
});

async function GetBoothItem(event: any, id: number) {
    // トークンの無いリクエストは弾く
    await authMiddleware(event);

    const startTime = Date.now(); // 処理開始時刻を記録

    let exist = false;
    // let old = false;

    const client = await serverSupabaseClient(event);
    const { data }: any = await client
        .from("items")
        .select(
            "id, name, short, thumbnail, price, category, shop_id(id, name, thumbnail, verified), nsfw, outdated, updated_at, created_at"
        )
        .eq("id", id)
        .single();

    const responseData = {
        id: data.id,
        name: data.name,
        short: data.short,
        thumbnail: data.thumbnail,
        price: data.price,
        category: data.category,
        shop_id: data.shop_id.id,
        shop: data.shop_id.name,
        shop_thumbnail: data.shop_id.thumbnail,
        shop_verified: data.shop_id.verified,
        nsfw: data.nsfw,
        outdated: data.outdated,
    };

    if (data) {
        exist = true;
        const timeDifference = startTime - new Date(data.updated_at).getTime();

        // 時間の差分が1日を超えている場合、処理継続する
        if (timeDifference < 24 * 60 * 60 * 1000) {
            if (data.outdated) {
                return Response(200, "Item is outdated", { outdated: true });
            }
            logDuration(startTime, "Database", data.name);
            return Response(200, "Data found in database", responseData);
        }
        // old = true;
        console.log("Data is old, fetching from Booth");
    }

    try {
        // データ取得
        const { data, error } = await client.functions.invoke(
            "get-booth-item",
            { body: { id: id } }
        );

        if (error) {
            if (exist) {
                await client
                    .from("items")
                    .update({ outdated: true } as never)
                    .eq("id", id);
                return Response(200, "Item is outdated", { outdated: true });
            }

            throw error;
        }

        // カテゴリIDをチェック
        if (!isAllowedCategory(data.category, data.tags)) {
            return {
                status: 400,
                body: { error: "Invalid category ID" },
            };
        }

        const itemData = {
            id: data.id,
            name: data.name,
            thumbnail: data.thumbnail,
            price: data.price,
            category: data.category,
            shop_id: data.shop_id,
            nsfw: data.nsfw,
        };

        const shopData = {
            id: data.shop_id,
            name: data.shop,
            thumbnail: data.shop_thumbnail,
            verified: data.shop_verified,
        };

        // if (old) {
        await client
            .from("items")
            .upsert(itemData as never)
            .eq("id", id);

        await client
            .from("shops")
            .upsert(shopData as never)
            .eq("id", data.shop_id);
        // } else {
        //     await client.from("items").insert(itemData as never);
        // }

        logDuration(startTime, "Booth", data.name);

        return Response(200, "Data fetched from Booth URL", data);
    } catch (error) {
        console.log(error);
        return {
            status: 500,
            body: { error: "Failed to fetch data" },
        };
    }
}

function extractId(query: any): string | undefined {
    if (query.id) {
        return query.id;
    }
    if (query.url) {
        try {
            const url_parse = new URL(query.url.toString());
            const pathSegments = url_parse.pathname
                .split("/")
                .filter((segment) => segment);
            const itemsIndex = pathSegments.indexOf("items");

            return itemsIndex !== -1 && itemsIndex + 1 < pathSegments.length
                ? pathSegments[itemsIndex + 1]
                : undefined;
        } catch (error) {
            console.log(error);
            return undefined;
        }
    }
    return undefined;
}

function isAllowedCategory(categoryId: number, tags: any): boolean {
    if (allowed_category_id.includes(categoryId)) {
        return true;
    } else {
        for (const tag of tags) {
            if (tag === "VRChat") {
                return true;
            }
        }
    }
    return false;
}

function logDuration(startTime: number, source: string, itemName: string) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`Fetch Done : ${source} : ${duration}ms : ${itemName}`);
}

function Response(status: number, message: string, data: any) {
    return {
        status,
        message,
        body: {
            link: url_base + data.id,
            id: data.id,
            name: data.name,
            short: data.short,
            thumbnail: data.thumbnail,
            price: data.price,
            category: data.category,
            shop: data.shop,
            shopId: data.shop_id,
            shopThumbnail: data.shop_thumbnail,
            shopVerified: data.shop_verified,
            nsfw: data.nsfw,
            outdated: data.outdated,
        },
    };
}
