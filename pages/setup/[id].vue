<script setup lang="ts">
import { useShare } from '@vueuse/core';

const user = useSupabaseUser();
const client = await useSBClient();
const route = useRoute();
const currentUrl = ref<string>('');

const modalLogin = ref(false);
const modalReport = ref(false);
const modalDelete = ref(false);

const id = Number(route.params.id);
const setup = ref<Setup | null>(null);
const bookmark = ref(false);

const toggleBookmark = async () => {
    if (!user.value) return (modalLogin.value = true);

    if (!setup.value) return new Error('Invalid setup data');

    if (bookmark.value) await useRemoveBookmark(setup.value.id);
    else await useAddBookmark(setup.value.id);

    bookmark.value = await useCheckBookmark(setup.value.id);
};

const { share, isSupported } = useShare();

const categorizedItems: {
    [key: string]: {
        data: Item;
        note: string;
        unsupported: boolean;
    }[];
} = {};
const categoryAttr: { [key: string]: { label: string; icon: string } } = {
    cloth: { label: '衣装', icon: 'lucide:shirt' },
    accessory: { label: 'アクセサリー', icon: 'lucide:star' },
    other: { label: 'その他', icon: 'lucide:package' },
};

onMounted(async () => {
    if (!route.params.id)
        showError({
            statusCode: 404,
            message: 'IDが無効です',
        });

    const { data } = await client
        .from('setups')
        .select(
            `
            id,
            created_at,
            updated_at,
            name,
            description,
            avatar(id, updated_at, outdated, name, thumbnail, price, shop:shop_id(id, name, thumbnail, verified), nsfw),
            avatar_note,
            author(id, name, avatar),
            image,
            items:setup_items(data:item_id(id, updated_at, outdated, category, name, thumbnail, price, shop:shop_id(id, name, thumbnail, verified), nsfw), note, unsupported),
            tags:setup_tags(tag)
            `
        )
        .eq('id', Number(id))
        .returns<Setup>();

    setup.value = data;

    if (!setup.value)
        return showError({
            statusCode: 404,
            message: 'セットアップが見つかりませんでした',
        });

    if (setup.value?.items) {
        for (const item of setup.value.items) {
            let category: string;
            if (item.data.category === 209) {
                category = 'cloth';
            } else if (item.data.category === 217) {
                category = 'accessory';
            } else {
                category = 'other';
            }

            if (!categorizedItems[category]) {
                categorizedItems[category] = [];
            }
            categorizedItems[category].push(item);
        }
    }

    bookmark.value = await useCheckBookmark(setup.value.id);

    currentUrl.value = `${window.location.protocol}//${window.location.host}${route.fullPath}`;

    useSeoSetup({
        url: currentUrl.value,
        title: setup.value.name,
        description: setup.value.description,
        image: setup.value.image,
        userAvatar: setup.value.author.avatar,
    });
});
</script>

