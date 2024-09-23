<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import { sentence } from "../../lib/text";

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

onMounted(async () => {
    const timeDifference =
        new Date().getTime() - new Date(props.updated_at).getTime();

    // 前回の更新から1日経過している場合、最新データを取得する
    if (timeDifference > 24 * 60 * 60 * 1000) {
        const response = await fetch('/api/item/booth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: props.id }),
        });

        if (response.status === 200) {
            const responseData = await response.json();

            item.value.name = responseData.name;
            item.value.thumbnail = responseData.thumbnail;
            item.value.shop = responseData.shop;
            item.value.shopId = responseData.shop_id;
            item.value.shopThumbnail = responseData.shop_thumbnail;
            item.value.shopVerified = responseData.shop_verified;
            item.value.price = responseData.price;
            item.value.nsfw = responseData.nsfw;
            item.value.outdated = responseData.outdated;
        }
    }
});
</script>

<template>
    <ItemBase v-if="!item.outdated">
        <template #thumbnail>
            <div flex-shrink-0 :class="`${props.size === 'lg' ? 'p-2 pr-4' : 'p-1.5 pr-4'}`">
                <div overflow-clip rounded-lg>
                    <a :href="booth_url + props.id" target="_blank">
                        <img :src="item.thumbnail" :alt="item.name" rounded-lg object-cover
                            :class="`${props.size === 'lg' ? 'size-32' : 'size-20'} ${item.nsfw ? 'blur-md' : ''}`" />
                    </a>
                </div>
            </div>
        </template>
        <template #main>
            <div w-full flex gap-5 pr-4 justify-between items-center>
                <div w-fit flex flex-col gap-3 items-start justify-center
                    :class="`${props.size === 'lg' ? 'h-32' : 'h-20'}`">
                    <div w-fit flex items-center gap-2>
                        <a :href="booth_url + props.id" target="_blank" w-fit gap-2>
                            <p w-fit text-sm font-medium break-keep text="black dark:white"
                                :class="`${props.size === 'lg' ? 'line-clamp-2' : 'line-clamp-1'}`">
                                {{ sentence(item.name) }}
                            </p>
                        </a>

                        <Tooltip v-if="item.nsfw" text="NSFW">
                            <Icon icon="heroicons:heart-16-solid" size="18" text-pink-400 />
                        </Tooltip>
                    </div>

                    <div flex items-center gap-3>

                        <a :href="booth_url + props.id" target="_blank" text-sm font-semibold
                            text="neutral-700 dark:neutral-300">
                            {{ item.price }}
                        </a>

                        <a :href="`https://${item.shopId}.booth.pm/`" target="_blank" flex items-center gap-1.5 w-fit>
                            <img :src="item.shopThumbnail" :alt="item.shop" size-5 rounded-md
                                class="border border-1 border-neutral-300" />
                            <span font-semibold line-clamp-1 break-all text="neutral-700 dark:neutral-300 xs">
                                {{ item.shop }}
                            </span>
                            <Icon v-if="item.shopVerified" icon="lucide:check" size="16" flex-shrink-0 size-3
                                text="neutral-700 dark:neutral-300" />
                        </a>
                    </div>
                </div>
                <div w-fit gap-3 flex flex-shrink-0 items-center>
                    <Tooltip v-if="props.unsupported" text="ベースアバターに非対応">
                        <Icon icon="heroicons:paint-brush-20-solid" :width="18" :height="18"
                            text="neutral-600 dark:neutral-200" />
                    </Tooltip>

                    <div w-fit items-center gap-1 flex="row shrink-0">
                        <Button icon="lucide:search" tooltip="アイテムからセットアップを検索" padding="p-2" />
                    </div>
                </div>
            </div>
        </template>
        <template #under>
            <div v-if="props.note" w-full flex :class="`${props.size === 'lg' ? 'px-4 pb-3' : 'px-1.5 pt-0.5 pb-2'}`">
                <div w-full px-3 py-2 gap-2 flex items-center rounded-lg bg="neutral-200 dark:neutral-600">
                    <Icon icon="lucide:pen-line" :width="15" :height="15" self-start flex-shrink-0 mt-[0.2rem]
                        text="neutral-400 dark:neutral-400" />
                    <span break-keep whitespace-break-spaces text="neutral-800 dark:neutral-200"
                        class="text-xs/relaxed [overflow-wrap:anywhere]">
                        {{ props.note }}
                    </span>
                </div>
            </div>
        </template>
    </ItemBase>

    <ItemBase v-else>
        <template #main>
            <div h-22 flex items-center px-5 gap-4>
                <Icon icon="lucide:file-question" size-5 text="neutral-700 dark:neutral-200" />
                <div flex flex-col gap-1>
                    <p text-sm font-semibold text="neutral-900 dark:neutral-100">アイテムの取得に失敗</p>
                    <p text-xs font-medium text="neutral-600 dark:neutral-300">
                        アイテムが非公開になっているか、削除されている可能性があります</p>
                </div>
            </div>
        </template>
    </ItemBase>
</template>
