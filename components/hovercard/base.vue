<script lang="ts" setup>
import { twMerge } from 'tailwind-merge';

interface Props {
    side?: 'top' | 'bottom' | 'left' | 'right';
    sideOffset?: number;
    closeDelay?: number;
    class?: string | string[];
}
const props = withDefaults(defineProps<Props>(), {
    side: 'bottom',
    sideOffset: 5,
    closeDelay: 0,
});
</script>

<template>
    <HoverCardRoot :open-delay="0" :close-delay="props.closeDelay">
        <HoverCardTrigger as-child>
            <slot name="trigger" />
        </HoverCardTrigger>
        <HoverCardPortal>
            <HoverCardContent
                :class="
                    twMerge(
                        'rounded-xl bg-zinc-100 dark:bg-zinc-900 p-5 z-[200] shadow-lg shadow-black/10 border border-zinc-300 dark:border-zinc-700',
                        'animate-in fade-in data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1',
                        props.class
                    )
                "
                :side="props.side"
                :side-offset="props.sideOffset"
            >
                <slot name="content" />

                <HoverCardArrow
                    class="fill-zinc-300 dark:fill-zinc-700"
                    :width="8"
                />
            </HoverCardContent>
        </HoverCardPortal>
    </HoverCardRoot>
</template>
