<script setup lang="ts">
const user = useSupabaseUser();
const route = useRoute();
const client = await useSBClient();
const currentUrl = ref();

const modal_login = ref(false);
const modal_report = ref(false);
const modal_delete = ref(false);
const loading = ref(false);

const setup = ref<Setup | null>(null);
const avatar = ref<{ item: BoothItem; note: string | null } | null>(null);
const items = ref<
    { item: BoothItem; note: string | null; unsupported: boolean }[]
>([]);
const outdated = ref<number>(0);

const loading_items = ref<number[]>([]);

const image = ref();
const bookmark = ref(false);
const nsfw = ref(false);
const unsupported = ref(false);

const toggleBookmark = async () => {
    if (!setup.value) {
        return new Error("Invalid setup data");
    }
    if (bookmark.value) {
        await useRemoveBookmark(setup.value.id);
    } else {
        await useAddBookmark(setup.value.id);
    }
    bookmark.value = await useCheckBookmark(setup.value.id);
};

onMounted(async () => {
    if (!route.params.id) {
        return new Error("Invalid id");
    }
    const id: number = Number(route.params.id);
    const { data } = await client
        .from("setups")
        .select(
            "id, created_at, name, description, avatar, avatar_note, tags, author, image, setup_items(item_id, note, unsupported)"
        )
        .eq("id", id)
        .single();
    setup.value = data;

    if (!setup.value) {
        return new Error("Invalid setup data");
    }

    if (setup.value.image) {
        image.value = await useGetImage(setup.value.image);
    }

    const res = await useFetchBooth({
        id: setup.value.avatar,
        url: null,
    });
    if (res) {
        avatar.value = {
            item: res,
            note: setup.value.avatar_note,
        };
    } else {
        console.error("Invalid content:", setup.value.avatar);
        avatar.value = null;
    }

    loading_items.value = setup.value.setup_items.map((item) => item.item_id);

    for await (const i of setup.value.setup_items) {
        const item = await useFetchBooth({ id: i.item_id, url: null });
        if (!item) {
            console.error("Invalid content:", i.item_id);
            outdated.value++;
            loading_items.value = loading_items.value.filter(
                (id) => id !== i.item_id
            );
            continue;
        }

        loading_items.value = loading_items.value.filter(
            (id) => id !== i.item_id
        );

        items.value.push({
            item: item,
            note: i.note,
            unsupported: i.unsupported,
        });

        if (item.nsfw) nsfw.value = true;
        if (i.unsupported) unsupported.value = true;
    }

    bookmark.value = await useCheckBookmark(setup.value.id);

    currentUrl.value = computed(() => {
        const { protocol, host } = window.location;
        return `${protocol}//${host}${route.fullPath}`;
    });

    loading.value = false;
});
</script>

