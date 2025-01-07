<script lang="ts" setup>
const route = useRoute();
const client = await useSBClient();
const user = useSupabaseUser();

const modalReport = ref(false);
const loading = ref(true);

const userId = ref<string>(route.params.id.toString());
const userData = ref<User | null>(null);

const linkIcons: { [key: string]: string } = {
    'x.com': 'simple-icons:x',
    'youtube.com': 'simple-icons:youtube',
    'twitch.tv': 'simple-icons:twitch',
    'discordapp.com': 'simple-icons:discord',
    'discord.com': 'simple-icons:discord',
    'instagram.com': 'simple-icons:instagram',
    'github.com': 'simple-icons:github',
    'steamcommunity.com': 'simple-icons:steam',
    'pixiv.net': 'simple-icons:pixiv',
    'artstation.com': 'simple-icons:artstation',
    'booth.pm': 'avatio:booth',
};

const getIcon = (url: string) => {
    try {
        const hostname = new URL(url).hostname.replace('www.', '');
        if (Object.keys(linkIcons).includes(hostname))
            return linkIcons[hostname];
        else return 'lucide:link';
    } catch {
        return '';
    }
};

onMounted(async () => {
    const { data } = await client
        .from('users')
        .select(
            `
            name,
            avatar,
            bio,
            links,
            created_at,
            setups(
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
            ),
            badges(developer, contributor, translator, alpha_tester, shop_owner)
            `
        )
        .eq('id', userId.value)
        .order('created_at', { referencedTable: 'setups', ascending: false })
        .maybeSingle();

    if (!data) return (loading.value = false);

    userData.value = data as unknown as User;

    useOGP({
        title: userData.value.name,
        description: userData.value.bio,
        image: userData.value.avatar
            ? useGetImage(userData.value.avatar)
            : null,
    });

    loading.value = false;
});
</script>

<template>
    <div v-if="userData && !loading" class="w-full flex flex-col px-2 gap-10">
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
                <UiButton
                    v-if="user && user.id === userId"
                    to="/user/setting"
                    icon="lucide:pen-line"
                    :icon-size="19"
                    tooltip="プロフィールを編集"
                />
                <UiButton
                    v-else
                    icon="lucide:flag"
                    :icon-size="19"
                    tooltip="ユーザーを報告"
                    @click="modalReport = true"
                />

                <ModalReportUser v-model="modalReport" :id="userId" />
            </div>

            <div class="w-full flex flex-col gap-3 pl-2">
                <div
                    v-if="userData.links"
                    class="flex flex-wrap items-center gap-2"
                >
                    <UiButton
                        v-for="i in userData.links"
                        :to="i"
                        :tooltip="i"
                        class="min-h-[38px] p-2 rounded-lg flex items-center justify-center hover:bg-zinc-300 hover:dark:bg-zinc-700"
                    >
                        <Icon
                            :name="getIcon(i)"
                            size="20"
                            class="bg-zinc-700 dark:bg-zinc-200"
                        />
                    </UiButton>
                </div>

                <div
                    class="w-full rounded-xl px-4 py-3 gap-1 flex flex-col border border-1 border-zinc-400 dark:border-zinc-600"
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

        <div
            v-if="userData.setups.length"
            class="w-full flex flex-col gap-5 pl-2"
        >
            <UiTitle label="セットアップ" icon="lucide:shirt" size="lg" />

            <div class="flex flex-col gap-3">
                <ItemSetupDetail
                    v-for="i in userData.setups"
                    :key="useId()"
                    :id="Number(i.id)"
                    :created-at="i.created_at"
                    :name="i.name"
                    :description="i.description"
                    :image="i.image"
                    :author="i.author"
                    :items="i.items.map((i) => i.data)"
                />
            </div>
        </div>
    </div>

    <div
        v-else-if="loading"
        class="w-full flex items-center justify-center pt-20"
    >
        <Icon name="svg-spinners:ring-resize" size="32" />
    </div>

    <div v-else-if="!userData" class="w-full flex flex-col items-center">
        <p class="text-zinc-400 mt-5">ユーザーデータの取得に失敗しました</p>
    </div>
</template>
