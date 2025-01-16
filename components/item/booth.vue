<script lang="ts" setup>
type OptionalKeys = 'note' | 'unsupported';
const props = withDefaults(
    defineProps<{
        noAction?: boolean;
        size?: 'md' | 'lg';
        item: Partial<Pick<SetupItem, OptionalKeys>> &
            Omit<SetupItem, OptionalKeys>;
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
    name: props.item.name,
    thumbnail: props.item.thumbnail,
    shop: {
        name: props.item.shop.name,
        id: props.item.shop.id,
        thumbnail: props.item.shop.thumbnail,
        verified: props.item.shop.verified,
    },
    price: props.item.price,
    nsfw: props.item.nsfw,
    outdated: props.item.outdated,
});

onMounted(async () => {
    const timeDifference =
        new Date().getTime() - new Date(props.item.updated_at).getTime();

    // 時間の差分が1日を超えている場合、処理継続する
    if (timeDifference > 24 * 60 * 60 * 1000) {
        const response = await $fetch('/api/item/booth', {
            query: { id: encodeURIComponent(props.item.id) },
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
                :class="[
                    'flex items-center px-6',
                    props.size === 'lg' ? 'h-20 sm:h-32' : 'h-20',
                ]"
            >
                <Icon name="svg-spinners:ring-resize" size="24" />
            </div>
        </template>
    </ItemBase>

    <ItemBase v-else-if="!item.outdated">
        <template #thumbnail>
            <div
                :class="[
                    'flex-shrink-0 pr-4',
                    props.size === 'lg' ? 'p-1.5 sm:p-2' : 'p-1.5',
                ]"
            >
                <NuxtLink
                    :to="booth_url + props.item.id"
                    target="_blank"
                    :class="[
                        'rounded-lg object-cover select-none overflow-hidden flex items-center',
                        props.size === 'lg' ? 'size-20 sm:size-32' : 'size-20',
                    ]"
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
                        :class="[
                            'rounded-lg text-xs',
                            item.nsfw ? 'blur-md' : '',
                        ]"
                    />
                </NuxtLink>
            </div>
        </template>

        <template #main>
            <div class="w-full flex gap-5 pr-4 justify-between items-center">
                <div
                    :class="[
                        'w-fit flex flex-col gap-3 items-start justify-center',
                        props.size === 'lg' ? 'h-20 sm:h-32 pl-1.5' : 'h-20',
                    ]"
                >
                    <div class="w-fit flex items-center gap-2">
                        <NuxtLink
                            :to="booth_url + props.item.id"
                            target="_blank"
                            class="w-fit gap-2"
                        >
                            <p
                                :class="[
                                    'w-fit font-medium text-sm sm:text-base text-left break-keep text-black dark:text-white',
                                    props.size === 'lg'
                                        ? 'line-clamp-2'
                                        : 'line-clamp-2 sm:line-clamp-1',
                                ]"
                            >
                                {{ useSentence(item.name) }}
                            </p>
                        </NuxtLink>

                        <UiTooltip v-if="item.nsfw" text="NSFW">
                            <Icon
                                name="lucide:heart"
                                :size="18"
                                class="text-pink-400"
                            />
                        </UiTooltip>
                    </div>

                    <div class="flex items-center gap-3">
                        <NuxtLink
                            :to="booth_url + props.item.id"
                            target="_blank"
                            class="text-sm font-semibold leading-none whitespace-nowrap text-zinc-700 dark:text-zinc-300"
                        >
                            {{ item.price ? item.price : '価格不明' }}
                        </NuxtLink>

                        <HovercardShop :shop="item.shop">
                            <NuxtLink
                                :to="`https://${item.shop.id}.booth.pm/`"
                                target="_blank"
                                class="flex items-center gap-1.5 w-fit"
                            >
                                <NuxtImg
                                    :src="item.shop.thumbnail"
                                    :alt="item.shop.name"
                                    class="size-5 rounded-md border border-zinc-300"
                                />
                                <span
                                    class="font-semibold text-xs line-clamp-1 break-all leading-none whitespace-nowrap text-zinc-700 dark:text-zinc-300"
                                >
                                    {{ item.shop.name }}
                                </span>
                                <Icon
                                    v-if="item.shop.verified"
                                    name="lucide:check"
                                    :size="16"
                                    class="flex-shrink-0 size-3 text-zinc-700 dark:text-zinc-300"
                                />
                            </NuxtLink>
                        </HovercardShop>
                    </div>
                </div>
                <div class="w-fit gap-3 flex flex-shrink-0 items-center">
                    <UiTooltip
                        v-if="props.item.unsupported"
                        text="ベースアバターに非対応"
                    >
                        <Icon
                            name="lucide:user-x"
                            :size="18"
                            class="text-zinc-600 dark:text-zinc-200"
                        />
                    </UiTooltip>

                    <div
                        v-if="!props.noAction"
                        class="w-fit items-center gap-1 flex flex-row flex-shrink-0"
                    >
                        <ButtonBase
                            :to="{
                                name: 'search',
                                query: { item: props.item.id },
                            }"
                            icon="lucide:search"
                            tooltip="このアイテムを含むセットアップを検索"
                            aria-label="このアイテムを含むセットアップを検索"
                            class="p-2"
                        />
                    </div>
                </div>
            </div>
        </template>
        <template #under>
            <div
                v-if="props.item.note"
                class="w-full m-2 mt-0 px-3 py-2 gap-2 flex items-center rounded-lg bg-zinc-100 dark:bg-zinc-800 ring-inset ring-1 ring-zinc-300 dark:ring-zinc-700"
            >
                <Icon
                    name="lucide:pen-line"
                    :size="15"
                    class="flex-shrink-0 mt-[0.2rem] text-zinc-400 dark:text-zinc-400"
                />
                <p
                    class="text-xs/relaxed text-left break-keep whitespace-break-spaces [overflow-wrap:anywhere] text-zinc-900 dark:text-zinc-100"
                >
                    {{ props.item.note }}
                </p>
            </div>
        </template>
    </ItemBase>

    <ItemBase v-else>
        <template #main>
            <div class="h-20 flex items-center gap-2">
                <Icon
                    name="lucide:file-question"
                    class="size-6 m-8 text-zinc-700 dark:text-zinc-200"
                />
                <div class="flex flex-col items-start gap-3 pb-0.5">
                    <p
                        class="text-sm font-semibold leading-none text-zinc-900 dark:text-zinc-100"
                    >
                        アイテムの取得に失敗
                    </p>
                    <p
                        class="text-xs font-medium leading-none text-zinc-600 dark:text-zinc-300"
                    >
                        アイテムが非公開になっているか、削除されている可能性があります
                    </p>
                </div>
            </div>
        </template>
    </ItemBase>
</template>
