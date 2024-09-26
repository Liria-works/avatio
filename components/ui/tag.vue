<script setup lang="ts">
import { tv } from "tailwind-variants";

const props = withDefaults(
    defineProps<{
        text: string;
        icon?: string;
        color?: "primary" | "secondary" | "pink";
        tooltip?: string;
    }>(),
    {
        icon: "lucide:tag",
        color: "primary",
        tooltip: "",
    }
);

const tag = tv({
    slots: {
        base: "px-2.5 py-1 rounded-lg justify-center items-center flex text-sm font-normal whitespace-nowrap gap-1",
        ico: "size-4 min-w-max min-h-max text-neutral-500",
    },
    variants: {
        color: {
            primary: {
                base: "bg-white dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-black dark:text-white",
                ico: "text-neutral-500 dark:text-neutral-300",
            },
            secondary: {
                base: "text-neutral-800 dark:text-white bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-600 dark:hover:bg-neutral-500",
                ico: "text-neutral-600 dark:text-neutral-300",
            },
            pink: {
                base: "text-white bg-pink-400 dark:bg-pink-400 cursor-default",
                ico: "text-white",
            },
        },
    },
});

const { base, ico } = tag();
</script>

<template>
    <UTooltip
        :prevent="props.tooltip ? false : true"
        :text="props.tooltip"
        :popper="{ placement: 'top' }"
        :ui="{
            ring: 'ring-1 ring-gray-300 dark:ring-gray-600',
        }"
    >
        <button :class="base({ color: props.color })">
            <Icon
                v-if="props.icon"
                :name="props.icon"
                :class="ico({ color: props.color })"
            />
            {{ text }}
        </button>
    </UTooltip>
</template>
