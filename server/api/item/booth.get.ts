import { serverSupabaseClient } from '#supabase/server';
import type { H3Event } from 'h3';

import type { Database } from '../../../database.types';
import type { ResponseData } from '../../../supabase/functions/get-booth-item/index';

interface Item {
    outdated: boolean;
    link: string;
    id: number;
    name: string;
    thumbnail: string;
    price: string;
    category: number;
    shop: {
        id: string;
        name: string;
        thumbnail: string;
        verified: boolean;
    };
    nsfw: boolean;
}

interface Response {
    data: Item | null;
    error: string | null;
}

function logDuration(startTime: number, source: string, itemName: string) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`Fetch Done : ${source} : ${duration}ms : ${itemName}`);
}

async function GetBoothItem(event: H3Event, id: number): Promise<Response> {
    const client = await serverSupabaseClient<Database>(event);

    const startTime = Date.now(); // 処理開始時刻を記録
    const url_base = 'https://booth.pm/ja/items/';

    try {
        // データ取得
        const { data, error } = await client.functions.invoke<ResponseData>(
            'get-booth-item',
            { body: { id: id } }
        );

        if (error || !data || data.error) {
            const { data: itemDB } = await client
                .from('items')
                .select('id')
                .eq('id', id)
                .maybeSingle();

            if (itemDB) {
                await client
                    .from('items')
                    .update({ outdated: true })
                    .eq('id', id);
                await client.rpc('update_item_updated_at', { item_id: id });
            }

            const e =
                error ||
                (data?.error?.message, data?.error?.details) ||
                'Unknown error';
            console.log(e);
            throw new Error(e);
        }

        const itemBooth = data.data!;

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

        try {
            const config = await event.$fetch(
                '/api/edgeConfig/allowed_category_id'
            );
            if (config.status !== 200 || !config.value)
                return {
                    data: null,
                    error: 'Error in vercel edge config.',
                };

            const allowed_category_id: number[] = config.value as number[];

            if (!allowed_category_id.includes(Number(itemBooth.category))) {
                if (!itemBooth.tags.map((t: string) => t).includes('VRChat'))
                    return {
                        data: null,
                        error: 'Invalid category ID',
                    };
            }
        } catch (e) {
            console.log(e);
            return {
                data: null,
                error: 'Failed to get allowed tag data.',
            };
        }

        const shopData = {
            id: itemBooth.shopId,
            name: itemBooth.shop,
            thumbnail: itemBooth.shopThumbnail,
            verified: itemBooth.shopVerified,
        };

        const itemData = {
            id: itemBooth.id,
            name: itemBooth.name,
            thumbnail: itemBooth.thumbnail,
            price: itemBooth.price,
            category: itemBooth.category,
            shop_id: itemBooth.shopId,
            nsfw: itemBooth.nsfw,
        };

        await client
            .from('shops')
            .upsert(shopData as never)
            .eq('id', itemBooth.shopId);

        await client
            .from('items')
            .upsert(itemData as never)
            .eq('id', id);

        logDuration(startTime, 'Booth', itemBooth.name);

        return {
            data: {
                outdated: false,
                link: url_base + itemBooth.id,
                id: itemBooth.id,
                name: itemBooth.name,
                thumbnail: itemBooth.thumbnail,
                price: itemBooth.price,
                category: itemBooth.category,
                shop: {
                    id: itemBooth.shopId,
                    name: itemBooth.shop,
                    thumbnail: itemBooth.shopThumbnail,
                    verified: itemBooth.shopVerified,
                },
                nsfw: itemBooth.nsfw,
            },
            error: null,
        };
    } catch (error) {
        console.log(error);
        return {
            data: null,
            error: 'Failed to fetch data',
        };
    }
}

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const id = Number(query.id);

    if (typeof id === 'number') {
        return GetBoothItem(event, Number(id));
    } else {
        return {
            data: null,
            error: 'No ID or URL provided',
        };
    }
});
