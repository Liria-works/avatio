<script lang="ts" setup>
import { twMerge } from 'tailwind-merge';

interface Props {
    src: string;
    alt: string;
    class?: string;
}
const props = defineProps<Props>();

const openImage = ref(false);
</script>

<template>
    <button
        @click="openImage = true"
        :class="
            twMerge(
                'group p-1.5 rounded-xl border border-zinc-400 dark:border-zinc-700',
                props.class
            )
        "
    >
        <NuxtImg
            :src="props.src"
            :alt="props.alt"
            class="rounded-xl content-stretch"
        />
    </button>

    <ModalBase
        v-model:open="openImage"
        class="p-0 rounded-none bg-transparent max-w-full max-h-full"
    >
        <NuxtImg
            :src="props.src"
            :alt="props.alt"
            class="rounded-xl content-stretch"
        />
    </ModalBase>
</template>
