<script lang="ts" setup>
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
                class="z-[100] flex flex-col gap-5 fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white dark:bg-zinc-800 p-6 focus:outline-none"
            >
                <!-- <DialogTitle class="m-0 text-[17px] font-semibold">
                    フィードバック
                </DialogTitle> -->

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
