<script setup lang="ts">
import { ref, useId } from 'vue';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { ToastClose, ToastDescription, ToastProvider, ToastRoot, ToastTitle, ToastViewport } from 'radix-vue'
import { useStore } from '@nanostores/vue';

import { toast } from '../lib/store'

const $toast = useStore(toast)
toast.set([{ title: 'test', description: 'test', duration: 8000 }])

const toastRef = ref<{ title?: string; description: string; duration?: number }[]>([])
</script>

<template>
    <ToastProvider>
        <div v-for="i in $toast">
            <ToastRoot :key="'toast-' + useId()" :duration="i.duration" bg-white dark:bg-black rounded-lg px-4 py-3
                shadow-xl>
                <template v-slot="slot">
                    <div w-full gap-4 flex items-center justify-between>
                        <div flex flex-col gap-1>
                            <ToastTitle v-if="i.title" font-semibold>
                                {{ i.title }}
                            </ToastTitle>

                            <ToastDescription as-child>
                                <p text-sm>{{ i.description }}</p>
                            </ToastDescription>
                        </div>

                        <ToastClose as-child altText="Close Toast">
                            <button type="button" relative>
                                <div size-6 transform-rotate-270>
                                    <svg height="100%" viewBox="0 0 20 20" width="100%" style="overflow: visible;">
                                        <circle cx="50%" cy="50%" r="9" fill-neutral-100 stroke-width-2
                                            stroke-neutral-200 />
                                        <circle cx="50%" cy="50%" r="9" stroke-linecap="round" fill-none stroke-width-2
                                            stroke-neutral-500
                                            :stroke-dashoffset="56.5487 - slot.remaining / (i.duration ? i.duration : 5000) * 56.5487"
                                            :stroke-dasharray="56.5487" />
                                    </svg>
                                </div>

                                <Icon icon="lucide:x" absolute inset-0 size-full p-1 text="neutral-600" />
                            </button>
                        </ToastClose>
                    </div>
                </template>
            </ToastRoot>
        </div>
        <ToastViewport fixed bottom-0 right-0 p-3 flex flex-col gap-3 outline-none
            class="min-w-[20vw] max-w-[100vw] md:max-w-md z-[2147483647]" />
    </ToastProvider>
</template>