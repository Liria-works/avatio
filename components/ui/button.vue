<script setup lang="ts">
import { twMerge } from "tailwind-merge";

const props = withDefaults(
    defineProps<{
        disabled?: boolean;
        type?: "button" | "submit" | "reset";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, vue/require-default-prop
        to?: any;
        newTab?: boolean;
        icon?: string;
        iconSize?: number;
        label?: string;
        outline?: boolean;
        ui?: string;
        uiIcon?: string;
        tooltip?: string;
    }>(),
    {
        disabled: false,
        type: "button",
        newTab: false,
        icon: "",
        iconSize: 18,
        label: "",
        outline: true,
        ui: "",
        uiIcon: "",
        tooltip: "",
    }
);

const emit = defineEmits(["click"]);

const buttonClass = twMerge(
    props.disabled ? "cursor-not-allowed" : "cursor-pointer",
    props.icon.length ? "p-3" : "px-4 py-3",
    "w-fit rounded-lg flex gap-2 items-center justify-center",
    "bg-transparent dark:bg-transparent hover:bg-neutral-200 dark:hover:bg-neutral-600",
    "text-sm font-semibold align-middle leading-none",
    "text-neutral-800 dark:text-neutral-200",
    // props.outline ? "border border-1" : "border-0",
    "outline outline-1 outline-neutral-400 dark:outline-neutral-600",
    props.ui,
    "transition duration-50 delay-0 ease-in-out"
);

const iconClass = twMerge(
    "text-neutral-600 dark:text-neutral-300",
    props.uiIcon
);
</script>

<template>
    <UiTooltip :text="props.tooltip">
        <button
            v-if="!props.to"
            :type="props.type"
            :disabled="props.disabled"
            :class="buttonClass"
            @click="emit('click')"
        >
            <Icon
                v-if="props.icon.length"
                :name="props.icon"
                :size="props.iconSize"
                :class="iconClass"
            />
            <p class="empty:hidden whitespace-nowrap leading-none">
                {{ props.label }}
            </p>
        </button>

        <NuxtLink
            v-else
            :to="props.to"
            :target="props.newTab ? '_blank' : '_self'"
            no-rel
            :disabled="props.disabled"
            :class="buttonClass"
        >
            <Icon
                v-if="props.icon.length"
                :name="props.icon"
                :size="props.iconSize"
                :class="iconClass"
            />
            <p class="empty:hidden whitespace-nowrap leading-none">
                {{ props.label }}
            </p>
        </NuxtLink>
    </UiTooltip>
</template>
