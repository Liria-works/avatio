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
            <slot name="panel" />
        </template>
    </UPopover>
</template>
