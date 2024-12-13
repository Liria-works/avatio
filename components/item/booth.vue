<script lang="ts" setup>
const props = withDefaults(
    defineProps<{
        noAction?: boolean;
        size?: 'md' | 'lg';
        note?: string | null;
        unsupported?: boolean;
        id: number;
        name: string;
        thumbnail: string;
        shop: Shop;
        price: string | null;
        nsfw: boolean;
        outdated: boolean;
        updatedAt: string;
    }>(),
    {
        noAction: false,
        size: 'md',
        note: null,
        unsupported: false,
        nsfw: false,
    }
);

const loading = ref(true);

const booth_url = 'https://booth.pm/ja/items/';

const item = ref<{
    name: string;
    thumbnail: string;
    shop: Shop;
    price: string | null;
    nsfw: boolean;
    outdated: boolean;
}>({
    name: props.name,
    thumbnail: props.thumbnail,
    shop: {
        name: props.shop.name,
        id: props.shop.id,
        thumbnail: props.shop.thumbnail,
        verified: props.shop.verified,
    },
    price: props.price,
    nsfw: props.nsfw,
    outdated: props.outdated,
});

onMounted(async () => {
    const timeDifference =
        new Date().getTime() - new Date(props.updatedAt).getTime();

    // 時間の差分が1日を超えている場合、処理継続する
    if (timeDifference > 24 * 60 * 60 * 1000) {
        const response = await $fetch('/api/item/booth', {
            query: { id: encodeURIComponent(props.id) },
        });

        if (response.data)
            item.value = {
                name: response.data.name,
                thumbnail: response.data.thumbnail,
                price: response.data.price,
                shop: {
                    name: response.data.shop.name,
                    id: response.data.shop.id,
                    thumbnail: response.data.shop.thumbnail,
                    verified: response.data.shop.verified,
                },
                nsfw: response.data.nsfw,
                outdated: response.data.outdated,
            };
        if (!response.data) item.value.outdated = true;
    }

    loading.value = false;
});
</script>

<template>
    <ItemBase v-if="loading">
        <template #main>
            <div
                :class="`flex items-center px-6 ${props.size === 'lg' ? 'h-32' : 'h-20'}`"
            >
                <Icon name="svg-spinners:ring-resize" size="24" />
            </div>
        </template>
    </ItemBase>

    <ItemBase v-else-if="!item.outdated">
        <template #thumbnail>
            <div
                :class="`flex-shrink-0 ${props.size === 'lg' ? 'p-2 pr-4' : 'p-1.5 pr-4'}`"
            >
                <div
                    :class="[
                        'rounded-lg object-cover select-none overflow-hidden',
                        props.size === 'lg' ? 'size-32' : 'size-20',
                    ]"
                >
                    <NuxtLink
                        :to="booth_url + props.id"
                        target="_blank"
                        class="size-full flex items-center"
                    >
                        <NuxtImg
                            preload
                            :src="item.thumbnail"
                            :alt="item.name"
                            format="webp"
                            quality="70"
                            :sizes="props.size === 'lg' ? '128px' : '80px'"
                            :width="props.size === 'lg' ? 128 : 80"
                            :height="props.size === 'lg' ? 128 : 80"
                            :class="['rounded-lg', item.nsfw ? 'blur-md' : '']"
                        />
                    </NuxtLink>
                </div>
            </div>
        </template>

        <template #main>
            <div class="w-full flex gap-5 pr-4 justify-between items-center">
                <div
                    :class="`w-fit flex flex-col gap-3 items-start justify-center ${props.size === 'lg' ? 'h-32' : 'h-20'}`"
                >
                    <div class="w-fit flex items-center gap-2">
                        <NuxtLink
                            :to="booth_url + props.id"
                            target="_blank"
                            class="w-fit gap-2"
                        >
                            <p
                                :class="`w-fit font-medium break-keep text-black dark:text-white ${props.size === 'lg' ? 'line-clamp-2' : 'line-clamp-1'}`"
                            >
                                {{ useSentence(item.name) }}
                            </p>
                        </NuxtLink>

                        <UiTooltip v-if="item.nsfw" text="NSFW">
                            <Icon
                                name="heroicons:heart-16-solid"
                                :size="18"
                                class="text-pink-400"
                            />
                        </UiTooltip>
                    </div>

                    <div class="flex items-center gap-3">
                        <NuxtLink
                            :to="booth_url + props.id"
                            target="_blank"
                            class="text-sm font-semibold text-neutral-700 dark:text-neutral-300"
                        >
                            {{ item.price ? item.price : '価格不明' }}
                        </NuxtLink>

                        <NuxtLink
                            :to="`https://${item.shop.id}.booth.pm/`"
                            target="_blank"
                            class="flex items-center gap-1.5 w-fit"
                        >
                            <NuxtImg
                                :src="item.shop.thumbnail"
                                :alt="item.shop.name"
                                class="size-5 rounded-md border border-1 border-neutral-300"
                            />
                            <span
                                class="font-semibold line-clamp-1 break-all text-neutral-700 dark:text-neutral-300 text-xs"
                            >
                                {{ item.shop.name }}
                            </span>
                            <Icon
                                v-if="item.shop.verified"
                                name="lucide:check"
                                :size="16"
                                class="flex-shrink-0 size-3 text-neutral-700 dark:text-neutral-300"
                            />
                        </NuxtLink>
                    </div>
                </div>
                <div class="w-fit gap-3 flex flex-shrink-0 items-center">
                    <UiTooltip
                        v-if="props.unsupported"
                        text="ベースアバターに非対応"
                    >
                        <Icon
                            name="heroicons:paint-brush-20-solid"
                            :size="18"
                            class="text-neutral-600 dark:text-neutral-200"
                        />
                    </UiTooltip>

                    <div
                        v-if="!props.noAction"
                        class="w-fit items-center gap-1 flex flex-row flex-shrink-0"
                    >
                        <UiButton
                            :to="{ name: 'search', query: { item: props.id } }"
                            icon="lucide:search"
                            tooltip="アイテムからセットアップを検索"
                            class="p-2"
                        />
                    </div>
                </div>
            </div>
        </template>
        <template #under>
            <div
                v-if="props.note"
                class="w-full m-2 mt-0 px-3 py-2 gap-2 flex items-center rounded-lg bg-neutral-200 dark:bg-neutral-600"
            >
                <Icon
                    name="lucide:pen-line"
                    :size="15"
                    class="flex-shrink-0 mt-[0.2rem] text-neutral-400 dark:text-neutral-400"
                />
                <p
                    class="text-xs/relaxed break-keep whitespace-break-spaces [overflow-wrap:anywhere] text-neutral-800 dark:text-neutral-200"
                >
                    {{ props.note }}
                </p>
            </div>
        </template>
    </ItemBase>

    <ItemBase v-else>
        <template #main>
            <div class="h-20 flex items-center px-5 gap-4">
                <Icon
                    name="lucide:file-question"
                    class="size-5 text-neutral-700 dark:text-neutral-200"
                />
                <div class="flex flex-col gap-3 pb-0.5">
                    <p
                        class="text-sm font-semibold leading-none text-neutral-900 dark:text-neutral-100"
                    >
                        アイテムの取得に失敗
                    </p>
                    <p
                        class="text-xs font-medium leading-none text-neutral-600 dark:text-neutral-300"
                    >
                        アイテムが非公開になっているか、削除されている可能性があります
                    </p>
                </div>
            </div>
        </template>
    </ItemBase>
</template>
