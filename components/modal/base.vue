<script lang="ts" setup>
const vis = defineModel<boolean>({
    default: false,
});
</script>

<template>
    <UModal
        v-model="vis"
        :ui="{
            background: 'bg-white dark:bg-neutral-700',
            ring: 'ring-0',
            rounded: 'rounded-xl',
            inner: 'fixed inset-auto top-10 left-0 right-0 overflow-y-auto',
        }"
    >
        <UCard
            :ui="{
                ring: '',
                divide: 'divide-y divide-gray-100 dark:divide-gray-800',
            }"
        >
            <template #header>
                <slot name="header" />
            </template>

            <slot />

            <template #footer>
                <slot name="footer" />
            </template>
        </UCard>
    </UModal>
</template>
