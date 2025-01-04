<script lang="ts" setup>
const badge = ref<{ value: { label: string; link: string } } | null>(null);

try {
    const { data } = await useFetch('/api/edgeConfig/badge_main');
    badge.value = data.value as {
        value: { label: string; link: string };
    } | null;
} catch (error) {
    console.error('Failed to fetch badge:', error);
    badge.value = null;
}
</script>

<template>
    <NuxtLink v-if="badge?.value" :to="badge.value.link" class="rounded-full">
        <UBadge
            :label="badge.value.label"
            size="sm"
            :ui="{ rounded: 'rounded-full' }"
            class="px-3 hover:bg-zinc-400 hover:dark:bg-zinc-500"
        />
    </NuxtLink>
</template>
