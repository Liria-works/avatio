<script lang="ts" setup>
type BannerContent = {
    emoji: string;
    title: string;
    description: string;
};
const content = ref<BannerContent | null>(null);
try {
    const res = await $fetch<{ value: BannerContent }>(
        '/api/edgeConfig/banner'
    );
    if (res.value) content.value = res.value;
} catch (error) {
    console.error('Failed to fetch banner:', error);
}
</script>

<template>
    <div
        v-if="content"
        class="shrink px-3.5 py-3 rounded-xl flex items-center gap-1 ring-1 ring-zinc-300 dark:ring-zinc-700"
    >
        <Icon :name="`twemoji:${content.emoji}`" size="14" class="shrink-0" />
        <span class="text-xs leading-none whitespace-nowrap">
            {{ content.title }}
        </span>
        <UiDivider class="hidden sm:flex w-6 mx-1" />
        <div class="hidden sm:inline">
            <span
                class="text-xs leading-none line-clamp-1 text-zinc-500 dark:text-zinc-400"
            >
                {{ content.description }}
            </span>
        </div>
    </div>
</template>
