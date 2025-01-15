<script lang="ts" setup>
import { twMerge } from 'tailwind-merge';

interface Props {
    autoresize?: boolean;
    placeholder?: string;
    class?: string | string[];
}
const props = defineProps<Props>();

const model = defineModel<string>();
</script>

<template>
    <div
        :class="
            twMerge(
                'px-2.5 py-2 ring-inset ring-1 hover:ring-2 focus-within:ring-2 ring-zinc-400 dark:ring-zinc-700 focus-within:ring-zinc-700 rounded-lg',
                'transition-all duration-100 ease-in-out',
                props.class
            )
        "
    >
        <UTextarea
            v-model="model"
            :autoresize="props.autoresize"
            :placeholder="props.placeholder"
            variant="none"
            :padded="false"
        />
    </div>
</template>
