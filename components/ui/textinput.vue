<script lang="ts" setup>
import { twMerge } from 'tailwind-merge';

const input = defineModel<string>({
    default: '',
});

interface Prop {
    type?: string;
    placeholder?: string;
    disabled?: boolean;
    autocomplete?: string;
    class?: string | string[];
}
const props = defineProps<Prop>();
</script>

<template>
    <div
        :class="
            twMerge(
                'p-1 rounded-lg flex items-center',
                'ring-inset ring-1 hover:ring-2 focus-within:ring-2 ring-zinc-400 dark:ring-zinc-700 focus-within:ring-zinc-700',
                'transition-all duration-100 ease-in-out',
                props.class
            )
        "
    >
        <UInput
            v-model="input"
            :type="props.type ?? 'text'"
            :disabled="props.disabled"
            :autocomplete="props.autocomplete"
            variant="none"
            size="sm"
            :placeholder="props.placeholder"
            :ui="{
                rounded: 'rounded-lg',
            }"
            class="grow"
        />

        <slot name="trailing" />
    </div>
</template>
