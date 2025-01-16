<script lang="ts" setup>
interface Query {
    q?: string;
    item?: string;
    tag?: string | string[];
}
const route = useRoute();
const client = await useSBClient();
const query = ref<Query>(route.query);

const loading = ref(false);
const searchWord = ref<string>((route.query.q as string) ?? '');
const resultSetups = ref<Setup[]>([]);
const resultItem = ref<Item | null>(null);
const page = ref<number>(0);
const perPage = 20;

const popularAvatars = ref<{ id: number; name: string; thumbnail: string }[]>(
    []
);

const search = async ({
    word,
    items,
    tags,
    page,
}: {
    word: string;
    items: number[];
    tags: string[];
    page: number;
}) => {
    loading.value = true;

    const { data } = await client.rpc('search_setups', {
        word: word,
        items: items,
        tags: tags,
        page: page,
        per_page: perPage,
    });

    if (data) resultSetups.value = [...resultSetups.value, ...data];
    loading.value = false;
};

const pagenate = async (options?: { initiate?: boolean }) => {
    if (options?.initiate) page.value = 0;
    else page.value++;

    await search({
        word: searchWord.value,
        items: query.value.item ? [parseInt(query.value.item)] : [],
        tags: query.value.tag
            ? Array.isArray(query.value.tag)
                ? query.value.tag
                : [query.value.tag]
            : [],
        page: page.value,
    });
};

onMounted(async () => {
    const { data } = await client.rpc('popular_avatars').limit(24);
    if (data) popularAvatars.value = data;
});

// クエリパラメータの変更を監視
watch(
    () => route.query,
    async (newQuery: Query) => {
        query.value = newQuery;
        searchWord.value = newQuery.q ?? '';
        resultItem.value = null;
        resultSetups.value = [];

        if (newQuery.item)
            resultItem.value = await useFetchBooth(parseInt(newQuery.item));

        return pagenate({ initiate: true });
    },
    { immediate: true }
);
</script>

<template>
    <!-- <div class="w-full flex">
        <div v-if="false" class="hidden w-80 sm:flex flex-col gap-1 px-2">
            <UiTitle label="検索オプション" icon="lucide:menu" />
        </div>
    </div> -->
    <div class="w-full flex flex-col items-stretch gap-5">
        <div class="w-full flex flex-col gap-3 pt-4">
            <!-- <UiTitle
                    label="セットアップ検索"
                    icon="lucide:search"
                    size="lg"
                /> -->
            <UInput
                v-model="searchWord"
                autofocus
                icon="lucide:search"
                size="xl"
                :trailing="false"
                placeholder="キーワード検索"
                aria-label="キーワード検索"
                :ui="{ rounded: 'rounded-xl' }"
                class="mt-1"
                @keyup.enter="navigateTo('/search?q=' + searchWord)"
            />
        </div>

        <ItemBooth
            v-if="resultItem"
            :size="'lg'"
            no-action
            :id="resultItem.id"
            :name="resultItem.name"
            :thumbnail="resultItem.thumbnail"
            :shop="resultItem.shop"
            :price="resultItem.price"
            :nsfw="resultItem.nsfw"
            :outdated="false"
            :updated-at="resultItem.updated_at"
        />

        <UiDivider class="mx-3 my-5" />

        <div
            v-if="!Object.keys(query).length && popularAvatars.length"
            class="flex flex-col gap-6"
        >
            <UiTitle
                label="人気のアバターから検索"
                icon="lucide:user-round"
                size="lg"
            />
            <div class="flex flex-wrap gap-5 items-center justify-center">
                <NuxtLink
                    v-for="i in popularAvatars"
                    :key="useId()"
                    :to="`/search?item=${i.id}`"
                    :aria-label="i.name"
                    class="w-32 p-4 gap-2 flex flex-col items-center rounded-lg border border-zinc-500 hover:bg-zinc-200 hover:dark:bg-zinc-600"
                >
                    <NuxtImg
                        :src="i.thumbnail"
                        :alt="i.name"
                        sizes="128px"
                        loading="lazy"
                        class="rounded-lg flex-shrink-0"
                    />
                    <p class="text-sm line-clamp-1 break-all">
                        {{ useAvatarName(i.name) }}
                    </p>
                </NuxtLink>
            </div>
        </div>

        <template v-if="Object.keys(query).length">
            <div
                v-if="resultSetups.length"
                class="flex flex-col lg:grid lg:grid-cols-1 gap-5"
            >
                <ItemSetupDetail
                    v-for="i in resultSetups"
                    :aria-label="i.name"
                    :id="i.id"
                    :created-at="i.created_at"
                    :name="i.name"
                    :description="i.description"
                    :image="i.image"
                    :author="i.author"
                    :items="i.items.map((i) => i.data)"
                />
                <ButtonLoadMore
                    :loading="loading"
                    class="w-full"
                    @click="pagenate()"
                />
            </div>

            <p v-else class="text-center text-zinc-700 dark:text-zinc-300">
                セットアップが見つかりませんでした
            </p>
        </template>
    </div>
</template>
