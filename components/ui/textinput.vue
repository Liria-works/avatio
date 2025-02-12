<script lang="ts" setup>
import { twMerge } from 'tailwind-merge';

const model = defineModel<string>({ default: '' });

interface Prop {
    unstyled?: boolean;
    icon?: string;
    placeholder?: string;
    disabled?: boolean;
    autocomplete?: string;
    autofocus?: boolean;
    class?: string | string[];
}
const props = defineProps<Prop>();

const emit = defineEmits(['input', 'change', 'blur']);

const inputId = useId();
</script>

<template>
    <div
        :class="
            twMerge(
                props.unstyled
                    ? 'relative flex items-center gap-1'
                    : twMerge(
                          'relative p-3 rounded-lg flex items-center gap-1',
                          'text-sm text-black dark:text-white',
                          'ring-inset ring-1 hover:ring-2 focus-within:ring-2 ring-zinc-400 dark:ring-zinc-700 focus-within:ring-zinc-700',
                          'transition-all duration-100 ease-in-out'
                      ),
                props.class
            )
        "
    >
        <Icon
            v-if="props.icon"
            :name="props.icon"
            class="w-5 h-5 text-zinc-400 dark:text-zinc-500"
        />
        <input
            :id="inputId"
            ref="input"
            type="text"
            v-model="model"
            :placeholder="props.placeholder"
            :disabled="props.disabled"
            :autocomplete="props.autocomplete"
            :autofocus="props.autofocus"
            class="grow focus:outline-hidden placeholder:select-none bg-transparent placeholder-zinc-400 dark:placeholder-zinc-500"
            @input="emit('input', $event)"
            @blur="emit('blur', $event)"
            @change="emit('change', $event)"
        />

        <div class="absolute right-1.5">
            <slot name="trailing" />
        </div>
    </div>
</template>
