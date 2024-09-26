<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        text: string;
    }>(),
    {
        text: "",
    }
);
</script>

<template>
    <UTooltip
        :text="props.text"
        :popper="{ placement: 'top' }"
        :ui="{
            ring: 'ring-1 ring-gray-300 dark:ring-gray-600',
        }"
    >
        <slot />
    </UTooltip>
</template>
