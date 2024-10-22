<script setup lang="ts">
const client = await useSBClient();

const { data: articles } = await client
    .from('articles')
    .select('*')
    .eq('category', 'release')
    .order('created_at', { ascending: false });
</script>

<template>
    <div class="w-full flex flex-col gap-6 items-center">
        <div class="flex gap-2 items-center">
            <Icon name="lucide:rss" class="size-6 mt-1 text-neutral-300" />
            <h1 class="text-2xl font-bold leading-none">お知らせ</h1>
        </div>
        <div
            v-if="articles"
            class="w-full rounded-2xl flex flex-col overflow-hidden divide-y divide-neutral-600 border border-neutral-600"
        >
            <NuxtLink
                v-for="i in articles"
                :key="useId"
                :to="'/release/' + i.slug"
                class="p-5 gap-2 flex flex-col hover:bg-neutral-700 transition ease-in-out duration-100"
            >
                <p class="text-sm text-neutral-400">
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
