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
        type="button"
        @click="openImage = true"
        :class="[
            'p-1.5 rounded-xl ring-1 ring-zinc-400 dark:ring-zinc-700',
            'hover:ring-2 hover:ring-zinc-500 dark:hover:ring-zinc-600',
            'focus:ring-4 focus:ring-zinc-600 dark:focus:ring-zinc-500 focus:outline-none',
            'transition-all ease-in-out duration-100',
        ]"
    >
        <NuxtImg
            :src="props.src"
            :alt="props.alt"
            :class="
                twMerge(
                    'rounded-xl flex items-center justify-center',
                    props.class
                )
            "
        />
    </button>

    <DialogRoot v-model:open="openImage">
        <DialogPortal>
            <DialogOverlay class="bg-black/50 fixed inset-0 z-30" />
            <DialogContent as-child>
                <NuxtImg
                    :src="props.src"
                    :alt="props.alt"
                    class="z-[100] size-full max-h-fit max-w-fit fixed inset-0 place-self-center"
                />
            </DialogContent>
        </DialogPortal>
    </DialogRoot>
</template>
