<script lang="ts" setup>
import { twMerge } from 'tailwind-merge';

interface Props {
    to?: string | object;
    tabindex?: number;
    class?: string;
}
const props = defineProps<Props>();

const customLink = defineNuxtLink({
    componentName: 'customLink',
    prefetch: false,
});
</script>

<template>
    <component
        :is="props.to ? customLink : 'div'"
        :to="props.to"
        :tabindex="props.to ? (props.tabindex ?? 0) : undefined"
        :class="
            twMerge(
                'w-full flex flex-col border border-zinc-300 dark:border-zinc-600 rounded-lg overflow-clip',
                props.class
            )
        "
    >
        <div class="empty:hidden w-full">
            <slot name="hero" />
        </div>
        <div class="w-full flex items-center">
            <slot name="thumbnail" />
            <slot name="main" />
        </div>
        <div class="empty:hidden w-full flex">
            <slot name="under" />
        </div>
    </component>
</template>
