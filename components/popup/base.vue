<script lang="ts" setup>
const props = withDefaults(
    defineProps<{
        mode?: 'hover' | 'click';
    }>(),
    {
        mode: 'hover',
    }
);
</script>

<template>
    <UPopover
        :mode="props.mode"
        :ui="{
            rounded: 'rounded-xl',
            ring: 'ring-1 ring-gray-300 dark:ring-gray-600',
        }"
    >
        <slot name="trigger" />

        <template #panel="{ open, close }">
            <div
                class="p-3 gap-2 flex flex-col bg-neutral-300 dark:bg-neutral-900"
            >
                <slot name="panel" :open="open" :close="close" />
            </div>
        </template>
    </UPopover>
</template>
