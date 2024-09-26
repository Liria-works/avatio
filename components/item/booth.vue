<!-- eslint-disable vue/no-dupe-keys -->
<script lang="ts" setup>
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
        updatedAt: string;
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
        new Date().getTime() - new Date(props.updatedAt).getTime();

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
// import { tv } from "tailwind-variants";

// const props = withDefaults(
//     defineProps<{
//         size?: "md" | "lg";
//         note?: string | null;
//         unsupported?: boolean;
//         id: number;
//         name: string;
//         thumbnail: string;
//         shop: string;
//         shopId: string;
//         shopThumbnail: string;
//         shopVerified: boolean;
//         price: string;
//         nsfw: boolean;
//     }>(),
//     {
//         size: "md",
//         note: null,
//         unsupported: false,
//         nsfw: false,
//     }
// );

// const booth_url = "https://booth.pm/ja/items/";

// const modalSampleAvatar = ref(false);
// const modalAvatarSuggest = ref(false);

// const modal = tv({
//     slots: {
//         thumbnail: "rounded-lg object-cover",
//         thumbnailFrame: "flex-shrink-0",
//         infoFrame: "w-fit flex flex-col gap-3 items-start justify-center",
//         name: "w-fit text-black dark:text-white font-medium break-all",
//     },
//     variants: {
//         size: {
//             lg: {
//                 thumbnail: "size-32",
//                 thumbnailFrame: "p-4",
//                 infoFrame: "h-32",
//                 name: "line-clamp-2",
//             },
//             md: {
//                 thumbnail: "size-20",
//                 thumbnailFrame: "p-1.5 pr-4",
//                 infoFrame: "h-20",
//                 name: "line-clamp-1",
//             },
//         },
//         nsfw: {
//             true: {
//                 thumbnail: "blur-md",
//             },
//         },
//     },
// });
// const { thumbnail, thumbnailFrame, infoFrame, name } = modal({
//     size: props.size,
//     nsfw: props.nsfw,
// });
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
                                {{ useSentence(item.name) }}
                            </p>
                        </a>

                        <UiTooltip v-if="item.nsfw" text="NSFW">
                            <Icon name="heroicons:heart-16-solid" :size="18" text-pink-400 />
                        </UiTooltip>
                    </div>

                    <div flex items-center gap-3>

                        <NuxtLink :href="booth_url + props.id" target="_blank" text-sm font-semibold
                            class="text-neutral-700 dark:text-neutral-300">
                            {{ item.price }}
                        </NuxtLink>

                        <a :href="`https://${item.shopId}.booth.pm/`" target="_blank" flex items-center gap-1.5 w-fit>
                            <NuxtImg :src="item.shopThumbnail" :alt="item.shop" size-5 rounded-md
                                class="border border-1 border-neutral-300" />
                            <span font-semibold line-clamp-1 break-all text="neutral-700 dark:neutral-300 xs">
                                {{ item.shop }}
                            </span>
                            <Icon v-if="item.shopVerified" name="lucide:check" :size="16" flex-shrink-0 size-3
                                text="neutral-700 dark:neutral-300" />
                        </a>
                    </div>
                </div>
                <div w-fit gap-3 flex flex-shrink-0 items-center>
                    <UiTooltip v-if="props.unsupported" text="ベースアバターに非対応">
                        <Icon name="heroicons:paint-brush-20-solid" :size="18" text="neutral-600 dark:neutral-200" />
                    </UiTooltip>

                    <div w-fit items-center gap-1 flex="row shrink-0">
                        <UiButton icon="lucide:search" tooltip="アイテムからセットアップを検索" padding="p-2" />
                    </div>
                </div>
            </div>
        </template>
        <template #under>
            <div v-if="props.note" w-full flex :class="`${props.size === 'lg' ? 'px-4 pb-3' : 'px-1.5 pt-0.5 pb-2'}`">
                <div w-full px-3 py-2 gap-2 flex items-center rounded-lg bg="neutral-200 dark:neutral-600">
                    <Icon name="lucide:pen-line" :size="15" self-start flex-shrink-0 mt-[0.2rem]
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
                <Icon name="lucide:file-question" size-5 text="neutral-700 dark:neutral-200" />
                <div flex flex-col gap-1>
                    <p text-sm font-semibold text="neutral-900 dark:neutral-100">アイテムの取得に失敗</p>
                    <p text-xs font-medium text="neutral-600 dark:neutral-300">
                        アイテムが非公開になっているか、削除されている可能性があります</p>
                </div>
            </div>
        </template>
    </ItemBase>

    <!-- <ItemBase class="">
        <template #thumbnail>
            <div :class="thumbnailFrame()">
                <div class="overflow-clip rounded-lg">
                    <NuxtImg :src="props.thumbnail" :alt="props.name" :class="thumbnail()" />
                </div>
            </div>
        </template>
        <template #main>
            <div class="w-full flex gap-5 pr-4 justify-between">
                <div :class="infoFrame()">
                    <div class="w-fit flex items-center gap-2">
                        <NuxtLink :to="booth_url + props.id" target="_blank" class="w-fit gap-2">
                            <p :class="name()">
                                {{ useSentence(props.name) }}
                            </p>
                        </NuxtLink>

                        <UiTooltip v-if="props.nsfw" text="NSFW">
                            <Icon name="heroicons:heart-16-solid" size="18" class="text-pink-400" />
                        </UiTooltip>
                    </div>

                    <NuxtLink :to="`https://${props.shopId}.booth.pm/`" target="_blank"
                        class="flex items-center gap-1.5 w-fit">
                        <NuxtImg :src="props.shopThumbnail" :alt="props.shop" class="size-5 rounded-md" />
                        <span class="text-neutral-700 dark:text-neutral-300 text-sm font-medium line-clamp-1 break-all">
                            {{ props.shop }}
                        </span>
                        <Icon v-if="props.shopVerified" name="lucide:check" size="16"
                            class="flex-shrink-0 text-neutral-700 dark:text-neutral-300 size-3" />
                    </NuxtLink>

                    <div v-if="props.size === 'lg'" class="flex items-center gap-1">
                        <UButton label="サンプルアバター" icon="lucide:user-round" variant="outline" size="xs" :ui="{
                            variant: {
                                outline:
                                    'ring-neutral-300 dark:ring-neutral-500 hover:bg-neutral-200 hover:dark:bg-neutral-600',
                            },
                        }" class="hidden" @click="modalSampleAvatar = true" />
                        <ModalSampleAvatar :open="modalSampleAvatar" @update:open="modalSampleAvatar = $event" />

                        <UiTooltip text="アバター詳細の提案">
                            <UButton icon="lucide:send" variant="outline" size="xs" :ui="{
                                variant: {
                                    outline:
                                        'ring-neutral-300 dark:ring-neutral-500 hover:bg-neutral-200 hover:dark:bg-neutral-600',
                                },
                            }" @click="modalAvatarSuggest = true" />
                        </UiTooltip>
                        <ModalAvatarSuggest :open="modalAvatarSuggest" @update:open="modalAvatarSuggest = $event" />

                        <UiTooltip text="アイテムからセットアップを検索">
                            <UButton :to="{
                                name: 'search',
                                query: { item: props.id },
                            }" icon="lucide:search" :label="'セットアップ検索'" variant="outline" size="xs" :ui="{
                                variant: {
                                    outline:
                                        'ring-neutral-300 dark:ring-neutral-500 hover:bg-neutral-200 hover:dark:bg-neutral-600',
                                },
                            }" />
                        </UiTooltip>
                    </div>
                </div>
                <div class="w-fit flex items-center gap-3 flex-shrink-0">
                    <UiTooltip v-if="props.unsupported" text="ベースアバターに非対応">
                        <Icon name="heroicons:paint-brush-20-solid" size="18" class="text-neutral-200" />
                    </UiTooltip>

                    <UButton :to="booth_url + props.id" target="_blank" :label="props.price" icon="lucide:external-link"
                        trailing variant="link" :padded="false" :ui="{ icon: { size: { sm: 'size-4' } } }" />

                    <UiTooltip v-if="props.size !== 'lg'" text="アイテムからセットアップを検索">
                        <UButton :to="{
                            name: 'search',
                            query: { item: props.id },
                        }" icon="lucide:search" variant="outline" size="xs" :ui="{
                            variant: {
                                outline:
                                    'ring-neutral-300 dark:ring-neutral-500 hover:bg-neutral-200 hover:dark:bg-neutral-600',
                            },
                        }" />
                    </UiTooltip>
                </div>
            </div>
        </template>
        <template #under>
            <div v-if="props.note" class="w-full flex" :class="`w-full flex ${props.size === 'lg' ? 'px-4 pb-3' : 'px-1.5 pt-0.5 pb-2'
                }`">
                <div class="w-full px-3 py-2 gap-2 flex items-center rounded-lg bg-neutral-200 dark:bg-neutral-600">
                    <Icon name="lucide:pen-line" size="14"
                        class="self-start flex-shrink-0 mt-0.5 text-neutral-400 dark:text-neutral-400" />
                    <span class="text-xs/relaxed break-keep whitespace-break-spaces [overflow-wrap:anywhere]">
                        {{ props.note }}
                    </span>
                </div>
            </div>
        </template>
    </ItemBase> -->
</template>
