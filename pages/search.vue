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

        const tag: string | string[] = newQuery.tag as string | string[];
        const item = newQuery.item as string;
        const word = newQuery.q as string;

        if (!tag && !item && !word) return (searchWord.value = '');

        if (tag && tag.length) {
            const { data } = await client
                .from('setups')
                .select(
                    'id, created_at, name, description, image, avatar(id, name, thumbnail), author(id, name, avatar), items:setup_items!inner(item_id), tags:setup_tags!inner(tag)'
                )
                .in('setup_tags.tag', Array.isArray(tag) ? tag : [tag])
                .order('created_at', { ascending: false })
                .returns<Setup[]>();

            return (resultSetups.value = data ? data : []);
        }

        if (item) {
            resultItem.value = await useFetchBooth(parseInt(item));

            const { data } = await client.rpc('search_setups_item', {
                query: [parseInt(item)],
            });

            return (resultSetups.value = data.map((i) => {
                return {
                    id: i.id,
                    created_at: i.created_at,
                    name: i.name,
                    description: i.description,
                    image: i.image,
                    tags: i.tag,
                    author: {
                        id: i.author_id,
                        name: i.author_name,
                        avatar: i.author_avatar,
                    },
                    avatar: {
                        id: i.avatar_id,
                        name: i.avatar_name,
                        thumbnail: i.avatar_thumbnail,
                    },
                    avatar_note: i.avatar_note,
                    items: i.item_id,
                };
            }));
        }

        if (word) {
            // search = search.ilike('name', `%${word}%`);
        }
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
                :shop="resultItem.shop.name"
                :shop-id="resultItem.shop.id"
                :shop-thumbnail="resultItem.shop.thumbnail"
                :shop-verified="resultItem.shop.verified"
                :price="resultItem.price"
                :nsfw="resultItem.nsfw"
                :outdated="false"
                :updated-at="resultItem.updated_at"
            />

            <UiDivider class="mx-3 my-5" />

            <div class="flex flex-col gap-6">
                <UiTitle
                    label="人気のアバターから検索"
                    icon="lucide:user-round"
                    size="lg"
                />
                <div
                    v-if="!Object.keys(query).length && popularAvatars.length"
                    class="flex flex-wrap gap-5 items-center justify-center"
                >
                    <NuxtLink
                        v-for="i in popularAvatars"
                        :key="useId()"
                        :to="`/search?item=${i.id}`"
                        class="w-32 p-4 gap-2 flex flex-col items-center rounded-lg border border-1 border-neutral-500 hover:bg-neutral-600"
                    >
                        <NuxtImg
                            :src="i.thumbnail"
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
                        :avatar-outdated="i.avatar.outdated"
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
