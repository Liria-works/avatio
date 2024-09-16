<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger } from 'radix-vue'

import Tooltip from './tooltip.vue';

const props = withDefaults(
    defineProps<{
        icon?: string;
        iconSize?: number;
        label?: string;
        outline?: boolean;
        colorBg?: string;
        colorOutline?: string;
        colorText?: string;
        colorIcon?: string;
        padding?: string;
        rounded?: string;
        text?: string;
        tooltip?: string;
    }>(),
    {
        icon: "",
        iconSize: 18,
        label: "",
        outline: true,
        colorBg: "bg-transparent dark:bg-transparent hover:bg-neutral-200 dark:hover:bg-neutral-800",
        colorOutline: "border-neutral-400 dark:border-neutral-600",
        colorText: "text-neutral-800 dark:text-neutral-200",
        colorIcon: "text-neutral-600 dark:text-neutral-300",
        padding: "px-4 py-3",
        rounded: "rounded-lg",
        text: "text-sm font-semibold",
        tooltip: "",
    }
);
</script>

<template>
    <Tooltip :text="props.tooltip">
        <button
            :class="`w-fit flex gap-2 items-center justify-center ${props.text} ${props.padding} ${props.rounded} ${props.colorBg} ${props.colorText} ${outline ? 'border border-1' : 'border-0'} ${props.colorOutline}`">
            <Icon v-if="props.icon.length" :icon="props.icon" :width="props.iconSize" :height="props.iconSize"
                :class="`${props.colorIcon}`" />
            {{ props.label }}
        </button>
    </Tooltip>
</template>
