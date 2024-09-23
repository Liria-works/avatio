<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { Icon } from "@iconify/vue";
import { useShare } from '@vueuse/core'

import Tooltip from '../tooltip.vue';

import { writeClipboard } from '../../lib/text';

const { share, isSupported } = useShare()

function startShare() {
    share({
        title: 'Hello',
        text: 'Hello my friend!',
        url: location.href,
    })
}

const props = withDefaults(
    defineProps<{
        link: string;
        triggerIcon?: string;
        triggerIconSize?: number;
        triggerLabel?: string;
        triggerOutline?: boolean;
        triggerColorBg?: string;
        triggerColorOutline?: string;
        triggerColorText?: string;
        triggerColorIcon?: string;
        triggerPadding?: string;
        triggerRounded?: string;
        triggerText?: string;
        triggerTooltip?: string;
    }>(),
    {
        triggerIcon: "",
        triggerIconSize: 18,
        triggerLabel: "",
        triggerOutline: true,
        triggerColorBg:
            "bg-transparent dark:bg-transparent hover:bg-neutral-200 dark:hover:bg-neutral-800",
        triggerColorOutline: "border-neutral-400 dark:border-neutral-600",
        triggerColorText: "text-neutral-800 dark:text-neutral-200",
        triggerColorIcon: "text-neutral-600 dark:text-neutral-300",
        triggerPadding: "px-4 py-3",
        triggerRounded: "rounded-lg",
        triggerText: "text-sm font-semibold",
        triggerTooltip: "",
    },
);
</script>

<template>
    <div>
        <Menu as="div" class="relative inline-block text-left">
            <div>
                <Tooltip :text="props.triggerTooltip">
                    <MenuButton id="menu-button-share" w-fit flex gap-2 items-center justify-center
                        :class="`${props.triggerText} ${props.triggerPadding} ${props.triggerRounded} ${props.triggerColorBg} ${props.triggerColorText} ${triggerOutline ? 'border border-1' : 'border-0'} ${props.triggerColorOutline}`">
                        <Icon v-if="props.triggerIcon.length" :icon="props.triggerIcon" :width="props.triggerIconSize"
                            :height="props.triggerIconSize" :class="`${props.triggerColorIcon}`" />
                        <p empty:hidden whitespace-nowrap>{{ props.triggerLabel }}</p>
                    </MenuButton>
                </Tooltip>
            </div>

            <transition enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0">
                <MenuItems absolute right-0 mt-2 w-56 origin-top-right rounded-xl shadow-lg divide="y neutral-100"
                    bg="white dark:black">
                    <div p-2>
                        <MenuItem v-slot="{ active }">
                        <a :href="`http://twitter.com/share?url=${props.link}&hashtags=avatio`" target="_blank" :class="[
                            active ? 'bg-neutral-300 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100' : 'text-neutral-900 dark:text-neutral-100',
                            'group flex w-full items-center rounded-lg px-2 py-2 text-sm',
                        ]">
                            <Icon :active="active" icon="simple-icons:x" mr-2 h-5 w-5
                                text="neutral-600 dark:neutral-300" />
                            ポスト
                        </a>
                        </MenuItem>

                        <MenuItem v-slot="{ active }">
                        <button :class="[
                            active ? 'bg-neutral-300 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100' : 'text-neutral-900 dark:text-neutral-100',
                            'group flex w-full items-center rounded-lg px-2 py-2 text-sm',
                        ]" @click="writeClipboard(props.link)">
                            <Icon :active="active" icon="lucide:link" mr-2 h-5 w-5
                                text="neutral-600 dark:neutral-300" />
                            リンクをコピー
                        </button>
                        </MenuItem>

                        <MenuItem v-slot="{ active }">
                        <button :class="[
                            active ? 'bg-neutral-300 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100' : 'text-neutral-900 dark:text-neutral-100',
                            'group flex w-full items-center rounded-lg px-2 py-2 text-sm',
                        ]" @click="startShare()">
                            <Icon :active="active" icon="lucide:share-2" mr-2 h-5 w-5
                                text="neutral-600 dark:neutral-300" />
                            その他
                        </button>
                        </MenuItem>
                    </div>
                </MenuItems>
            </transition>
        </Menu>
    </div>
</template>