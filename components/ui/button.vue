<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        disabled?: boolean;
        type?: "button" | "submit" | "reset";
        to?: string;
        newTab?: boolean;
        icon?: string;
        iconSize?: number;
        label?: string;
        outline?: boolean;
        colorBg?: string;
        colorOutline?: string;
        colorText?: string;
        colorIcon?: string;
        size?: string;
        padding?: string;
        rounded?: string;
        text?: string;
        tooltip?: string;
    }>(),
    {
        disabled: false,
        to: "",
        type: "button",
        newTab: false,
        icon: "",
        iconSize: 18,
        label: "",
        outline: true,
        colorBg:
            "bg-transparent dark:bg-transparent hover:bg-neutral-200 dark:hover:bg-neutral-900",
        colorOutline: "border-neutral-400 dark:border-neutral-600",
        colorText: "text-neutral-800 dark:text-neutral-200",
        colorIcon: "text-neutral-600 dark:text-neutral-300",
        size: "w-fit",
        padding: "px-4 py-3",
        rounded: "rounded-lg",
        text: "text-sm font-semibold",
        tooltip: "",
    },
);

const emit = defineEmits(['click']);

const handleClick = () => {
    if (props.to.length) {
        window.open(props.to, props.newTab ? "_blank" : "_self");
    } else {
        emit('click');
    }
};
</script>

<template>
    <button v-if="!props.to.length" :type="props.type" :disabled="props.disabled"
        :class="`flex gap-2 items-center justify-center ${props.size} ${props.text} ${props.padding} ${props.rounded} ${props.colorBg} ${props.colorText} ${outline ? 'border border-1' : 'border-0'} ${props.colorOutline}`"
        @click="handleClick">
        <Icon v-if="props.icon.length" :name="props.icon" :width="props.iconSize" :height="props.iconSize"
            :class="`${props.colorIcon}`" />
        <p class="empty:hidden whitespace-nowrap">{{ props.label }}</p>
    </button>

    <a v-else :href="props.to" :target="props.newTab ? '_blank' : '_self'"
        :class="`flex gap-2 items-center justify-center ${props.size} ${props.text} ${props.padding} ${props.rounded} ${props.colorBg} ${props.colorText} ${outline ? 'border border-1' : 'border-0'} ${props.colorOutline}`">
        <Icon v-if="props.icon.length" :name="props.icon" :width="props.iconSize" :height="props.iconSize"
            :class="`${props.colorIcon}`" />
        <p class="empty:hidden whitespace-nowrap">{{ props.label }}</p>
    </a>
</template>
