<script lang="ts" setup>
import { twMerge } from 'tailwind-merge';

type OptionalKeys = 'note' | 'unsupported';
interface Props {
    size?: 'lg' | 'md';
    noAction?: boolean;
    item: Partial<Pick<SetupItem, OptionalKeys>> &
        Omit<SetupItem, OptionalKeys>;
    class?: string | string[];
}
const props = withDefaults(defineProps<Props>(), {
    size: 'md',
    noAction: false,
});

const forceUpdateItem = (await $fetch('/api/edgeConfig/forceUpdateItem')).value;

const loading = ref(false);

const sourceInfo = {
    booth: {
        id: 'booth',
        generateUrl: (id: number) => `https://booth.pm/ja/items/${id}`,
    },
};

const url = sourceInfo.booth.generateUrl(props.item.id);
const item = ref<SetupItem>({
    ...props.item,
    note: props.item.note ?? '',
    unsupported: props.item.unsupported ?? false,
});

onMounted(async () => {
    const timeDifference =
        new Date().getTime() - new Date(props.item.updated_at).getTime();

    // 時間の差分が1日を超えている場合、処理継続する
    // edge config の forceUpdateItem が true の場合は強制的に処理継続する
    if (forceUpdateItem || timeDifference > 24 * 60 * 60 * 1000) {
        loading.value = true;

        const response = await $fetch('/api/item/booth', {
            query: { id: props.item.id },
        });

        if (response.data) item.value = response.data;
        if (!response.data) item.value.outdated = true;

        loading.value = false;
    }
});
</script>

<template>
    <div
        v-if="loading"
        :data-size="props.size"
        :class="
            twMerge(
                'group flex items-center px-6 ring-1 ring-zinc-300 dark:ring-zinc-600 rounded-lg overflow-clip',
                props.class
            )
        "
    >
        <div
            :data-size="props.size"
            class="flex items-center gap-3 h-24 data-[size=lg]:h-24 data-[size=lg]:sm:h-36"
        >
            <Icon name="svg-spinners:ring-resize" size="24" />
            <p class="text-sm font-bold text-zinc-600 dark:text-zinc-400">
                アイテムの最新情報を取得中...
            </p>
        </div>
    </div>

    <div
        v-else
        :class="
            twMerge(
                'flex flex-col ring-1 ring-zinc-300 dark:ring-zinc-600 rounded-lg overflow-clip',
                props.class
            )
        "
    >
        <div class="flex items-center">
            <NuxtLink
                :to="url"
                target="_blank"
                :class="[
                    'shrink-0 pr-4 rounded-lg object-cover select-none overflow-hidden flex items-center',
                    props.size === 'lg' ? 'p-1.5 sm:p-2' : 'p-1.5',
                ]"
            >
                <NuxtImg
                    preload
                    :src="item.thumbnail"
                    :alt="item.name"
                    format="webp"
                    fit="cover"
                    quality="70"
                    :sizes="props.size === 'lg' ? '128px' : '80px'"
                    :width="props.size === 'lg' ? 128 : 80"
                    :height="props.size === 'lg' ? 128 : 80"
                    :class="[
                        'rounded-lg text-xs',
                        props.size === 'lg' ? 'size-20 sm:size-32' : 'size-20',
                        item.nsfw ? 'blur-md' : '',
                    ]"
                />
            </NuxtLink>

            <div class="grow flex gap-5 pr-4 justify-between items-center">
                <div
                    :class="[
                        'w-fit flex flex-col gap-3 items-start justify-center',
                        props.size === 'lg' ? 'h-20 sm:h-32 pl-1.5' : 'h-20',
                    ]"
                >
                    <div class="flex items-center gap-2">
                        <UiTooltip v-if="item.nsfw" text="NSFW">
                            <Icon
                                name="lucide:heart"
                                :size="18"
                                class="text-pink-400"
                            />
                        </UiTooltip>
                        <NuxtLink :to="url" target="_blank" class="w-fit gap-2">
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
                    </div>

                    <div class="flex items-center gap-3">
                        <NuxtLink
                            :to="url"
                            target="_blank"
                            :class="[
                                'mt-px pl-1.5 pr-[0.42rem] py-1 rounded-md flex items-center gap-1',
                                'ring-1 ring-pink-500/60',
                            ]"
                        >
                            <Icon
                                name="lucide:heart"
                                :size="15"
                                class="text-zinc-700 dark:text-zinc-100"
                            />
                            <p
                                class="pb-px text-xs leading-0 whitespace-nowrap text-zinc-700 dark:text-zinc-100"
                            >
                                {{ item.likes || '?' }}
                            </p>
                        </NuxtLink>

                        <NuxtLink
                            :to="url"
                            target="_blank"
                            class="text-sm font-semibold leading-0 whitespace-nowrap text-zinc-700 dark:text-zinc-300"
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
                                    :src="item.shop.thumbnail ?? ''"
                                    :alt="item.shop.name"
                                    :width="20"
                                    :height="20"
                                    format="webp"
                                    fit="cover"
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
                                    class="shrink-0 size-3 text-zinc-700 dark:text-zinc-300"
                                />
                            </NuxtLink>
                        </HovercardShop>
                    </div>
                </div>
                <div class="w-fit gap-3 flex shrink-0 items-center">
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

                    <Button
                        v-if="!props.noAction"
                        :to="{ name: 'search', query: { item: props.item.id } }"
                        icon="lucide:search"
                        tooltip="このアイテムを含むセットアップを検索"
                        aria-label="このアイテムを含むセットアップを検索"
                        class="p-2"
                    />
                </div>
            </div>
        </div>
        <div
            v-if="props.item.note"
            class="m-2 mt-0 px-3 py-2 gap-2 flex items-start rounded-lg bg-zinc-100 dark:bg-zinc-800 ring-inset ring-1 ring-zinc-300 dark:ring-zinc-700"
        >
            <Icon
                name="lucide:pen-line"
                :size="15"
                class="shrink-0 mt-[0.2rem] text-zinc-400 dark:text-zinc-400"
            />
            <p
                class="text-xs/relaxed text-left break-keep whitespace-break-spaces [overflow-wrap:anywhere] text-zinc-900 dark:text-zinc-100"
            >
                {{ props.item.note }}
            </p>
        </div>
    </div>
</template>
