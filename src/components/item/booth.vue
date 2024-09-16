<script lang="ts" setup>
import { ref } from "vue"
import { sentence } from "../../lib/text";

import { Icon } from "@iconify/vue"

import ItemBase from "../../components/item/base.vue"
import Button from "../button.vue";
import Tooltip from "../tooltip.vue";

const props = withDefaults(
    defineProps<{
        size?: "md" | "lg";
        note?: string | null;
        unsupported?: boolean;
        id: number;
        name: string;
        thumbnail: string;
        shop: string;
        shopId: string;
        shopThumbnail: string;
        shopVerified: boolean;
        price: string;
        nsfw: boolean;
    }>(),
    {
        size: "md",
        note: null,
        unsupported: false,
        nsfw: false,
    }
);

const booth_url = "https://booth.pm/ja/items/";

const modalSampleAvatar = ref(false);
const modalAvatarSuggest = ref(false);
</script>

<template>
    <ItemBase class="">
        <template #thumbnail>
            <div :class="`flex-shrink-0 ${props.size === 'lg' ? 'p-4' : 'p-1.5 pr-4'}`">
                <div class="overflow-clip rounded-lg">
                    <img :src="props.thumbnail" :alt="props.name"
                        :class="`rounded-lg object-cover ${props.size === 'lg' ? 'size-32' : 'size-20'} ${props.nsfw ? 'blur-md' : ''}`" />
                </div>
            </div>
        </template>
        <template #main>
            <div class="w-full flex gap-5 pr-4 justify-between">
                <div
                    :class="`w-fit flex flex-col gap-3 items-start justify-center ${props.size === 'lg' ? 'h-32' : 'h-20'}`">
                    <div class="w-fit flex items-center gap-2">
                        <a :href="booth_url + props.id" target="_blank" class="w-fit gap-2">
                            <p
                                :class="`w-fit text-sm text-black dark:text-white font-medium break-all ${props.size === 'lg' ? 'line-clamp-2' : 'line-clamp-1'}`">
                                {{ sentence(props.name) }}
                            </p>
                        </a>

                        <Tooltip v-if="props.nsfw" text="NSFW">
                            <Icon icon="heroicons:heart-16-solid" size="18" class="text-pink-400" />
                        </Tooltip>
                    </div>

                    <a :href="`https://${props.shopId}.booth.pm/`" target="_blank"
                        class="flex items-center gap-1.5 w-fit">
                        <img :src="props.shopThumbnail" :alt="props.shop" class="size-5 rounded-md" />
                        <span class="text-neutral-700 dark:text-neutral-300 text-xs font-medium line-clamp-1 break-all">
                            {{ props.shop }}
                        </span>
                        <Icon v-if="props.shopVerified" icon="lucide:check" size="16"
                            class="flex-shrink-0 text-neutral-700 dark:text-neutral-300 size-3" />
                    </a>

                    <div v-if="props.size === 'lg'" class="flex items-center gap-1">
                        <Button v-if="false" label="サンプルアバター" icon="lucide:user-round" />

                        <Tooltip text="アバター詳細の提案">
                            <Button icon="lucide:send" padding="p-2" />
                        </Tooltip>

                        <Tooltip text="アイテムからセットアップを検索">
                            <Button icon="lucide:search" :label="'セットアップ検索'"
                                text="text-xs font-semibold whitespace-nowrap" padding="px-3 py-2" />
                        </Tooltip>
                    </div>
                </div>
                <div class="w-fit flex items-center gap-3 flex-shrink-0">
                    <Tooltip v-if="props.unsupported" text="ベースアバターに非対応">
                        <Icon icon="heroicons:paint-brush-20-solid" size="18" class="text-neutral-200" />
                    </Tooltip>

                    <Button :label="props.price" icon="lucide:external-link" />

                    <Tooltip v-if="props.size !== 'lg'" text="アイテムからセットアップを検索">
                        <Button icon="lucide:search" />
                    </Tooltip>
                </div>
            </div>
        </template>
        <template #under>
            <div v-if="props.note" :class="`w-full flex ${props.size === 'lg' ? 'px-4 pb-3' : 'px-1.5 pt-0.5 pb-2'}`">
                <div class="w-full px-3 py-2 gap-2 flex items-center rounded-lg bg-neutral-200 dark:bg-neutral-600">
                    <Icon icon="lucide:pen-line" size="14"
                        class="self-start flex-shrink-0 mt-0.5 text-neutral-400 dark:text-neutral-400" />
                    <span class="text-xs/relaxed break-keep whitespace-break-spaces [overflow-wrap:anywhere]">
                        {{ props.note }}
                    </span>
                </div>
            </div>
        </template>
    </ItemBase>
</template>
