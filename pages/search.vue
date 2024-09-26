<script lang="ts" setup>
const route = useRoute();
const router = useRouter();
const client = await useSBClient();
const user = useSupabaseUser();

const searchWord = ref<string>();
const searchItem = ref<number | null>(null);
const searchTag = ref<string[]>([]);

const resultSetups = ref<
    {
        id: number;
        name: string;
        description: string;
        avatar: number;
        author: string;
        created_at: string;
        image: string;
    }[]
>([]);

const item = ref<BoothItem | null>(null);

const SearchByWord = async () => {
    if (!searchWord.value) return;
    let query = client
        .rpc("s", { keywords: searchWord.value })
        .select("id, name, description, avatar, author, image");

    if (user.value) query = query.neq("author", user.value.id);

    const { data, error } = await query;

    if (error) console.error(error);

    resultSetups.value = data;
};

const SearchByItem = async () => {
    item.value = await useFetchBooth({
        id: searchItem.value,
        url: null,
    });

    const { data, error } = await client.rpc("search_setup_by_item", {
        query_id: searchItem.value,
    });

    if (error) console.error(error);

    resultSetups.value = data;
};

const SearchByTag = async () => {
    const { data, error } = await client.rpc("search_setups_by_tags", {
        query_tags: searchTag.value,
    });

    if (error) console.error(error);

    resultSetups.value = data;
};

onMounted(async () => { });

// クエリパラメータの変更を監視
watch(
    () => route.query,
    async (newQuery) => {
        item.value = null;
        searchWord.value = newQuery.q as string;
        searchItem.value = Number(newQuery.item) || null;
        if (newQuery.tag === undefined) {
            searchTag.value = [];
        } else if (Array.isArray(newQuery.tag)) {
            searchTag.value = newQuery.tag as string[];
        } else {
            searchTag.value = [newQuery.tag as string];
        }

        if (searchTag.value.length) {
            SearchByTag();
        } else if (searchItem.value) {
            SearchByItem();
        } else if (searchWord.value) {
            SearchByWord();
        } else {
            searchWord.value = "";
        }
    },
    { immediate: true }
);
</script>

<template>
    <div class="w-full flex">
        <aside v-if="false" class="hidden w-80 sm:flex flex-col gap-1 px-2">
            <UiTitle title="検索オプション" icon="lucide:menu" />
        </aside>
        <div class="flex flex-col w-full gap-5">
            <div class="w-full flex flex-col gap-3">
                <UiTitle title="セットアップ検索" icon="lucide:search" size="lg" />
                <UInput v-model="searchWord" autofocus icon="i-heroicons-magnifying-glass-20-solid" size="lg"
                    :trailing="false" placeholder="キーワード検索" :ui="{ rounded: 'rounded-xl' }" class="mt-1"
                    @keyup.enter="router.push('/search?q=' + searchWord)" />
            </div>

            <ItemBooth v-if="item" size="lg" :id="item.id" :name="item.name" :thumbnail="item.thumbnail"
                :shop="item.shop" :shop-id="item.shopId" :shop-thumbnail="item.shopThumbnail"
                :shop-verified="item.shopVerified" :price="item.price" :nsfw="item.nsfw" />

            <UDivider :ui="{
                border: {
                    base: 'border-neutral-300 dark:border-neutral-600 mx-3 my-2',
                },
            }" />

            <div class="flex flex-col lg:grid lg:grid-cols-2 gap-5">
                <NuxtLink v-for="i in resultSetups" :to="{ name: 'setup-id', params: { id: i.id } }"
                    :class="[{ 'row-span-3': i.image }]">
                    <ItemSetup :name="i.name" :avatar="i.avatar" :author="i.author" :created-at="i.created_at"
                        :image="i.image" class="hover:bg-neutral-200 dark:hover:bg-neutral-700" />
                </NuxtLink>
            </div>
        </div>
    </div>
</template>
