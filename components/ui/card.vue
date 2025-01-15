<script lang="ts" setup>
import { twMerge } from 'tailwind-merge';

interface Props {
    divider?: boolean;
    class?: string | string[];
    headerClass?: string | string[];
    contentClass?: string | string[];
    footerClass?: string | string[];
}
const props = withDefaults(defineProps<Props>(), {
    divider: true,
});
</script>

<template>
    <div
        :class="
            twMerge(
                'rounded-lg flex flex-col ring-1 ring-zinc-300 dark:ring-zinc-400',
                props.divider
                    ? 'divide-y divide-zinc-300 dark:divide-zinc-400'
                    : '',
                props.class
            )
        "
    >
        <div :class="twMerge('empty:hidden px-4 py-3', props.headerClass)">
            <slot name="header" />
        </div>
        <div
            :class="
                twMerge(
                    'empty:hidden px-4',
                    props.divider ? 'py-3' : 'py-1',
                    props.contentClass
                )
            "
        >
            <slot />
        </div>
        <div :class="twMerge('empty:hidden px-4 py-3', props.footerClass)">
            <slot name="footer" />
        </div>
    </div>
</template>
