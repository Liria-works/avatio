<script lang="ts" setup>
const route = useRoute();
const client = await useSBClient();
const query = ref(route.query);

const searchWord = ref<string>((route.query.q as string) ?? '');
const resultSetups = ref<Setup[]>([]);
const resultItem = ref<Item | null>(null);

const popularAvatars = ref<{ id: number; name: string; thumbnail: string }[]>(
    []
);

onMounted(async () => {
    const { data } = await client.rpc('popular_avatars').limit(20);
    if (data) popularAvatars.value = data;
});

// クエリパラメータの変更を監視
watch(
    () => route.query,
    async (newQuery) => {
        query.value = newQuery;
        resultSetups.value = [];
        resultItem.value = null;

        const tag: string | string[] = newQuery.tag as string | string[];
        const item = newQuery.item as string;
        const word = newQuery.q as string;

        if (!tag && !item && !word) return (searchWord.value = '');

        let search = client
            .from('setups')
            .select(
                'id, created_at, name, description, image, avatar(id, name, thumbnail), author(id, name, avatar), setup_items!inner(item_id), setup_tags!inner(tag)'
            );

        if (tag && tag.length) {
            search = search.in(
                'setup_tags.tag',
                Array.isArray(tag) ? tag : [tag]
            );
        } else if (item) {
            resultItem.value = await useFetchBooth(parseInt(item));
            search = search.in('setup_items.item_id', [item]); // todo:avatarとitemの両方でクエリするように
        } else if (word) {
            search = search.ilike('name', `%${word}%`);
        }

        const { data } = await search.order('created_at', { ascending: false });
        resultSetups.value = data as unknown as Setup[];
        console.log(data);
    },
    { immediate: true }
);
</script>

<template>
    <div class="w-full flex">
        <aside v-if="false" class="hidden w-80 sm:flex flex-col gap-1 px-2">
            <UiTitle label="検索オプション" icon="lucide:menu" />
        </aside>
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
                    icon="i-heroicons-magnifying-glass-20-solid"
                    size="xl"
                    :trailing="false"
                    placeholder="キーワード検索"
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
                :shop="resultItem.shop_id.name"
                :shop-id="resultItem.shop_id.id"
                :shop-thumbnail="resultItem.shop_id.thumbnail"
                :shop-verified="resultItem.shop_id.verified"
                :price="resultItem.price"
                :nsfw="resultItem.nsfw"
                :outdated="false"
                :updated-at="resultItem.updated_at"
            />

            <UDivider
                :ui="{
                    border: {
                        base: 'border-neutral-300 dark:border-neutral-600 mx-3 my-5',
                    },
                }"
            />

            <div
                v-if="!Object.keys(query).length && popularAvatars.length"
                class="flex flex-wrap gap-5 items-center justify-center"
            >
                <NuxtLink
                    v-for="i in popularAvatars"
                    :key="useId"
                    :to="`/search?item=${i.id}`"
                    :class="[
                        'w-32 p-4 gap-2 flex flex-col items-center rounded-lg',
                        'border border-1 border-neutral-500 hover:bg-neutral-600',
                    ]"
                >
                    <NuxtImg
                        :src="i.thumbnail"
                        sizes="128px"
                        loading="lazy"
                        class="rounded-lg"
                    />
                    <p class="text-sm line-clamp-1 break-all">
                        {{ useAvatarName(i.name) }}
                    </p>
                </NuxtLink>
            </div>

            <div class="flex flex-col lg:grid lg:grid-cols-1 gap-5">
                <NuxtLink
                    v-for="i in resultSetups"
                    :to="{ name: 'setup-id', params: { id: i.id } }"
                >
                    <ItemSetupDetail
                        :id="i.id"
                        :name="i.name"
                        :description="i.description"
                        :avatar-name="i.avatar.name"
                        :avatar-thumbnail="i.avatar.thumbnail"
                        :author-id="i.author.id"
                        :author-name="i.author.name"
                        :author-avatar="i.author.avatar"
                        :created-at="i.created_at"
                        :image="i.image"
                    />
                </NuxtLink>
            </div>
        </div>
    </div>
</template>
