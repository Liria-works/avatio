<script lang="ts" setup>
import { twMerge } from 'tailwind-merge';

const props = defineProps<{
    label?: string;
    icon?: string;
    class?: string | string[];
    borderClass?: string;
}>();
</script>

<template>
    <UDivider
        :label="props.label"
        :icon="props.icon"
        :ui="{
            border: {
                base: twMerge(
                    'border-zinc-300 dark:border-zinc-700',
                    props.borderClass
                ),
            },
        }"
        :class="props.class"
    />
</template>
