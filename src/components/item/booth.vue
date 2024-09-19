<script lang="ts" setup>
import { ref } from "vue";
import { supabase } from "../../lib/supabase";
import { sentence } from "../../lib/text";

import { Icon } from "@iconify/vue";

import ItemBase from "../../components/item/base.vue";
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
        outdated: boolean;
        updated_at: string;
    }>(),
    {
        size: "md",
        note: null,
        unsupported: false,
        nsfw: false,
    },
);

const booth_url = "https://booth.pm/ja/items/";

const item = ref<{
    name: string;
    thumbnail: string;
    shop: string;
    shopId: string;
    shopThumbnail: string;
    shopVerified: boolean;
    price: string;
    nsfw: boolean;
    outdated: boolean;
}>({
    name: props.name,
    thumbnail: props.thumbnail,
    shop: props.shop,
    shopId: props.shopId,
    shopThumbnail: props.shopThumbnail,
    shopVerified: props.shopVerified,
    price: props.price,
    nsfw: props.nsfw,
    outdated: props.outdated,
});

const timeDifference =
    new Date().getTime() - new Date(props.updated_at).getTime();
// 前回の更新から1日経過している場合、最新データを取得する
if (timeDifference < 24 * 60 * 60 * 1000) {
    const { data, error } = await supabase.functions.invoke(
        "get-booth-item",
        {
            body: { id: props.id },
        },
    );

    // データを取得するコード
    // 取得したデータはitemに代入する
    // HTML側ではpropsではなくitemを使うように
}
</script>

<template>
    <span v-if="!outdated">
        <ItemBase>
            <template #thumbnail>
                <div :class="`flex-shrink-0 ${props.size === 'lg' ? 'p-4' : 'p-1.5 pr-4'}`">
                    <div class="overflow-clip rounded-lg">
                        <a :href="booth_url + props.id" target="_blank">
                            <img :src="props.thumbnail" :alt="props.name"
                                :class="`rounded-lg object-cover ${props.size === 'lg' ? 'size-32' : 'size-20'} ${props.nsfw ? 'blur-md' : ''}`" />
                        </a>
                    </div>
                </div>
            </template>
            <template #main>
                <div class="w-full flex gap-5 pr-4 justify-between items-center">
                    <div
                        :class="`w-fit flex flex-col gap-3 items-start justify-center ${props.size === 'lg' ? 'h-32' : 'h-20'}`">
                        <div class="w-fit flex items-center gap-2">
                            <a :href="booth_url + props.id" target="_blank" class="w-fit gap-2">
                                <p
                                    :class="`w-fit text-sm text-black dark:text-white font-medium break-keep ${props.size === 'lg' ? 'line-clamp-2' : 'line-clamp-1'}`">
                                    {{ sentence(props.name) }}
                                </p>
                            </a>

                            <Tooltip v-if="props.nsfw" text="NSFW">
                                <Icon icon="heroicons:heart-16-solid" size="18" class="text-pink-400" />
                            </Tooltip>
                        </div>

                        <div class="flex items-center gap-3">

                            <a :href="booth_url + props.id" target="_blank"
                                class="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                                {{ props.price }}
                            </a>

                            <a :href="`https://${props.shopId}.booth.pm/`" target="_blank"
                                class="flex items-center gap-1.5 w-fit">
                                <img :src="props.shopThumbnail" :alt="props.shop"
                                    class="size-5 rounded-md border border-1 border-neutral-300" />
                                <span
                                    class="text-neutral-700 dark:text-neutral-300 text-xs font-semibold line-clamp-1 break-all">
                                    {{ props.shop }}
                                </span>
                                <Icon v-if="props.shopVerified" icon="lucide:check" size="16"
                                    class="flex-shrink-0 text-neutral-700 dark:text-neutral-300 size-3" />
                            </a>
                        </div>
                    </div>
                    <div class="w-fit flex flex-col lg:flex-row items-end lg:items-center gap-5 flex-shrink-0">
                        <Tooltip v-if="props.unsupported" text="ベースアバターに非対応">
                            <Icon icon="heroicons:paint-brush-20-solid" :width="18" :height="18"
                                class="text-neutral-600 dark:text-neutral-200" />
                        </Tooltip>

                        <div class="w-fit flex items-center gap-1 flex-shrink-0">
                            <Button icon="lucide:search" tooltip="アイテムからセットアップを検索" padding="p-2" />
                        </div>
                    </div>
                </div>
            </template>
            <template #under>
                <div v-if="props.note"
                    :class="`w-full flex ${props.size === 'lg' ? 'px-4 pb-3' : 'px-1.5 pt-0.5 pb-2'}`">
                    <div class="w-full px-3 py-2 gap-2 flex items-center rounded-lg bg-neutral-200 dark:bg-neutral-600">
                        <Icon icon="lucide:pen-line" :width="15" :height="15"
                            class="self-start flex-shrink-0 mt-[0.2rem] text-neutral-400 dark:text-neutral-400" />
                        <span
                            class="text-xs/relaxed break-keep whitespace-break-spaces [overflow-wrap:anywhere] text-neutral-800 dark:text-neutral-200">
                            {{ props.note }}
                        </span>
                    </div>
                </div>
            </template>
        </ItemBase>
    </span>
</template>
