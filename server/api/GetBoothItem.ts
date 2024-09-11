/* eslint-disable @typescript-eslint/no-explicit-any */
import authMiddleware from "./Auth";

import { serverSupabaseClient } from "#supabase/server";
import { createClient } from "@vercel/edge-config";

const url_base = "https://booth.pm/ja/items/";

export default defineEventHandler(async (event) => {
    // console.log(getQuery(event));
    const query = getQuery(event);
    const id = Number(query.id);

    if (typeof id === "number") {
        return GetBoothItem(event, Number(id));
    } else {
        return {
            status: 400,
            body: { error: "No ID or URL provided" },
        };
    }
});

async function GetBoothItem(event: any, id: number) {
    await authMiddleware(event); // トークンの無いリクエストは弾く

    const startTime = Date.now(); // 処理開始時刻を記録

    const client = await serverSupabaseClient(event);

    try {
        // データ取得
        const { data, error } = await client.functions.invoke(
            "get-booth-item",
            { body: { id: id } }
        );

        if (error) throw error;

        // カテゴリIDをチェック

        // 3Dモデル
        //      208 // 3Dキャラクター
        //      209 // 3D衣装
        //      217 // 3D装飾品
        //      210 // 3D小道具
        //      214 // 3Dテクスチャ
        //      215 // 3Dツール・システム
        //      216 // 3Dモーション・アニメーション
        //      211 // 3D環境・ワールド
        //      212 // VRoid
        //      127 // 3Dモデル（その他）
        // 素材データ
        //      125 // イラスト素材
        //      213 // イラスト3D素材
        //      126 // 背景画像
        //      128 // フォント・書体
        //      129 // アイコン
        //      22  //ロゴ
        //      123 //BGM素材
        //      124 //効果音
        //      134 // 素材（その他）

        const runtimeConfig = useRuntimeConfig();
        const edgeConfig = createClient(runtimeConfig.public.edgeConfig);

        try {
            const allowed_category_id: number[] | undefined =
                await edgeConfig.get("allowed_category_id");

            if (!allowed_category_id) {
                return {
                    status: 500,
                    body: { error: "Failed to get allowed tag data." },
                };
            }

            if (!allowed_category_id.includes(Number(data.category))) {
                if (
                    !data.tags
                        .map((tag: { name: string }) => tag.name)
                        .includes("VRChat")
                ) {
                    return {
                        status: 400,
                        body: { error: "Invalid category ID" },
                    };
                }
            }
        } catch (e) {
            console.log(e);
            return {
                status: 500,
                body: { error: "Failed to get allowed tag data." },
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

        await client
            .from("shops")
            .upsert(shopData as never)
            .eq("id", data.shop_id);

        await client
            .from("items")
            .upsert(itemData as never)
            .eq("id", id);

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
            thumbnail: data.thumbnail,
            price: data.price,
            category: data.category,
            avatar_details: data.avatar_details,
            shop: data.shop,
            shopId: data.shop_id,
            shopThumbnail: data.shop_thumbnail,
            shopVerified: data.shop_verified,
            nsfw: data.nsfw,
            outdated: data.outdated,
        },
    };
}
