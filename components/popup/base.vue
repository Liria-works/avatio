<script lang="ts" setup></script>

<template>
    <UPopover
        mode="hover"
        :ui="{
            rounded: 'rounded-xl',
            ring: 'ring-1 ring-gray-300 dark:ring-gray-600',
        }"
    >
        <slot name="trigger" />

        <template #panel>
            <div
                class="p-3 gap-2 flex flex-col bg-neutral-300 dark:bg-neutral-900"
            >
                <slot name="panel" />
            </div>
        </template>
    </UPopover>
</template>
