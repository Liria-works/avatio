<script lang="ts" setup>
const route = useRoute();
const client = await useSBClient();
const user = useSupabaseUser();

const modal_report = ref(false);
const loading = ref(true);

interface User {
    name: string;
    avatar: string;
    bio: string;
    links: string[];
    created_at: string;
    setups: {
        id: string;
        name: string;
        description: string;
        avatar: {
            id: string;
            name: string;
            thumbnail: string;
        };
        author: {
            id: string;
            name: string;
            avatar: string;
        };
        image: string;
        created_at: string;
    }[];
    badges: {
        developer: boolean;
        contributor: boolean;
        translator: boolean;
        alpha_tester: boolean;
        shop_owner: boolean;
    };
}

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
    'booth.pm': 'lucide:store', // boothのアイコンをローカルアイコンパックとして登録する
};

onMounted(async () => {
    const query = [
        'name',
        'avatar',
        'bio',
        'links',
        'created_at',
        'setups(id, name, description, avatar(id, name, thumbnail), author(id, name, avatar), image, created_at)',
        'badges(developer, contributor, translator, alpha_tester, shop_owner)',
    ];

    const { data } = await client
        .from('users')
        .select(query.join(', '))
        .eq('id', userId.value)
        .order('created_at', { referencedTable: 'setups', ascending: false })
        .maybeSingle();

    if (!data) {
        loading.value = false;
        return;
    }

    userData.value = data as unknown as User;

    linksShort.value = userData.value.links.map((i) => {
        for (const key in linkIcons) {
            if (new URL(i).hostname.includes(key)) {
                return {
                    [i
                        .replace('https://www.', '')
                        .replace('http://www.', '')
                        .replace('https://', '')
                        .replace('http://', '')]: linkIcons[key],
                };
            }
        }
        return {
            [i
                .replace('https://www.', '')
                .replace('http://www.', '')
                .replace('https://', '')
                .replace('http://', '')]: '',
        };
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
                <NuxtLink v-if="user && user.id === userId" to="/user/setting">
                    <UiButton
                        icon="lucide:pen-line"
                        :icon-size="19"
                        tooltip="プロフィールを編集"
                    />
                </NuxtLink>
                <UiButton
                    v-else
                    icon="lucide:flag"
                    :icon-size="19"
                    tooltip="ユーザーを報告"
                    @click="modal_report = true"
                />
                <UModal
                    v-model="modal_report"
                    :ui="{
                        background: 'bg-white dark:bg-neutral-100',
                        ring: 'ring-0',
                        rounded: 'rounded-xl',
                    }"
                >
                    <ModalReportUser
                        :id="userId"
                        @close="modal_report = false"
                    />
                </UModal>
            </div>

            <div class="w-full flex flex-col gap-3 pl-2">
                <div
                    v-if="userData.links"
                    class="flex flex-wrap items-center gap-2"
                >
                    <UiTooltip
                        v-for="(i, index) in userData.links"
                        :text="
                            Object.values(linksShort[index])[0].length
                                ? Object.keys(linksShort[index])[0]
                                : ''
                        "
                    >
                        <NuxtLink
                            :to="i"
                            target="_blank"
                            class="min-h-[38px] p-2 rounded-lg flex items-center justify-center text-neutral-600 dark:text-neutral-300 border border-1 border-neutral-400 dark:border-neutral-600 hover:bg-neutral-300 hover:dark:bg-neutral-700"
                        >
                            <Icon
                                v-if="
                                    Object.values(linksShort[index])[0].length
                                "
                                :name="Object.values(linksShort[index])[0]"
                                size="20"
                                class="text-neutral-600 dark:text-neutral-300"
                            />

                            <p
                                v-else
                                class="px-1 text-sm font-medium leading-none"
                            >
                                {{ Object.keys(linksShort[index])[0] }}
                            </p>
                        </NuxtLink>
                    </UiTooltip>
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

        <div v-if="userData.setups" class="w-full flex flex-col gap-5 pl-2">
            <UiTitle label="セットアップ" icon="lucide:shirt" />

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
                    :author-id="i.author.id"
                    :author-name="i.author.name"
                    :author-avatar="i.author.avatar"
                    :created-at="i.created_at"
                    :image="i.image"
                />
            </NuxtLink>
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
