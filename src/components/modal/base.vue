<script setup lang="ts">
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
} from '@headlessui/vue';

import Title from '../title.vue';

const props = defineProps<{
    isOpen: boolean;
    title: string;
    icon: string;
}>();

const emit = defineEmits(['update:isOpen']);

const close = () => {
    emit('update:isOpen', false);
};
</script>

<template>
    <TransitionRoot :show="props.isOpen" as="template">
        <Dialog as="div" :open="props.isOpen" @close="close" class="relative z-10">
            <TransitionChild enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
                leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-black/25" />
            </TransitionChild>

            <div fixed inset-0 overflow-y-auto>
                <div class="flex min-h-full items-center justify-center p-4 text-center">
                    <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95">
                        <DialogPanel w-full p-6 flex flex-col gap-3 max-w-md rounded-xl bg-white text-left>
                            <Title :label="props.title" :icon="props.icon" />
                            <slot />
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>