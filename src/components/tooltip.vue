<script setup lang="ts">
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger } from 'radix-vue'
import { Icon } from "@iconify/vue";

const props = withDefaults(
    defineProps<{
        baseIcon?: string;
        baseIconSize?: number;
        text: string;
    }>(),
    {
        baseIcon: "",
        baseIconSize: 18,
        text: "",
    }
);
</script>

<template>
    <TooltipProvider :disabled="!props.text.length" :delayDuration="100">
        <TooltipRoot>
            <TooltipTrigger as-child>
                <Icon v-if="props.baseIcon.length" :icon="props.baseIcon" :width="props.baseIconSize"
                    :height="props.baseIconSize" class="text-neutral-500 dark:text-neutral-400" />
                <slot v-else />
            </TooltipTrigger>
            <TooltipPortal>
                <TooltipContent
                    class="px-3 py-1.5 select-none text-xs tracking-wide font-medium rounded-md bg-neutral-800 dark:bg-neutral-200 text-neutral-100 dark:text-neutral-900"
                    :side-offset="5">
                    {{ props.text }}
                    <TooltipArrow class="fill-neutral-800" :width="8" />
                </TooltipContent>
            </TooltipPortal>
        </TooltipRoot>
    </TooltipProvider>
</template>
