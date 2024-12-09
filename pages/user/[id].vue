<script lang="ts" setup>
const route = useRoute();
const client = await useSBClient();
const user = useSupabaseUser();

const modalReport = ref(false);
const loading = ref(true);

const userId = ref<string>(route.params.id.toString());
const userData = ref<User | null>(null);

const linksShort = ref<{ [key: string]: string }[]>([]);

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
            setups(id, name, description, avatar(id, name, thumbnail, outdated), author(id, name, avatar), image, created_at),
            badges(developer, contributor, translator, alpha_tester, shop_owner)
            `
        )
        .eq('id', userId.value)
        .order('created_at', { referencedTable: 'setups', ascending: false })
        .maybeSingle();

    if (!data) return (loading.value = false);

    userData.value = data as unknown as User;

    linksShort.value = userData.value.links.map((i) => {
        const replace = (input: string) =>
            input.replace('https://www.', '').replace('https://', '');

        for (const key in linkIcons)
            if (new URL(i).hostname.includes(key))
                return { [replace(i)]: linkIcons[key] };

        return { [replace(i)]: '' };
    });

    loading.value = false;
});
</script>

<template>
    <div v-if="userData && !loading" class="w-full flex flex-col px-2 gap-10">
        <div class="w-full flex flex-col gap-3">
            <div class="w-full flex items-center justify-between">
                <div class="flex gap-6 items-center">
                    <UAvatar
                        v-if="userData.avatar"
                        :src="useGetImage(userData.avatar)"
                        alt="Avatar"
                        size="3xl"
                    />
                    <div
                        v-else
                        class="flex items-center justify-center size-20 rounded-full flex-shrink-0 bg-neutral-200 dark:bg-neutral-500"
                    >
                        <Icon
                            name="lucide:user-round"
                            size="36"
                            class="text-neutral-600 dark:text-neutral-300"
                        />
                    </div>
                    <div class="flex flex-col gap-1">
                        <div class="flex gap-3 items-center">
                            <p class="text-2xl font-bold">
                                {{ userData.name }}
                            </p>
                            <UserBadge
                                v-if="userData.badges"
                                :developer="userData.badges.developer"
                                :contributor="userData.badges.contributor"
                                :translator="userData.badges.translator"
                                :alpha-tester="userData.badges.alpha_tester"
                                :shop-owner="userData.badges.shop_owner"
                            />
                        </div>
                        <p class="text-sm text-neutral-500">
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
                        v-for="(i, index) in userData.links"
                        :to="i"
                        :tooltip="
                            Object.values(linksShort[index])[0].length
                                ? Object.keys(linksShort[index])[0]
                                : ''
                        "
                        class="min-h-[38px] p-2 rounded-lg flex items-center justify-center text-neutral-600 dark:text-neutral-300 border border-1 border-neutral-400 dark:border-neutral-600 hover:bg-neutral-300 hover:dark:bg-neutral-700"
                    >
                        <Icon
                            v-if="Object.values(linksShort[index])[0].length"
                            :name="Object.values(linksShort[index])[0]"
                            size="20"
                            class="bg-neutral-600 dark:bg-neutral-300"
                        />

                        <p v-else class="px-1 text-sm font-medium leading-none">
                            {{ Object.keys(linksShort[index])[0] }}
                        </p>
                    </UiButton>
                </div>

                <div
                    class="w-full rounded-xl px-4 py-3 gap-1 flex flex-col border border-1 border-neutral-400 dark:border-neutral-600"
                >
                    <p class="text-neutral-500 text-sm mt-[-2px]">bio</p>
                    <p v-if="!userData.bio" class="text-neutral-400">
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
                <NuxtLink
                    v-for="i in userData.setups"
                    :key="'user-setup-' + i.id"
                    :to="{ name: 'setup-id', params: { id: i.id } }"
                >
                    <ItemSetupDetail
                        :id="Number(i.id)"
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

    <div
        v-else-if="loading"
        class="w-full flex items-center justify-center pt-20"
    >
        <Icon name="svg-spinners:ring-resize" size="32" />
    </div>

    <div v-else-if="!userData" class="w-full flex flex-col items-center">
        <p class="text-neutral-400 mt-5">ユーザーデータの取得に失敗しました</p>
    </div>
</template>
