<script lang="ts" setup>
interface Props {
    label?: string;
}
const props = defineProps<Props>();
</script>

<template>
    <span
        :class="[
            'ring-1 ring-zinc-400 dark:ring-zinc-600 rounded-full px-3 py-1.5',
            'text-sm font-medium text-zinc-600 dark:text-zinc-300 leading-none',
        ]"
    >
        <slot>
            {{ props.label }}
        </slot>
    </span>
</template>
