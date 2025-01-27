<script setup lang="ts">
const client = await useSupabaseClient();

const { data: articles } = await client
    .from('articles')
    .select('*')
    .eq('category', 'release')
    .order('created_at', { ascending: false });

onMounted(() => {
    useOGP({
        title: 'お知らせ',
    });
});
</script>

<template>
    <div class="w-full flex flex-col gap-6 items-center">
        <UiTitle label="お知らせ" icon="lucide:rss" size="lg" />
        <div
            v-if="articles"
            class="w-full rounded-2xl flex flex-col overflow-hidden divide-y divide-zinc-400 dark:divide-zinc-600 border border-zinc-400 dark:border-zinc-600"
        >
            <NuxtLink
                v-for="i in articles"
                :key="useId"
                :to="'/release/' + i.slug"
                class="p-5 gap-2 flex flex-col hover:bg-zinc-300 hover:dark:bg-zinc-700 transition ease-in-out duration-100"
            >
                <p class="text-sm text-zinc-400">
                    {{ useDateElapsed(new Date(i.created_at)) }}
                </p>
                <h2
                    class="text-xl font-bold break-keep [overflow-wrap:anywhere;]"
                >
                    {{ useSentence(i.title) }}
                </h2>
                <p>{{}}</p>
            </NuxtLink>
        </div>
        <div v-else>
            <p>お知らせがありません</p>
        </div>
    </div>
</template>