<template>
    <div
        v-if="setup"
        class="w-full flex flex-col xl:flex-row items-start gap-8"
    >
        <div class="w-full flex flex-col items-center gap-8">
            <div class="w-full flex flex-col gap-3">
                <h1
                    class="w-full text-left text-2xl font-bold line-clamp-2 break-keep [overflow-wrap:anywhere;] text-black dark:text-white"
                >
                    {{ useSentence(setup.name) || '' }}
                </h1>

                <div class="w-full gap-3 flex flex-wrap items-center">
                    <div class="grow flex items-center gap-5">
                        <UiUser
                            :id="setup.author.id"
                            :name="setup.author.name"
                            :avatar="setup.author.avatar"
                        />

                        <div class="flex items-center gap-2">
                            <p
                                class="text-sm text-neutral-500 dark:text-neutral-400 whitespace-nowrap leading-none"
                            >
                                {{
                                    new Date(setup.created_at).toLocaleString(
                                        'ja-JP',
                                        {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                        }
                                    )
                                }}
                                に公開
                            </p>

                            <UiTooltip
                                v-if="setup.updated_at !== setup.created_at"
                                :text="
                                    new Date(setup.updated_at).toLocaleString(
                                        'ja-JP',
                                        {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                        }
                                    ) + 'に編集'
                                "
                            >
                                <Icon
                                    name="lucide:pen"
                                    size="14"
                                    class="text-neutral-500 dark:text-neutral-500"
                                />
                            </UiTooltip>
                        </div>
                    </div>

                    <div class="flex items-center gap-1">
                        <UiButton
                            v-if="user?.id !== setup.author.id"
                            :tooltip="
                                bookmark
                                    ? 'ブックマークから削除'
                                    : 'ブックマーク'
                            "
                            :icon="
                                bookmark
                                    ? 'lucide:bookmark-x'
                                    : 'lucide:bookmark'
                            "
                            padding=""
                            class="p-2.5 hover:bg-neutral-300 hover:dark:bg-neutral-600"
                            :icon-class="
                                bookmark
                                    ? 'text-red-500 dark:text-red-400'
                                    : 'text-neutral-600 dark:text-neutral-300'
                            "
                            @click="toggleBookmark"
                        />

                        <UiButton
                            v-if="user?.id === setup.author.id"
                            tooltip="削除"
                            icon="lucide:trash"
                            :icon-size="18"
                            class="p-2.5 hover:bg-neutral-300 hover:dark:bg-neutral-600"
                            icon-class="text-red-400 dark:text-red-300"
                            @click="modalDelete = true"
                        />

                        <UPopover
                            :ui="{
                                rounded: 'rounded-xl',
                                ring: 'ring-1 ring-gray-300 dark:ring-gray-600',
                            }"
                            class="flex"
                        >
                            <UiButton
                                icon="lucide:share-2"
                                :icon-size="18"
                                tooltip="シェア"
                                class="p-2.5 hover:bg-neutral-300 hover:dark:bg-neutral-600"
                            />

                            <template #panel="{ close }">
                                <div
                                    class="flex flex-col gap-0.5 text-sm p-2 min-w-48"
                                >
                                    <UiButton
                                        :to="`http://x.com/intent/tweet?text=${encodeURIComponent(setup.name + ' | ' + setup.author.name)}&url=${currentUrl}&hashtags=avatio`"
                                        new-tab
                                        icon="simple-icons:x"
                                        :icon-size="18"
                                        label="ポスト"
                                        class="w-full outline-0"
                                    />
                                    <UiButton
                                        icon="lucide:link"
                                        :icon-size="18"
                                        label="URLをコピー"
                                        class="w-full outline-0"
                                        @click="
                                            useWriteClipboard(currentUrl);
                                            close();
                                        "
                                    />
                                    <UiButton
                                        v-if="isSupported"
                                        icon="lucide:share-2"
                                        :icon-size="18"
                                        label="その他"
                                        class="w-full outline-0"
                                        @click="
                                            share({
                                                title: setup.name,
                                                text: setup.description
                                                    ? setup.description
                                                    : '',
                                                url: currentUrl,
                                            })
                                        "
                                    />
                                </div>
                            </template>
                        </UPopover>
                    </div>
                </div>
            </div>

            <NuxtImg
                v-if="setup.image"
                :src="useGetImage(setup.image)"
                :alt="setup.name"
                class="rounded-xl max-h-[70vh] content-stretch"
            />

            <div class="w-full flex flex-col gap-3">
                <UiTitle label="ベースアバター" icon="lucide:person-standing" />
                <ItemBooth
                    v-if="setup.avatar"
                    size="lg"
                    :note="setup.avatar_note"
                    :id="setup.avatar.id"
                    :name="setup.avatar.name"
                    :thumbnail="setup.avatar.thumbnail"
                    :shop="setup.avatar.shop.name"
                    :shop-id="setup.avatar.shop.id"
                    :shop-thumbnail="setup.avatar.shop.thumbnail"
                    :shop-verified="setup.avatar.shop.verified"
                    :price="setup.avatar.price"
                    :nsfw="setup.avatar.nsfw"
                    :outdated="setup.avatar.outdated"
                    :updated-at="setup.avatar.updated_at"
                />
            </div>

            <div
                v-if="Object.keys(categorizedItems).length"
                class="w-full flex flex-col gap-3"
            >
                <div
                    v-for="i in Object.keys(categorizedItems)"
                    :key="useId()"
                    class="w-full flex flex-col gap-3"
                >
                    <UiTitle
                        :label="categoryAttr[i].label"
                        :icon="categoryAttr[i].icon"
                    />

                    <ItemBooth
                        v-for="item in categorizedItems[i]"
                        :id="item.data.id"
                        :key="'item-' + item.data.id"
                        :note="item.note"
                        :unsupported="item.unsupported"
                        :name="item.data.name"
                        :thumbnail="item.data.thumbnail"
                        :price="item.data.price"
                        :shop="item.data.shop.name"
                        :shop-id="item.data.shop.id"
                        :shop-thumbnail="item.data.shop.thumbnail"
                        :shop-verified="item.data.shop.verified"
                        :nsfw="item.data.nsfw"
                        :updated-at="item.data.updated_at"
                        :outdated="item.data.outdated"
                    />
                </div>
            </div>
        </div>

        <div class="w-full xl:w-96 xl:pt-12 flex flex-col items-start gap-6">
            <div
                v-if="setup.description"
                class="w-full gap-2 flex flex-col justify-start items-start"
            >
                <Title label="説明" icon="lucide:text" />
                <div
                    class="w-full rounded-lg flex items-center px-3 py-2 border border-1 border-neutral-300 dark:border-neutral-600"
                >
                    <p
                        class="text-sm/relaxed whitespace-pre-wrap break-keep [overflow-wrap:anywhere] text-neutral-900 dark:text-neutral-100"
                    >
                        {{ useSentence(setup.description) || '' }}
                    </p>
                </div>
            </div>

            <div
                v-if="setup.tags && setup.tags.length"
                class="gap-2.5 flex flex-col"
            >
                <Title label="タグ" icon="lucide:tags" />
                <div class="items-center gap-1.5 flex flex-row flex-wrap">
                    <button
                        v-for="tag in setup.tags"
                        :key="useId()"
                        class="px-3.5 py-2 rounded-full text-sm font-semibold border border-1 border-neutral-400 dark:border-neutral-500 hover:bg-neutral-300 hover:dark:bg-neutral-600 text-neutral-900 dark:text-neutral-200"
                        @click="navigateTo(`/search?tag=${tag.tag}`)"
                    >
                        {{ tag.tag }}
                    </button>
                </div>
            </div>

            <UiButton
                label="セットアップを報告"
                icon="lucide:flag"
                :icon-size="16"
                :outline="false"
                class="px-3 py-2 mt-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 hover:bg-neutral-300 hover:dark:bg-neutral-700"
                icon-class="text-red-400 dark:text-red-400"
                @click="
                    if (user) {
                        modalReport = true;
                    } else {
                        modalLogin = true;
                    }
                "
            />
        </div>

        <UModal
            v-model="modalLogin"
            :ui="{
                background: 'bg-white dark:bg-neutral-100',
                ring: 'ring-0',
                rounded: 'rounded-xl',
            }"
        >
            <UiLogin
                :redirect="`/setup/${route.params.id}`"
                @success="
                    modalLogin = false;
                    (async () => {
                        if (!setup) return;
                        bookmark = await useCheckBookmark(setup.id);
                    })();
                "
            />
        </UModal>

        <ModalReportSetup v-model="modalReport" :id="Number(setup?.id)" />

        <UModal
            v-model="modalDelete"
            :ui="{
                background: 'bg-white dark:bg-neutral-700',
                ring: 'ring-0',
                rounded: 'rounded-xl',
            }"
        >
            <UCard
                :ui="{
                    ring: '',
                    divide: 'divide-y divide-gray-100 dark:divide-gray-800',
                }"
            >
                <template #header>
                    <div
                        class="w-full pr-2 flex flex-row gap-2 items-center justify-center"
                    >
                        <Icon
                            name="lucide:trash"
                            size="20"
                            class="text-neutral-600 dark:text-neutral-400"
                        />
                        <span
                            class="text-black dark:text-neutral-100 font-medium"
                        >
                            セットアップ削除
                        </span>
                    </div>
                </template>

                <span
                    class="w-full text-md font-normal text-neutral-800 dark:text-neutral-100 text-center"
                >
                    セットアップを削除します。<br />この操作は取り消せません。よろしいですか？
                </span>

                <template #footer>
                    <UButton
                        v-if="setup"
                        label="削除"
                        variant="outline"
                        block
                        size="lg"
                        color="red"
                        @click="useDeleteSetup(setup.id, setup.image)"
                    />
                </template>
            </UCard>
        </UModal>
    </div>
</template>
