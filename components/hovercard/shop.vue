<script lang="ts" setup>
interface Props {
    shop: Shop;
}
const props = defineProps<Props>();
</script>

<template>
    <HovercardBase side="top" class="px-4 py-2.5">
        <template #trigger>
            <slot />
        </template>
        <template #content>
            <div class="flex items-center gap-3">
                <NuxtImg
                    :src="props.shop.thumbnail"
                    class="size-10 rounded-lg"
                />
                <div class="flex flex-col gap-1.5">
                    <span
                        class="text-sm font-semibold leading-none text-zinc-700 dark:text-zinc-300"
                    >
                        {{ props.shop.name }}
                    </span>
                    <span
                        class="text-xs font-semibold leading-none text-zinc-700 dark:text-zinc-500"
                    >
                        {{ props.shop.id }}.booth.pm
                    </span>
                </div>
            </div>
        </template>
    </HovercardBase>
</template>
