import { serverSupabaseClient } from '#supabase/server';
import type { H3Event } from 'h3';

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
    tags: string[];
}

interface Response {
    data: Item | null;
    error: string | null;
}

const logDuration = (startTime: number, source: string, itemName: string) => {
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`Fetch Done : ${source} : ${duration}ms : ${itemName}`);
};

async function GetBoothItem(event: H3Event, id: number): Promise<Response> {
    const client = await serverSupabaseClient(event);

    const startTime = Date.now(); // 処理開始時刻を記録
    const urlBase = 'https://booth.pm/ja/items/';

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let response: any;

        try {
            response = await $fetch(`${urlBase}${id}.json`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Accept-Encoding': 'gzip, deflate, br, zstd',
                    'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8',
                },
            });
        } catch {
            const { data } = await client
                .from('items')
                .select('id')
                .eq('id', id)
                .maybeSingle();

            if (data) {
                await client
                    .from('items')
                    .update({ outdated: true })
                    .eq('id', id);
                await client.rpc('update_item_updated_at', { item_id: id });
            }
        }

        let price: string = response.price.toString();
        for (const i of response.variations)
            if (i.status === 'free_download') {
                price = 'FREE';
                break;
            }

        const item: Item = {
            id: Number(response.id),
            link: urlBase + response.id.toString(),
            name: response.name.toString(),
            thumbnail: response.images[0].original.toString(),
            price: price,
            category: Number(response.category.id),
            shop: {
                name: response.shop.name.toString(),
                id: response.shop.subdomain.toString(),
                thumbnail: response.shop.thumbnail_url.toString(),
                verified: Boolean(response.shop.verified),
            },
            nsfw: Boolean(response.is_adult),
            tags: response.tags.map((tag: { name: string }) => tag.name),
            outdated: false,
        };

        // カテゴリIDをチェック

        // 3Dモデル
        //      208 - 3Dキャラクター
        //      209 - 3D衣装
        //      217 - 3D装飾品
        //      210 - 3D小道具
        //      214 - 3Dテクスチャ
        //      215 - 3Dツール・システム
        //      216 - 3Dモーション・アニメーション
        //      211 - 3D環境・ワールド
        //      212 - VRoid
        //      127 - 3Dモデル（その他）
        // 素材データ
        //      125 - イラスト素材
        //      213 - イラスト3D素材
        //      126 - 背景画像
        //      128 - フォント・書体
        //      129 - アイコン
        //      22  - ロゴ
        //      123 - BGM素材
        //      124 - 効果音
        //      134 - 素材（その他）

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

            if (!allowed_category_id.includes(Number(item.category)))
                if (!item.tags.map((t: string) => t).includes('VRChat'))
                    return {
                        data: null,
                        error: 'Invalid category ID',
                    };
        } catch (e) {
            console.log(e);
            return {
                data: null,
                error: 'Failed to get allowed tag data.',
            };
        }

        await client
            .from('shops')
            .upsert({
                id: item.shop.id,
                name: item.shop.name,
                thumbnail: item.shop.thumbnail,
                verified: item.shop.verified,
            } as never)
            .eq('id', item.shop.id);

        await client
            .from('items')
            .upsert({
                id: item.id,
                name: item.name,
                thumbnail: item.thumbnail,
                price: item.price,
                category: item.category,
                shop_id: item.shop.id,
                nsfw: item.nsfw,
                outdated: false,
            } as never)
            .eq('id', id);

        logDuration(startTime, 'Booth', item.name);

        return {
            data: item,
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

    if (typeof id === 'number') return GetBoothItem(event, Number(id));
    else
        return {
            data: null,
            error: 'No ID or URL provided',
        };
});
