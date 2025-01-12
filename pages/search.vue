<script lang="ts" setup>
const route = useRoute();
const client = await useSBClient();
const query = ref(route.query);

const searched = ref(false);
const searchWord = ref<string>((route.query.q as string) ?? '');
const resultSetups = ref<Setup[]>([]);
const resultItem = ref<Item | null>(null);

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
    const { data } = await client.rpc('search_setups', {
        word: word,
        items: items,
        tags: tags,
    });
    // .range(0, 3);
    if (data) resultSetups.value = [...resultSetups.value, ...data];
    searched.value = true;
};

onMounted(async () => {
    const { data } = await client.rpc('popular_avatars').limit(24);
    if (data) popularAvatars.value = data;
});

// クエリパラメータの変更を監視
watch(
    () => route.query,
    async (newQuery) => {
        query.value = newQuery;
        resultSetups.value = [];
        resultItem.value = null;
        searched.value = false;

        const tag: string | string[] = newQuery.tag as string | string[];
        const item = newQuery.item as string;
        const word = newQuery.q ? (newQuery.q as string) : '';

        if (!tag && !item && !word) return (searchWord.value = '');

        if (item) resultItem.value = await useFetchBooth(parseInt(item));

        return search({
            word: word,
            items: item ? [parseInt(item)] : [],
            tags: tag ? (Array.isArray(tag) ? tag : [tag]) : [],
            page: 0,
        });
    },
    { immediate: true }
);
</script>

<template>
    <div class="w-full flex">
        <div v-if="false" class="hidden w-80 sm:flex flex-col gap-1 px-2">
            <UiTitle label="検索オプション" icon="lucide:menu" />
        </div>
        <div class="flex flex-col w-full gap-5">
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
                        class="w-32 p-4 gap-2 flex flex-col items-center rounded-lg border border-1 border-zinc-500 hover:bg-zinc-200 hover:dark:bg-zinc-600"
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

            <div v-if="searched">
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
                </div>

                <div v-else>
                    <p>セットアップが見つかりませんでした</p>
                </div>
            </div>
        </div>
    </div>
</template>
