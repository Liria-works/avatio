<!-- eslint-disable vue/no-dupe-keys -->
<script lang="ts" setup>
import { tv } from "tailwind-variants";

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

const modal = tv({
    slots: {
        thumbnail: "rounded-lg object-cover",
        thumbnailFrame: "flex-shrink-0",
        infoFrame: "w-fit flex flex-col gap-3 items-start justify-center",
        name: "w-fit text-black dark:text-white font-medium break-all",
    },
    variants: {
        size: {
            lg: {
                thumbnail: "size-32",
                thumbnailFrame: "p-4",
                infoFrame: "h-32",
                name: "line-clamp-2",
            },
            md: {
                thumbnail: "size-20",
                thumbnailFrame: "p-1.5 pr-4",
                infoFrame: "h-20",
                name: "line-clamp-1",
            },
        },
        nsfw: {
            true: {
                thumbnail: "blur-md",
            },
        },
    },
});
const { thumbnail, thumbnailFrame, infoFrame, name } = modal({
    size: props.size,
    nsfw: props.nsfw,
});
</script>

<template>
    <ItemBase class="">
        <template #thumbnail>
            <div :class="thumbnailFrame()">
                <div class="overflow-clip rounded-lg">
                    <NuxtImg
                        :src="props.thumbnail"
                        :alt="props.name"
                        :class="thumbnail()"
                    />
                </div>
            </div>
        </template>
        <template #main>
            <div class="w-full flex gap-5 pr-4 justify-between">
                <div :class="infoFrame()">
                    <div class="w-fit flex items-center gap-2">
                        <NuxtLink
                            :to="booth_url + props.id"
                            target="_blank"
                            class="w-fit gap-2"
                        >
                            <p :class="name()">
                                {{ useSentence(props.name) }}
                            </p>
                        </NuxtLink>

                        <ATooltip v-if="props.nsfw" text="NSFW">
                            <Icon
                                name="heroicons:heart-16-solid"
                                size="18"
                                class="text-pink-400"
                            />
                        </ATooltip>
                    </div>

                    <NuxtLink
                        :to="`https://${props.shopId}.booth.pm/`"
                        target="_blank"
                        class="flex items-center gap-1.5 w-fit"
                    >
                        <NuxtImg
                            :src="props.shopThumbnail"
                            :alt="props.shop"
                            class="size-5 rounded-md"
                        />
                        <span
                            class="text-neutral-700 dark:text-neutral-300 text-sm font-medium line-clamp-1 break-all"
                        >
                            {{ props.shop }}
                        </span>
                        <Icon
                            v-if="props.shopVerified"
                            name="lucide:check"
                            size="16"
                            class="flex-shrink-0 text-neutral-700 dark:text-neutral-300 size-3"
                        />
                    </NuxtLink>

                    <div
                        v-if="props.size === 'lg'"
                        class="flex items-center gap-1"
                    >
                        <UButton
                            label="サンプルアバター"
                            icon="lucide:user-round"
                            variant="outline"
                            size="xs"
                            :ui="{
                                variant: {
                                    outline:
                                        'ring-neutral-300 dark:ring-neutral-500 hover:bg-neutral-200 hover:dark:bg-neutral-600',
                                },
                            }"
                            class="hidden"
                            @click="modalSampleAvatar = true"
                        />
                        <ModalSampleAvatar
                            :open="modalSampleAvatar"
                            @update:open="modalSampleAvatar = $event"
                        />

                        <ATooltip text="アバター詳細の提案">
                            <UButton
                                icon="lucide:send"
                                variant="outline"
                                size="xs"
                                :ui="{
                                    variant: {
                                        outline:
                                            'ring-neutral-300 dark:ring-neutral-500 hover:bg-neutral-200 hover:dark:bg-neutral-600',
                                    },
                                }"
                                @click="modalAvatarSuggest = true"
                            />
                        </ATooltip>
                        <ModalAvatarSuggest
                            :open="modalAvatarSuggest"
                            @update:open="modalAvatarSuggest = $event"
                        />

                        <ATooltip text="アイテムからセットアップを検索">
                            <UButton
                                :to="{
                                    name: 'search',
                                    query: { item: props.id },
                                }"
                                icon="lucide:search"
                                :label="'セットアップ検索'"
                                variant="outline"
                                size="xs"
                                :ui="{
                                    variant: {
                                        outline:
                                            'ring-neutral-300 dark:ring-neutral-500 hover:bg-neutral-200 hover:dark:bg-neutral-600',
                                    },
                                }"
                            />
                        </ATooltip>
                    </div>
                </div>
                <div class="w-fit flex items-center gap-3 flex-shrink-0">
                    <ATooltip
                        v-if="props.unsupported"
                        text="ベースアバターに非対応"
                    >
                        <Icon
                            name="heroicons:paint-brush-20-solid"
                            size="18"
                            class="text-neutral-200"
                        />
                    </ATooltip>

                    <UButton
                        :to="booth_url + props.id"
                        target="_blank"
                        :label="props.price"
                        icon="lucide:external-link"
                        trailing
                        variant="link"
                        :padded="false"
                        :ui="{ icon: { size: { sm: 'size-4' } } }"
                    />

                    <ATooltip
                        v-if="props.size !== 'lg'"
                        text="アイテムからセットアップを検索"
                    >
                        <UButton
                            :to="{
                                name: 'search',
                                query: { item: props.id },
                            }"
                            icon="lucide:search"
                            variant="outline"
                            size="xs"
                            :ui="{
                                variant: {
                                    outline:
                                        'ring-neutral-300 dark:ring-neutral-500 hover:bg-neutral-200 hover:dark:bg-neutral-600',
                                },
                            }"
                        />
                    </ATooltip>
                </div>
            </div>
        </template>
        <template #under>
            <div v-if="props.note" class="w-full flex px-3 pb-3">
                <div
                    class="w-full px-3 py-2 gap-2 flex items-center rounded-lg bg-neutral-200 dark:bg-neutral-600"
                >
                    <Icon
                        name="lucide:pen-line"
                        size="14"
                        class="self-start flex-shrink-0 mt-0.5 text-neutral-400 dark:text-neutral-400"
                    />
                    <span
                        class="text-xs/relaxed pb-px break-keep whitespace-break-spaces [overflow-wrap:anywhere]"
                    >
                        {{ props.note }}
                    </span>
                </div>
            </div>
        </template>
    </ItemBase>
</template>
