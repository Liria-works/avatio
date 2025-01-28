<script setup lang="ts">
const client = useSupabaseClient();

const { data: releases } = await client
    .from('releases')
    .select('slug, created_at, title, description, thumbnail, published')
    .eq('published', true)
    .order('created_at', { ascending: false });

useOGP({
    title: 'お知らせ',
});
</script>

<template>
    <div class="w-full flex flex-col gap-6 items-center">
        <UiTitle
            label="お知らせ"
            icon="lucide:rss"
            size="lg"
            class="self-start"
        />
        <div
            v-if="releases && releases.length"
            class="w-full rounded-xl flex flex-col overflow-hidden divide-y divide-zinc-400 dark:divide-zinc-600 border border-zinc-400 dark:border-zinc-600"
        >
            <NuxtLink
                v-for="i in releases"
                :key="useId()"
                :to="`/release/${i.slug}`"
                :class="[
                    'p-2 flex items-center gap-1',
                    'hover:bg-zinc-300 hover:dark:bg-zinc-700',
                    'transition ease-in-out duration-100',
                ]"
            >
                <NuxtImg
                    v-if="i.thumbnail && i.thumbnail.length"
                    :src="useGetImage(i.thumbnail, { prefix: 'permanent' })"
                    class="h-20 max-w-64 rounded-lg"
                />

                <div class="grow px-4 py-3 gap-2 flex flex-col">
                    <div class="flex items-start gap-3 justify-between">
                        <h2
                            class="text-xl font-bold break-keep [overflow-wrap:anywhere;]"
                        >
                            {{ useSentence(i.title) }}
                        </h2>

                        <span class="text-sm text-zinc-400">
                            {{ useDateElapsed(new Date(i.created_at)) }}
                        </span>
                    </div>

                    <p
                        v-if="i.description && i.description.length"
                        class="text-sm text-zinc-400"
                    >
                        {{ i.description }}
                    </p>
                </div>
            </NuxtLink>
        </div>

        <template v-else>
            <p
                class="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-400"
            >
                お知らせがありません
            </p>
        </template>
    </div>
</template>
