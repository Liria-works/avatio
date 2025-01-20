<script lang="ts" setup>
const client = await useSBClient();

const setups = ref<Setup[]>([]);
const setupsPerPage: number = 50;
const page = ref(0);
const loading = ref(true);

const get = async () => {
    loading.value = true;

    try {
        const query = client
            .from('bookmarks')
            .select(
                `
                post(
                    id,
                    created_at,
                    name,
                    author(id, name, avatar),
                    images:setup_images(name, width, height),
                    items:setup_items(
                        data:item_id(
                            id, outdated, category, name, thumbnail, nsfw
                        )
                    )
                )
                `
            )
            .returns<{ post: Setup }[]>();

        const { data } = await query
            .range(
                page.value * setupsPerPage,
                page.value * setupsPerPage + (setupsPerPage - 1)
            )
            .order('created_at', { ascending: false });
        if (!data) throw new Error();

        setups.value = [...setups.value, ...data.map((d) => d.post)];

        page.value++;
    } catch {
        setups.value = [];
        page.value = 0;
    } finally {
        loading.value = false;
    }
};

onMounted(async () => {
    await get();
});
</script>

<template>
    <div class="flex flex-col gap-3">
        <SetupsListBase :setups="setups" />
        <ButtonLoadMore
            v-if="setups.length"
            :loading="loading"
            class="w-full"
            @click="get"
        />
    </div>
</template>
