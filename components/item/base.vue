<script lang="ts" setup>
import { twMerge } from 'tailwind-merge';

interface Props {
    to?: string | object;
    is?: HTMLElement;
    tabindex?: number;
    class?: string | string[];
}
const props = defineProps<Props>();

const emit = defineEmits(['click']);

const customLink = defineNuxtLink({
    prefetch: false,
});
</script>

<template>
    <component
        :is="props.to ? customLink : (props.is ?? 'div')"
        :to="props.to"
        :tabindex="props.to ? (props.tabindex ?? 0) : undefined"
        type="button"
        :class="
            twMerge(
                'w-full flex flex-col ring-1 ring-zinc-300 dark:ring-zinc-600 rounded-lg overflow-clip',
                props.class
            )
        "
        @click="emit('click')"
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