<template>
    <div class="flex-col justify-start items-start gap-2 flex w-full px-3">
        <div
            v-show="!loading"
            class="w-full flex items-center justify-between mb-4"
        >
            <div
                class="items-start md:items-center flex flex-col gap-3 md:flex-row md:gap-7"
            >
                <div
                    class="text-black dark:text-white text-2xl font-bold line-clamp-2"
                >
                    {{ setup?.name || "" }}
                </div>

                <div class="flex items-center gap-7">
                    <div
                        class="text-neutral-600 dark:text-neutral-400 text-sm pt-0.5 whitespace-nowrap"
                    >
                        {{ items.length }} アイテム
                    </div>

                    <p
                        v-if="setup"
                        class="text-sm text-neutral-400 whitespace-nowrap"
                    >
                        {{
                            new Date(setup.created_at).toLocaleString("ja-JP", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                            })
                        }}
                        に公開
                    </p>
                </div>
            </div>
            <div class="flex items-center">
                <div
                    v-if="user?.id === setup?.author"
                    class="flex items-center gap-0.5"
                >
                    <NuxtLink :to="'/setup/edit?id=' + setup?.id">
                        <AButton
                            icon="lucide:pen-line"
                            :icon-size="19"
                            tooltip="編集"
                        />
                    </NuxtLink>
                    <AButton
                        tooltip="削除"
                        icon="lucide:trash"
                        :icon-size="17"
                        class="text-red-400 dark:text-red-300"
                        @click="modal_delete = true"
                    />
                    <UModal
                        v-model="modal_delete"
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
                                    @click="
                                        useDeleteSetup(setup.id, setup.image)
                                    "
                                />
                            </template>
                        </UCard>
                    </UModal>
                </div>

                <div v-else class="flex items-center gap-0.5">
                    <AButton
                        v-if="!bookmark"
                        icon="lucide:bookmark"
                        :icon-size="19"
                        tooltip="ブックマーク"
                        class="text-blue-600 dark:text-blue-400"
                        @click="
                            if (user) {
                                toggleBookmark();
                            } else {
                                modal_login = true;
                            }
                        "
                    />
                    <AButton
                        v-if="bookmark"
                        icon="lucide:bookmark-x"
                        :icon-size="19"
                        tooltip="ブックマークから削除"
                        class="text-red-600 dark:text-red-400"
                        @click="toggleBookmark"
                    />

                    <AButton
                        v-if="user?.id !== setup?.author"
                        tooltip="報告"
                        icon="lucide:flag"
                        :icon-size="18"
                        @click="
                            if (user) {
                                modal_report = true;
                            } else {
                                modal_login = true;
                            }
                        "
                    />
                    <UModal
                        v-model="modal_report"
                        :ui="{
                            background: 'bg-white dark:bg-neutral-100',
                            ring: 'ring-0',
                            rounded: 'rounded-xl',
                        }"
                    >
                        <ModalReportSetup
                            :id="Number(setup?.id)"
                            @close="modal_report = false"
                        />
                    </UModal>
                </div>

                <div class="flex items-center gap-0.5">
                    <UPopover
                        :ui="{
                            rounded: 'rounded-xl',
                            ring: 'ring-1 ring-gray-300 dark:ring-gray-600',
                        }"
                        class="flex"
                    >
                        <AButton
                            icon="lucide:share-2"
                            :icon-size="18"
                            tooltip="シェア"
                        />

                        <template #panel="{ close }">
                            <div
                                class="flex flex-col gap-2 text-sm p-2 min-w-48"
                            >
                                <AButton
                                    icon="lucide:link"
                                    :icon-size="18"
                                    text="URLをコピー"
                                    @click="
                                        useWriteClipboard(currentUrl.value);
                                        close();
                                    "
                                />
                            </div>
                        </template>
                    </UPopover>
                </div>
            </div>
        </div>
        <div class="w-full flex flex-col md:flex-row items-start gap-8">
            <div
                v-show="loading"
                class="flex flex-col items-center gap-6 w-full"
            >
                <USkeleton
                    class="h-10 w-full"
                    :ui="{
                        background: 'bg-gray-100 dark:bg-gray-700',
                        rounded: 'rounded-xl',
                    }"
                />
                <USkeleton
                    v-for="i in 4"
                    :key="'skelton-' + i"
                    class="h-32 w-full"
                    :ui="{
                        background: 'bg-gray-100 dark:bg-gray-700',
                        rounded: 'rounded-xl',
                    }"
                />
            </div>

            <div
                v-show="!loading"
                class="flex flex-col items-center gap-8 w-full"
            >
                <NuxtImg
                    v-if="image"
                    :src="image"
                    :alt="setup?.name"
                    :placeholder="[50, 25]"
                    class="rounded-xl w-auto max-h-[700px]"
                />
                <ACategory
                    v-if="avatar"
                    title="ベースアバター"
                    icon="lucide:person-standing"
                >
                    <ItemBooth
                        v-if="avatar"
                        :key="'item-' + avatar.item.id"
                        size="lg"
                        :note="avatar.note"
                        :id="avatar.item.id"
                        :name="avatar.item.name"
                        :thumbnail="avatar.item.thumbnail"
                        :shop="avatar.item.shop"
                        :shop-id="avatar.item.shopId"
                        :shop-thumbnail="avatar.item.shopThumbnail"
                        :shop-verified="avatar.item.shopVerified"
                        :price="avatar.item.price"
                        :nsfw="avatar.item.nsfw"
                    />
                </ACategory>

                <ACategory
                    v-if="
                        items.filter((item) => item.item.category === 209)
                            .length
                    "
                    title="衣装"
                    icon="lucide:shirt"
                >
                    <ItemBooth
                        v-for="i in items.filter(
                            (item) => item.item.category === 209
                        )"
                        :key="'item-' + i.item.id"
                        :note="i.note"
                        :unsupported="i.unsupported"
                        :id="i.item.id"
                        :name="i.item.name"
                        :thumbnail="i.item.thumbnail"
                        :shop="i.item.shop"
                        :shop-id="i.item.shopId"
                        :shop-thumbnail="i.item.shopThumbnail"
                        :shop-verified="i.item.shopVerified"
                        :price="i.item.price"
                        :nsfw="i.item.nsfw"
                    />
                </ACategory>

                <ACategory
                    v-if="
                        items.filter((item) => item.item.category === 217)
                            .length
                    "
                    title="アクセサリー"
                    icon="lucide:star"
                >
                    <ItemBooth
                        v-for="i in items.filter(
                            (item) => item.item.category === 217
                        )"
                        :key="'item-' + i.item.id"
                        :note="i.note"
                        :unsupported="i.unsupported"
                        :id="i.item.id"
                        :name="i.item.name"
                        :thumbnail="i.item.thumbnail"
                        :shop="i.item.shop"
                        :shop-id="i.item.shopId"
                        :shop-thumbnail="i.item.shopThumbnail"
                        :shop-verified="i.item.shopVerified"
                        :price="i.item.price"
                        :nsfw="i.item.nsfw"
                    />
                </ACategory>

                <ACategory
                    v-if="
                        items.filter(
                            (item) =>
                                ![209, 217, 208].includes(item.item.category)
                        ).length
                    "
                    title="その他"
                    icon="lucide:shirt"
                >
                    <ItemBooth
                        v-for="i in items.filter(
                            (item) =>
                                ![209, 217, 208].includes(item.item.category)
                        )"
                        :key="'item-' + i.item.id"
                        :note="i.note"
                        :unsupported="i.unsupported"
                        :id="i.item.id"
                        :name="i.item.name"
                        :thumbnail="i.item.thumbnail"
                        :shop="i.item.shop"
                        :shop-id="i.item.shopId"
                        :shop-thumbnail="i.item.shopThumbnail"
                        :shop-verified="i.item.shopVerified"
                        :price="i.item.price"
                        :nsfw="i.item.nsfw"
                    />
                </ACategory>

                <ACategory
                    v-if="outdated"
                    title="不明なアイテム"
                    icon="lucide:file-question"
                >
                    <ItemBase v-for="i in outdated" :key="'outdated-' + i">
                        <template #main>
                            <div class="h-20 pl-6 gap-4 flex items-center">
                                <Icon
                                    name="lucide:file-question"
                                    size="20"
                                    class="text-neutral-400"
                                />
                                <span
                                    class="text-sm font-medium text-neutral-400"
                                >
                                    取得に失敗したアイテム
                                </span>
                            </div>
                        </template>
                    </ItemBase>
                </ACategory>

                <div class="w-full flex flex-col gap-2">
                    <ItemBase v-for="i in loading_items" :key="'loading-' + i">
                        <template #main>
                            <div class="h-20 pl-6 gap-4 flex items-center">
                                <Icon
                                    name="svg-spinners:ring-resize"
                                    size="24"
                                />
                                <span
                                    class="text-sm font-medium text-neutral-400"
                                >
                                    アイテムを読み込み中
                                </span>
                            </div>
                        </template>
                    </ItemBase>
                </div>
            </div>

            <div
                v-show="loading"
                class="w-full sm:w-96 flex flex-col items-center gap-6"
            >
                <USkeleton
                    v-for="i in 4"
                    :key="'skelton-' + i"
                    class="h-24 w-full"
                    :ui="{
                        background: 'bg-gray-100 dark:bg-gray-700',
                        rounded: 'rounded-xl',
                    }"
                />
            </div>

            <div
                v-show="!loading"
                v-if="setup"
                class="w-full sm:w-96 flex-col justify-start items-start gap-8 inline-flex"
            >
                <div
                    v-if="setup?.description"
                    class="self-stretch flex-col justify-start items-start gap-2 flex"
                >
                    <ATitle title="説明" icon="lucide:text" />
                    <div
                        class="self-stretch px-3 py-2 bg-neutral-50 dark:bg-neutral-750 border border-1 border-neutral-300 dark:border-neutral-600 rounded-lg items-center flex"
                    >
                        <span class="text-black dark:text-white text-sm">
                            {{ setup.description || "" }}
                        </span>
                    </div>
                </div>
                <div
                    v-if="setup?.tags && setup.tags.length > 0"
                    class="self-stretch flex-col justify-start items-start gap-2.5 flex w-full"
                >
                    <ATitle title="タグ" icon="lucide:tags" />
                    <div
                        class="justify-start items-center gap-1.5 flex flex-row flex-wrap"
                    >
                        <NuxtLink
                            v-for="i in setup.tags || []"
                            :key="'tag-' + i"
                            :to="{ name: 'search', query: { tag: i } }"
                        >
                            <ATag :text="i" />
                        </NuxtLink>
                    </div>
                </div>
                <div
                    v-if="setup?.author"
                    class="self-stretch flex-col justify-start items-start gap-2 flex"
                >
                    <ATitle title="ユーザー" icon="lucide:user-round" />
                    <AUser :user="setup.author" size="md" />
                </div>
                <ACategory
                    v-if="nsfw || unsupported || outdated"
                    title="コンテンツ"
                    icon="lucide:package"
                >
                    <UPopover
                        v-if="nsfw"
                        mode="hover"
                        :popper="{ placement: 'top' }"
                        :ui="{
                            rounded: 'rounded-xl',
                            ring: 'ring-1 ring-gray-300 dark:ring-gray-600',
                        }"
                        class="flex"
                    >
                        <ATag color="pink" text="NSFW" icon="lucide:heart" />

                        <template #panel>
                            <div
                                class="flex flex-col gap-2 text-sm p-4 rounded-lg"
                            >
                                <p>
                                    性的表現を含むアイテムがリストされています。
                                </p>
                            </div>
                        </template>
                    </UPopover>

                    <UPopover
                        v-if="unsupported"
                        mode="hover"
                        :popper="{ placement: 'top' }"
                        :ui="{
                            rounded: 'rounded-xl',
                            ring: 'ring-1 ring-gray-300 dark:ring-gray-600',
                        }"
                        class="flex"
                    >
                        <ATag
                            color="secondary"
                            text="アバター非対応アイテム"
                            icon="heroicons:paint-brush-20-solid"
                        />

                        <template #panel>
                            <div
                                class="flex flex-col gap-2 text-xs p-4 rounded-lg"
                            >
                                <p>
                                    ベースアバターに対して公式に対応が行われていないアイテムがリストされています。<br />
                                    UnityやDCCツール（Blenderなど）で独自の対応が行われている場合があります。
                                </p>
                            </div>
                        </template>
                    </UPopover>

                    <UPopover
                        v-if="outdated"
                        mode="hover"
                        :popper="{ placement: 'top' }"
                        :ui="{
                            rounded: 'rounded-xl',
                            ring: 'ring-1 ring-gray-300 dark:ring-gray-600',
                        }"
                        class="flex"
                    >
                        <ATag
                            color="secondary"
                            text="リンク切れアイテム"
                            icon="lucide:unlink"
                        />

                        <template #panel>
                            <div
                                class="flex flex-col gap-2 text-xs p-4 rounded-lg"
                            >
                                <p>
                                    一部のアイテムが情報の取得に失敗しています。<br />
                                    これらのアイテムは非公開になっているか、カテゴリが変更されたか、<br />
                                    既に販売が終了している可能性があります。
                                </p>
                            </div>
                        </template>
                    </UPopover>
                </ACategory>
            </div>
        </div>

        <UModal
            v-model="modal_login"
            :ui="{
                background: 'bg-white dark:bg-neutral-100',
                ring: 'ring-0',
                rounded: 'rounded-xl',
            }"
        >
            <ALogin
                :redirect="`/setup/${route.params.id}`"
                @success="
                    modal_login = false;
                    (async () => {
                        if (!setup) return;
                        bookmark = await useCheckBookmark(setup.id);
                    })();
                "
            />
        </UModal>
    </div>
</template>
