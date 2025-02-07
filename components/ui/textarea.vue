<script lang="ts" setup>
import { twMerge } from 'tailwind-merge';
const { textarea } = useTextareaAutosize();

interface Props {
    unstyled?: boolean;
    disabled?: boolean;
    autoresize?: boolean;
    placeholder?: string;
    rows?: number;
    class?: string | string[];
}
const props = defineProps<Props>();

const model = defineModel<string>();

const emit = defineEmits(['input', 'change', 'blur']);
</script>

<template>
    <div
        :class="
            unstyled
                ? ''
                : twMerge(
                      'px-2.5 py-2 ring-inset ring-1 hover:ring-2 focus-within:ring-2 ring-zinc-400 dark:ring-zinc-700 focus-within:ring-zinc-700 rounded-lg',
                      'transition-all duration-100 ease-in-out',
                      props.class
                  )
        "
    >
        <textarea
            :id="useId()"
            ref="textarea"
            v-model="model"
            :rows="props.rows ?? 3"
            :disabled="props.disabled"
            :placeholder="props.placeholder"
            class="resize-none w-full block placeholder-zinc-400 dark:placeholder-zinc-500 text-sm bg-transparent focus:outline-none"
            @input="emit('input', $event)"
            @blur="emit('blur', $event)"
            @change="emit('change', $event)"
        />
    </div>
</template>
