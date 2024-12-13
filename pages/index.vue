<script setup lang="ts">
const user = useSupabaseUser();
const client = await useSBClient();

const setups = ref<SetupSimple[]>([]);
const page = ref(0);
const loading = ref(false);

const get = async (num: number) => {
    const setupsPerPage: number = 10;

    loading.value = true;

    let query = client
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
    if (user.value) query = query.neq('author', user.value.id);
    query = query
        .range(num * setupsPerPage, num * setupsPerPage + (setupsPerPage - 1))
        .order('created_at', { ascending: false });

    const { data } = await query.returns<SetupSimple[]>();

    loading.value = false;

    if (data) return data;
    return [];
};

const paginate = async () => {
    const temp = [...setups.value, ...(await get(page.value))];
    setups.value = temp.map((setup) => {
        return {
            ...setup,
            avatars: setup.items.filter((i) => i.data).map((i) => i.data),
        };
    });
    page.value++;
};

onMounted(async () => {
    paginate();

    useOGP({
        url: 'https://avatio.me',
        type: 'website',
        title: 'Avatio',
        titleTemplate: '%s',
        description: 'アバターセットアップ共有サービス',
        twitterCard: 'summary_large_image',
    });
});
</script>

<template>
    <div class="w-full flex flex-col gap-10">
        <BannerHome v-if="!user" />

        <LayoutMySetups v-if="user" />

        <div v-if="setups" class="flex flex-col items-start gap-4 w-full">
            <div class="w-full flex gap-4 items-start justify-between">
                <UiTitle
                    label="ディスカバリー"
                    icon="lucide:sparkles"
                    size="lg"
                />
                <!-- <UiButton
                icon="lucide:rotate-ccw"
                class="outline-0 p-2 hover:bg-neutral-300 hover:dark:bg-neutral-700"
                @click="get"
            /> -->
            </div>
            <MasonryWall
                :items="setups"
                :column-width="200"
                :gap="20"
                :min-columns="1"
                :max-columns="3"
                :ssr-columns="3"
            >
                <template #default="{ item }">
                    <ItemSetup
                        :id="item.id"
                        :name="item.name"
                        :avatar-name="item.avatars[0].name"
                        :avatar-thumbnail="item.avatars[0].thumbnail"
                        :avatar-outdated="item.avatars[0].outdated"
                        :author-id="item.author.id"
                        :author-name="item.author.name"
                        :author-avatar="item.author.avatar"
                        :created-at="item.created_at"
                        :image="item.image"
                        :image-size="{ width: 16, height: 9 }"
                    />
                </template>
            </MasonryWall>

            <div class="w-full flex flex-col items-center">
                <UiButton
                    :disabled="loading"
                    label="さらに読み込む"
                    :icon="loading ? 'svg-spinners:ring-resize' : ''"
                    class="h-10"
                    @click="paginate()"
                />
            </div>
        </div>

        <div
            v-if="!setups"
            class="w-full my-5 font-medium text-center text-neutral-700 dark:text-neutral-300"
        >
            <p>セットアップが見つかりませんでした😢</p>
        </div>
    </div>
</template>
