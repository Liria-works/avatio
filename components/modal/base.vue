<script lang="ts" setup>
import { twMerge } from 'tailwind-merge';

interface Props {
    class?: string;
}
const props = defineProps<Props>();

const vis = defineModel<boolean>({
    default: false,
});
</script>

<template>
    <DialogRoot v-model:open="vis">
        <!-- <DialogTrigger as-child>
            <slot name="trigger" />
        </DialogTrigger> -->
        <DialogPortal>
            <DialogOverlay class="bg-black/50 fixed inset-0 z-30" />
            <DialogContent
                :class="
                    twMerge(
                        'z-[100] p-6 flex flex-col gap-5 fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%]',
                        'rounded-lg bg-zinc-100 dark:bg-zinc-900 focus:outline-none border border-zinc-300 dark:border-zinc-700 shadow-lg shadow-black/50',
                        props.class
                    )
                "
            >
                <slot name="header" />
                <div class="overflow-y-auto">
                    <slot />
                </div>
                <slot name="footer" />

                <!-- <DialogClose
                    class="text-grass11 hover:bg-green4 focus:shadow-green7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                    aria-label="Close"
                >
                    <Icon name="lucide:x" />
                </DialogClose> -->
            </DialogContent>
        </DialogPortal>
    </DialogRoot>
</template>
