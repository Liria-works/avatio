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
    <ButtonBase
        v-if="badge?.value"
        :to="badge.value.link"
        :label="badge.value.label"
        class="rounded-full py-2 text-xs"
    />
</template>
