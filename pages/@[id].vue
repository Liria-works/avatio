<script lang="ts" setup>
const route = useRoute();
const client = await useSBClient();
const user = useSupabaseUser();

const modalReport = ref(false);
const modalLogin = ref(false);

const { data: userData } = await client
    .from('users')
    .select(
        `
        id,
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

    <div v-else class="w-full flex flex-col px-2 gap-6">
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
                <div
                    v-if="user && user.id === userData.id"
                    class="flex items-center gap-1"
                >
                    <ButtonBase
                        to="/settings"
                        icon="lucide:pen-line"
                        :icon-size="19"
                        tooltip="プロフィールを編集"
                        aria-label="プロフィールを編集"
                        variant="flat"
                    />
                    <ButtonBase
                        to="/bookmarks"
                        icon="lucide:bookmark"
                        :icon-size="19"
                        tooltip="ブックマーク"
                        aria-label="ブックマーク"
                        variant="flat"
                    />
                </div>
            </div>

            <div class="w-full flex flex-col gap-3 pl-2">
                <div
                    v-if="userData.links && userData.links.length"
                    class="flex flex-wrap items-center gap-2"
                >
                    <ButtonLink v-for="i in userData.links" :link="i" />
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

            <ButtonBase
                v-if="!user || user.id !== userData.id"
                label="ユーザーを報告"
                icon="lucide:flag"
                :icon-size="16"
                variant="flat"
                class="self-end px-3 py-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-300 hover:dark:bg-zinc-700"
                icon-class="text-red-400 dark:text-red-400"
                @click="
                    if (user) modalReport = true;
                    else modalLogin = true;
                "
            />
            <ModalReportUser v-model="modalReport" :id="userData.id" />
            <ModalBase v-model="modalLogin">
                <UiLogin
                    :redirect="`/@${userData.id}`"
                    @login-success="
                        modalLogin = false;
                        modalReport = true;
                    "
                />
            </ModalBase>
        </div>

        <div class="w-full flex flex-col gap-5 pl-2">
            <UiTitle label="セットアップ" icon="lucide:shirt" size="lg" />

            <SetupsListUser :user-id="userData.id" />
        </div>
    </div>
</template>
