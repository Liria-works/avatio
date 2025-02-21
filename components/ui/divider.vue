<script lang="ts" setup>
import { twMerge } from 'tailwind-merge';

const props = defineProps<{
    label?: string;
    icon?: string;
    class?: string | string[];
    borderClass?: string;
}>();
</script>

<template>
    <div :class="['flex items-center align-center text-center', props.class]">
        <div
            :class="
                twMerge(
                    'w-full flex border border-zinc-200 dark:border-zinc-800',
                    props.borderClass
                )
            "
        />

        <template v-if="props.label || props.icon || $slots.default">
            <div
                class="mx-3 whitespace-nowrap font-medium text-zinc-700 dark:text-zinc-200 flex"
            >
                <slot>
                    <span v-if="props.label" class="text-sm">
                        {{ props.label }}
                    </span>
                    <Icon
                        v-else-if="props.icon"
                        :name="props.icon"
                        class="shrink-0 w-5 h-5"
                    />
                </slot>
            </div>

            <div
                :class="
                    twMerge(
                        'w-full flex border border-zinc-200 dark:border-zinc-800',
                        props.borderClass
                    )
                "
            />
        </template>
    </div>
</template>
