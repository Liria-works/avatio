import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

const URL_BASE = 'https://booth.pm/ja/items/';

interface Item {
    id: number;
    name: string;
    thumbnail: string;
    price: string;
    category: number;
    shop: string;
    shopId: string;
    shopThumbnail: string;
    shopVerified: boolean;
    nsfw: boolean;
    tags: string[];
}

export interface ResponseData {
    data: Item | null;
    error: {
        status: number;
        message: string;
        details: string;
    } | null;
}

const CreateResponse = (r: ResponseData) => {
    return new Response(JSON.stringify(r), {
        headers: { 'Content-Type': 'application/json' },
    });
};

Deno.serve(async (req) => {
    try {
        const { id } = await req.json();

        if (!id)
            return CreateResponse({
                data: null,
                error: {
                    status: 400,
                    message: 'Invalid request',
                    details: "'id' is required",
                },
            });

        const response = await fetch(`${URL_BASE}${id}.json`, {
            method: 'GET',
            headers: {
                'User-Agent': 'PostmanRuntime/7.40.0',
                Accept: 'application/json',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8',
            },
        });

        if (!response.ok)
            return CreateResponse({
                data: null,
                error: {
                    status: response.status,
                    message: 'Failed to fetch data',
                    details: '',
                },
            });

        const data = await response.json();

        let price: string = data.price.toString();
        for (const i of data.variations)
            if (i.status === 'free_download') {
                price = 'FREE';
                break;
            }

        const item: Item = {
            id: Number(data.id),
            name: data.name.toString(),
            thumbnail: data.images[0].original.toString(),
            price: price,
            category: Number(data.category.id),
            shop: data.shop.name.toString(),
            shopId: data.shop.subdomain.toString(),
            shopThumbnail: data.shop.thumbnail_url.toString(),
            shopVerified: Boolean(data.shop.verified),
            nsfw: Boolean(data.is_adult),
            tags: data.tags.map((tag: { name: string }) => tag.name),
        };

        return CreateResponse({
            data: item,
            error: null,
        });
    } catch (error) {
        console.error('Error:', error);
        const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
        return CreateResponse({
            data: null,
            error: {
                status: 500,
                message: 'Internal Server Error',
                details: errorMessage,
            },
        });
    }
});
