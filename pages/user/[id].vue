<script lang="ts" setup>
const route = useRoute();
const client = await useSBClient();
const user = useSupabaseUser();

const setups = ref<Setup[]>([]);
const page = ref(0);
const perPage = 20;
const loading = ref(false);
const modalReport = ref(false);

const getSetups = async () => {
    const { data } = await client
        .from('setups')
        .select(
            `
            id,
            created_at,
            author(id, name, avatar),
            name,
            description,
            image,
            items:setup_items(
                data:item_id(
                    id, updated_at, outdated, category, name, thumbnail, price, shop:shop_id(id, name, thumbnail, verified), nsfw
                ),
                note,
                unsupported
            )
            `
        )
        .eq('author', route.params.id.toString())
        .order('created_at', { ascending: false })
        .range(page.value * perPage, page.value * perPage + (perPage - 1))
        .returns<Setup[]>();
    return data ?? [];
};

const pagenate = async (options?: { initiate?: boolean }) => {
    if (options?.initiate) {
        page.value = 0;
        setups.value = [];
    } else page.value++;

    loading.value = true;
    setups.value = [...setups.value, ...(await getSetups())];
    loading.value = false;
};

const { data: userData } = await client
    .from('users')
    .select(
        `
        name,
        avatar,
        bio,
        links,
        created_at,
        badges(developer, contributor, translator, alpha_tester, shop_owner)
        `
    )
    .eq('id', route.params.id.toString())
    .maybeSingle<User>();

if (userData) await pagenate({ initiate: true });

onMounted(async () => {
    if (userData)
        useOGP({
            title: userData.name,
            description: userData.bio,
            image: userData.avatar ? useGetImage(userData.avatar) : null,
        });
});
</script>

<template>
    <div v-if="!userData" class="w-full flex flex-col items-center">
        <p class="text-zinc-400 mt-5">ユーザーデータの取得に失敗しました</p>
    </div>

    <div v-else class="w-full flex flex-col px-2 gap-10">
        <div class="w-full flex flex-col gap-3">
            <div class="w-full flex items-center justify-between">
                <div class="flex gap-6 items-center">
                    <UiAvatar
                        :url="
                            userData.avatar
                                ? useGetImage(userData.avatar, {
                                      prefix: 'avatar',
                                  })
                                : ''
                        "
                        :alt="userData.name"
                        :icon-size="36"
                        class="size-20"
                    />
                    <div class="flex flex-col gap-1">
                        <div class="flex gap-3 items-center">
                            <p class="text-2xl font-bold">
                                {{ userData.name }}
                            </p>
                            <BadgeUser
                                v-if="userData.badges"
                                :developer="userData.badges.developer"
                                :contributor="userData.badges.contributor"
                                :translator="userData.badges.translator"
                                :alpha-tester="userData.badges.alpha_tester"
                                :shop-owner="userData.badges.shop_owner"
                            />
                        </div>
                        <p class="text-sm text-zinc-500">
                            アカウント作成日 :
                            {{
                                new Date(userData.created_at).toLocaleString(
                                    'ja-JP',
                                    {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                    }
                                )
                            }}
                        </p>
                    </div>
                </div>
                <ButtonBase
                    v-if="user && user.id === route.params.id.toString()"
                    to="/user/setting"
                    icon="lucide:pen-line"
                    :icon-size="19"
                    tooltip="プロフィールを編集"
                    aria-label="プロフィールを編集"
                    variant="flat"
                />
                <ButtonBase
                    v-else
                    icon="lucide:flag"
                    :icon-size="19"
                    tooltip="ユーザーを報告"
                    aria-label="ユーザーを報告"
                    variant="flat"
                    @click="modalReport = true"
                />

                <ModalReportUser
                    v-model="modalReport"
                    :id="route.params.id.toString()"
                />
            </div>

            <div class="w-full flex flex-col gap-3 pl-2">
                <div
                    v-if="userData.links"
                    class="flex flex-wrap items-center gap-2"
                >
                    <ButtonBase
                        v-for="i in userData.links"
                        :key="useId()"
                        :to="i"
                        :tooltip="i"
                        :aria-label="i"
                        variant="flat"
                        class="min-h-[38px] p-2 rounded-lg flex items-center justify-center hover:bg-zinc-300 hover:dark:bg-zinc-700"
                    >
                        <Icon
                            :name="getLinkIcon(i)"
                            size="20"
                            class="bg-zinc-700 dark:bg-zinc-200"
                        />
                    </ButtonBase>
                </div>

                <div
                    class="w-full rounded-xl px-4 py-3 gap-1 flex flex-col border border-zinc-400 dark:border-zinc-600"
                >
                    <span class="text-zinc-500 text-sm mt-[-2px]">bio</span>
                    <p v-if="!userData.bio" class="text-zinc-400">
                        自己紹介が未設定
                    </p>
                    <p
                        v-if="userData.bio"
                        class="text-sm text-relaxed break-keep whitespace-break-spaces [overflow-wrap:anywhere]"
                    >
                        {{ useSentence(userData.bio) }}
                    </p>
                </div>
            </div>
        </div>

        <div v-if="setups.length" class="w-full flex flex-col gap-5 pl-2">
            <UiTitle label="セットアップ" icon="lucide:shirt" size="lg" />

            <div class="flex flex-col gap-3">
                <ItemSetupDetail
                    v-for="i in setups"
                    :key="useId()"
                    :setup="i"
                />
                <ButtonLoadMore
                    :loading="loading"
                    class="w-full"
                    @click="pagenate"
                />
            </div>
        </div>
    </div>
</template>
