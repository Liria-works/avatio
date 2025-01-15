<script setup lang="ts">
const user = useSupabaseUser();
const client = await useSBClient();

const setups = ref<SetupSimple[]>([]);
const setupsPerPage: number = 20;
const page = ref(0);
const filter = ref<'all' | 'mine' | 'bookmark'>('all');
const loading = ref(true);

const get = async (num: number): Promise<SetupSimple[]> => {
    loading.value = true;

    try {
        let query;

        if (filter.value === 'bookmark')
            query = client
                .from('bookmarks')
                .select(
                    `
                    post(
                        id,
                        created_at,
                        name,
                        author(id, name, avatar),
                        image,
                        items:setup_items(
                            data:item_id(
                                id, outdated, category, name, thumbnail, nsfw
                            )
                        )
                    )
                    `
                )
                .eq('post.setup_items.item_id.category', '208');
        else {
            query = client
                .from('setups')
                .select(
                    `
                    id,
                    created_at,
                    name,
                    author(id, name, avatar),
                    image,
                    items:setup_items(
                        data:item_id(
                            id, outdated, category, name, thumbnail, nsfw
                        )
                    )
                    `
                )
                .eq('setup_items.item_id.category', '208');

            if (filter.value === 'mine')
                query = query.eq('author', user.value.id);
        }

        const { data } = await query
            .range(
                num * setupsPerPage,
                num * setupsPerPage + (setupsPerPage - 1)
            )
            .order('created_at', { ascending: false });

        if (filter.value === 'bookmark')
            return (data as unknown as { post: SetupSimple }[]).map(
                (d) => d.post
            );

        return (data as unknown as SetupSimple[]) ?? [];
    } catch {
        return [];
    } finally {
        loading.value = false;
    }
};

const paginate = async () => {
    const newData = await get(page.value);
    setups.value = [
        ...setups.value,
        ...newData.map((setup) => ({
            ...setup,
            avatars: setup.items.filter((i) => i.data).map((i) => i.data),
        })),
    ];
    page.value++;
};

onMounted(async () => {
    await paginate();

    useOGP({
        url: 'https://avatio.me',
        type: 'website',
        title: 'Avatio',
        titleTemplate: '%s',
        description: 'アバターセットアップ共有サービス',
        twitterCard: 'summary_large_image',
    });
});

watch(filter, async () => {
    page.value = 0;
    setups.value = [];
    await paginate();
});
</script>

<template>
    <div class="w-full flex flex-col gap-6">
        <ClientOnly>
            <div class="empty:hidden -mt-4 flex flex-col gap-2">
                <BannerWelcome />
                <BannerOwnerWarning />
            </div>
        </ClientOnly>

        <div v-if="setups" class="flex flex-col items-start gap-5 w-full">
            <UiTitle label="ホーム" size="lg" />
            <div class="flex flex-wrap items-center gap-1">
                <ButtonBase
                    label="すべて"
                    variant="flat"
                    :class="[
                        'text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-700',
                        filter === 'all' ? 'bg-zinc-200 dark:bg-zinc-700' : '',
                    ]"
                    @click="filter = 'all'"
                />
                <ButtonBase
                    label="自分の投稿"
                    variant="flat"
                    :class="[
                        'text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-700',
                        filter === 'mine' ? 'bg-zinc-200 dark:bg-zinc-700' : '',
                    ]"
                    @click="filter = 'mine'"
                />
                <ButtonBase
                    label="ブックマーク"
                    variant="flat"
                    :class="[
                        'text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-700',
                        filter === 'bookmark'
                            ? 'bg-zinc-200 dark:bg-zinc-700'
                            : '',
                    ]"
                    @click="filter = 'bookmark'"
                />
            </div>
            <MasonryWall
                :items="setups"
                :column-width="200"
                :gap="20"
                :min-columns="1"
                :max-columns="4"
                :ssr-columns="4"
                class="p-1"
            >
                <template #default="{ item }">
                    <ItemSetup
                        :aria-label="item.name"
                        :id="item.id"
                        :name="item.name"
                        :avatar="{
                            name: item.avatars[0].name,
                            thumbnail: item.avatars[0].thumbnail,
                            outdated: item.avatars[0].outdated,
                        }"
                        :author="item.author"
                        :created-at="item.created_at"
                        :image="item.image"
                        :image-size="{ width: 16, height: 9 }"
                    />
                </template>
            </MasonryWall>

            <div class="w-full flex flex-col items-center">
                <ButtonBase
                    v-if="setups.length"
                    :disabled="loading"
                    label="さらに読み込む"
                    :icon="loading ? 'svg-spinners:ring-resize' : ''"
                    class="h-10"
                    @click="paginate"
                />
            </div>
        </div>

        <div
            v-if="!loading && !setups.length"
            class="w-full my-5 font-medium text-center text-zinc-700 dark:text-zinc-300"
        >
            <p>セットアップが見つかりませんでした😢</p>
        </div>
    </div>
</template>
