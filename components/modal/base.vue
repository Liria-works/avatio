<script lang="ts" setup>
import { twMerge } from 'tailwind-merge';

interface Props {
    class?: string | string[];
}
const props = defineProps<Props>();

const vis = defineModel<boolean>({
    default: false,
});

const slots = useSlots() as Record<string, (() => VNode[]) | undefined>;
</script>

<template>
    <DialogRoot v-model:open="vis">
        <!-- <DialogTrigger as-child>
            <slot name="trigger" />
        </DialogTrigger> -->
        <DialogPortal>
            <DialogOverlay
                class="z-30 fixed inset-0 backdrop-blur-md animate-in fade-in transition-all duration-200 ease-in-out"
            />
            <DialogContent
                :class="
                    twMerge(
                        'z-[100] fixed inset-0 place-self-center max-h-[85vh] w-[90vw] max-w-[450px] p-6 flex flex-col gap-5',
                        'rounded-2xl bg-zinc-100 dark:bg-zinc-900 focus:outline-none border border-zinc-300 dark:border-zinc-700 shadow-xl',
                        'animate-in slide-in-from-bottom-10 fade-in ease-in-out',
                        props.class
                    )
                "
            >
                <slot name="header" />
                <UiDivider v-if="slots.header && slots.header().length" />
                <div class="overflow-y-auto">
                    <slot />
                </div>
                <UiDivider v-if="slots.footer && slots.footer().length" />
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
