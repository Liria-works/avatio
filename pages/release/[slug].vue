<script setup lang="ts">
const route = useRoute();
const client = await useSBClient();

const { data } = await client
    .from('articles')
    .select('*')
    .eq('slug', route.params.slug.toString())
    .maybeSingle();

onMounted(() => {
    useOGP({
        title: data.title,
    });
});
</script>

<template>
    <LayoutArticle
        v-if="data"
        :title="data.title"
        :created-at="data.created_at"
        :updated-at="data.updated_at"
        :content="data.content"
    />

    <div v-else class="flex flex-col items-center gap-10 pt-10">
        <h2
            class="flex text-9xl font-extrabold font-['Montserrat'] text-zinc-500 dark:text-zinc-400"
        >
            404
        </h2>
        <div class="text-xl font-bold text-zinc-500 dark:text-zinc-400">
            ページが見つかりませんでした。
        </div>
    </div>
</template>
