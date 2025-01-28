<script setup lang="ts">
const user = useSupabaseUser();

const mode = ref<'all' | 'mine' | 'bookmark'>('all');

useOGP({
    url: 'https://avatio.me',
    type: 'website',
    title: 'Avatio',
    titleTemplate: '%s',
    description: 'あなたのアバター改変を共有しよう',
    image: 'https://avatio.me/ogp_2.png',
    twitterCard: 'summary_large_image',
});
</script>

<template>
    <div class="w-full flex flex-col gap-6">
        <ClientOnly>
            <div class="empty:hidden -mt-2 flex flex-col gap-2">
                <BannerWelcome />
                <BannerOwnerWarning />
            </div>
        </ClientOnly>

        <div class="flex flex-col items-start gap-5 w-full">
            <UiTitle label="ホーム" size="lg" />
            <div class="flex flex-wrap items-center gap-1">
                <ButtonBase
                    label="最新"
                    variant="flat"
                    :class="[
                        'text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-700',
                        mode === 'all' ? 'bg-zinc-200 dark:bg-zinc-700' : '',
                    ]"
                    @click="mode = 'all'"
                />
                <ButtonBase
                    label="自分の投稿"
                    variant="flat"
                    :class="[
                        'text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-700',
                        mode === 'mine' ? 'bg-zinc-200 dark:bg-zinc-700' : '',
                    ]"
                    @click="mode = 'mine'"
                />
                <ButtonBase
                    label="ブックマーク"
                    variant="flat"
                    :class="[
                        'text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-700',
                        mode === 'bookmark'
                            ? 'bg-zinc-200 dark:bg-zinc-700'
                            : '',
                    ]"
                    @click="mode = 'bookmark'"
                />
            </div>

            <SetupsListHome v-if="mode === 'all'" />
            <SetupsListUser
                v-else-if="mode === 'mine'"
                :user-id="user ? user.id : null"
            />
            <SetupsListBookmarks v-else-if="mode === 'bookmark'" />
        </div>
    </div>
</template>
