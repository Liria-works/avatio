<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from '@nanostores/vue'
import { searchOpen } from '../lib/modal'

const $searchOpen = useStore(searchOpen);

import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle,
} from '@headlessui/vue'

const props = defineProps<{
    title: string
}>()

</script>

<template>
    <TransitionRoot :show="$searchOpen" as="template">
        <Dialog as="div" :open="$searchOpen" @close="searchOpen.set(!$searchOpen)" class="relative z-10">
            <TransitionChild enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
                leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-black/25" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4 text-center">
                    <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95">
                        <DialogPanel class="w-full max-w-md rounded-2xl bg-white p-6 text-left">
                            <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                                {{ props.title }}
                            </DialogTitle>
                            <p>aaaaaaaaa</p>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>