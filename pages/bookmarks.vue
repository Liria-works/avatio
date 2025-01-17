<script lang="ts" setup>
const client = await useSBClient();
const bookmarks = ref<Setup[]>([]);
const loading = ref(false);
const page = ref(0);
const perPage = 20;

const get = async () => {
    const { data } = await client
        .from('bookmarks')
        .select(
            `post(
                id,
                created_at,
                author(id, name, avatar),
                name,
                description,
                image,
                items:setup_items(
                    data:item_id(
                        id, updated_at, outdated, category, name, thumbnail, price, shop:shop_id(id, name, thumbnail, verified), nsfw
                    ),
                    note,
                    unsupported
                )
            )`
        )
        .order('created_at', { ascending: false })
        .range(page.value * perPage, page.value * perPage + (perPage - 1))
        .returns<{ post: Setup }[]>();

    return data ? data.map((i) => i.post) : [];
};

const pagenate = async (options?: { initiate?: boolean }) => {
    if (options?.initiate) {
        page.value = 0;
        bookmarks.value = [];
    } else page.value++;

    loading.value = true;
    bookmarks.value = [...bookmarks.value, ...(await get())];
    loading.value = false;
};

onMounted(async () => {
    useOGP({
        title: 'ブックマーク',
    });
    await pagenate({ initiate: true });
});
</script>

<template>
    <div class="flex flex-col gap-5">
        <UiTitle label="ブックマーク" icon="lucide:bookmark" size="lg" />

        <p v-if="!bookmarks.length" class="w-full text-center my-7">
            ブックマークがありません
        </p>

        <div v-else class="flex flex-col gap-3">
            <ItemSetupDetail v-for="i in bookmarks" :key="useId()" :setup="i" />
            <ButtonLoadMore
                :loading="loading"
                class="w-full"
                @click="pagenate"
            />
        </div>
    </div>
</template>
