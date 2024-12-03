import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

const URL_BASE = 'https://booth.pm/ja/items/';

Deno.serve(async (req) => {
    try {
        const { id } = await req.json();

        if (!id) {
            return new Response(
                JSON.stringify({ error: "Invalid request, 'id' is required" }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        const response = await fetch(`${URL_BASE}${id}.json`, {
            method: 'GET',
            headers: {
                'User-Agent': 'PostmanRuntime/7.40.0',
                Accept: 'application/json',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8',
            },
        });

        if (!response.ok) {
            return new Response(
                JSON.stringify({ error: 'Failed to fetch data' }),
                {
                    status: response.status,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        const data = await response.json();

        let price: string = data.price.toString();
        for (const i of data.variations) {
            if (i.status === 'free_download') {
                price = 'FREE';
                break;
            }
        }

        const item = {
            id: Number(data.id),
            name: data.name.toString(),
            thumbnail: data.images[0].original.toString(),
            price: price,
            category: Number(data.category.id),
            shop: data.shop.name.toString(),
            shop_id: data.shop.subdomain.toString(),
            shop_thumbnail: data.shop.thumbnail_url.toString(),
            shop_verified: Boolean(data.shop.verified),
            nsfw: Boolean(data.is_adult),
            tags: data.tags.map((tag: { name: string }) => tag.name),
        };
        // console.log(item);

        return new Response(JSON.stringify(item), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return new Response(
            JSON.stringify({
                error: 'Internal Server Error',
                details: errorMessage,
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
});
