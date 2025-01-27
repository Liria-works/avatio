<script setup lang="ts">
const user = useSupabaseUser();
const route = useRoute();

const id = Number(route.params.id);
const bookmark = ref(false);

const modalLogin = ref(false);
const modalReport = ref(false);
const modalDelete = ref(false);

const toggleBookmark = async () => {
    if (!user.value) return (modalLogin.value = true);

    if (bookmark.value) await useRemoveBookmark(id);
    else await useAddBookmark(id);

    bookmark.value = await useCheckBookmark(id);
};

if (!id)
    showError({
        statusCode: 404,
        message: 'IDが無効です',
    });

const { data, error } = await $fetch<ApiResponse<SetupClient>>(`/api/setup`, {
    method: 'GET',
    query: { id },
});

if (error && error.status === 404)
    showError({
        statusCode: 404,
        message: 'セットアップが見つかりませんでした',
    });

if (error)
    showError({
        statusCode: 500,
        message: 'セットアップの取得に失敗しました',
    });

onMounted(async () => {
    if (!id)
        return showError({
            statusCode: 404,
            message: 'IDが無効です',
        });

    bookmark.value = await useCheckBookmark(id);

    useOGP({
        title: `${data!.name} @${data!.author.name}`,
        description: data!.description,
        image: data!.images.length
            ? useGetImage(data!.images[0]!.name, { prefix: 'setup' })
            : 'https://avatio.me/ogp.png',
        twitterCard: data!.images.length ? 'summary_large_image' : 'summary',
    });
});
</script>

<template>
    <div v-if="data" class="flex flex-col gap-8">
        <div class="w-full flex flex-col xl:flex-row items-start gap-8">
            <div class="w-full flex flex-col items-center gap-8">
                <div class="w-full flex flex-col gap-3">
                    <h1
                        class="w-full text-left text-2xl font-bold line-clamp-2 break-keep [overflow-wrap:anywhere;] text-black dark:text-white"
                    >
                        {{ useSentence(data.name) }}
                    </h1>

                    <div class="w-full gap-3 flex flex-wrap items-center">
                        <div
                            class="grow flex flex-wrap items-center gap-x-5 gap-y-2"
                        >
                            <NuxtLink
                                :to="`/@${data.author.id}`"
                                class="flex flex-row gap-3 items-center"
                            >
                                <UiAvatar
                                    :url="
                                        data.author.avatar
                                            ? useGetImage(data.author.avatar, {
                                                  prefix: 'avatar',
                                              })
                                            : ''
                                    "
                                    :alt="data.author.name"
                                />
                                <p
                                    class="text-black dark:text-white pb-0.5 text-left font-normal"
                                >
                                    {{ data.author.name }}
                                </p>
                            </NuxtLink>

                            <div class="flex items-center gap-2">
                                <p
                                    class="text-sm text-zinc-500 dark:text-zinc-400 whitespace-nowrap leading-none"
                                >
                                    {{
                                        useLocaledDate(
                                            new Date(data.created_at)
                                        )
                                    }}
                                    に公開
                                </p>
                            </div>
                        </div>

                        <div class="flex items-center gap-1">
                            <ButtonBase
                                v-if="user?.id !== data.author.id"
                                :tooltip="
                                    bookmark
                                        ? 'ブックマークから削除'
                                        : 'ブックマーク'
                                "
                                :icon="
                                    bookmark
                                        ? 'lucide:bookmark-x'
                                        : 'lucide:bookmark'
                                "
                                :aria-label="
                                    bookmark
                                        ? 'ブックマークから削除'
                                        : 'ブックマーク'
                                "
                                variant="flat"
                                class="p-2.5 hover:bg-zinc-300 hover:dark:bg-zinc-600"
                                :icon-class="
                                    bookmark
                                        ? 'text-red-500 dark:text-red-400'
                                        : 'text-zinc-600 dark:text-zinc-300'
                                "
                                @click="toggleBookmark"
                            />

                            <ButtonBase
                                v-if="user?.id === data.author.id"
                                tooltip="削除"
                                aria-label="削除"
                                icon="lucide:trash"
                                :icon-size="18"
                                variant="flat"
                                class="p-2.5 hover:bg-zinc-300 hover:dark:bg-zinc-600"
                                icon-class="text-red-400 dark:text-red-300"
                                @click="modalDelete = true"
                            />

                            <PopupShare
                                :setup-name="data.name"
                                :setup-description="data.description ?? ''"
                                :setup-author="data.author.name"
                            >
                                <ButtonBase
                                    icon="lucide:share-2"
                                    :icon-size="18"
                                    tooltip="シェア"
                                    aria-label="シェア"
                                    aria-expanded="false"
                                    variant="flat"
                                    class="p-2.5 hover:bg-zinc-300 hover:dark:bg-zinc-600"
                                />
                            </PopupShare>
                        </div>
                    </div>
                </div>

                <UiImage
                    v-if="data.images.length"
                    :src="
                        useGetImage(data.images[0]!.name, { prefix: 'setup' })
                    "
                    :alt="data.name"
                    :width="data.images[0]!.width ?? 640"
                    :height="data.images[0]!.height ?? 320"
                    class="w-full max-h-[70vh]"
                />

                <div class="self-stretch flex xl:hidden flex-col gap-3">
                    <div
                        v-if="data.description"
                        class="self-stretch rounded-lg flex flex-col gap-1.5"
                    >
                        <h2 class="text-zinc-500 text-sm mt-1 leading-none">
                            説明
                        </h2>
                        <p
                            class="text-sm/relaxed whitespace-pre-wrap break-keep [overflow-wrap:anywhere] text-zinc-900 dark:text-zinc-100"
                        >
                            {{ useSentence(data.description) }}
                        </p>
                    </div>

                    <div
                        v-if="data.tags && data.tags.length"
                        class="items-center gap-1.5 flex flex-row flex-wrap"
                    >
                        <ButtonBase
                            v-for="tag in data.tags"
                            :key="useId()"
                            :label="tag"
                            class="rounded-full"
                            @click="navigateTo(`/search?tag=${tag}`)"
                        />
                    </div>
                </div>

                <div class="w-full flex flex-col gap-3">
                    <template v-if="data.items.avatar.length">
                        <UiTitle
                            label="ベースアバター"
                            icon="lucide:person-standing"
                            is="h2"
                            class="mb-3"
                        />
                        <SetupsItem
                            v-for="item in data.items.avatar"
                            :key="useId()"
                            size="lg"
                            :item="item"
                        />
                    </template>

                    <template v-if="data.items.cloth.length">
                        <UiTitle
                            label="衣装"
                            icon="lucide:shirt"
                            is="h2"
                            class="mb-3"
                        />
                        <SetupsItem
                            v-for="item in data.items.cloth"
                            :key="useId()"
                            size="md"
                            :item="item"
                        />
                    </template>

                    <template v-if="data.items.accessory.length">
                        <UiTitle
                            label="アクセサリー"
                            icon="lucide:star"
                            is="h2"
                            class="mb-3"
                        />
                        <SetupsItem
                            v-for="item in data.items.accessory"
                            :key="useId()"
                            size="md"
                            :item="item"
                        />
                    </template>

                    <template v-if="data.items.other.length">
                        <UiTitle
                            label="その他"
                            icon="lucide:package"
                            is="h2"
                            class="mb-3"
                        />
                        <SetupsItem
                            v-for="item in data.items.other"
                            :key="useId()"
                            size="md"
                            :item="item"
                        />
                    </template>
                </div>
            </div>

            <div
                class="empty:hidden w-full xl:w-[440px] xl:pt-12 flex flex-col gap-6"
            >
                <div
                    v-if="data.description"
                    class="hidden xl:flex flex-col self-stretch rounded-xl gap-1.5"
                >
                    <h2 class="text-zinc-500 text-sm mt-1 leading-none">
                        説明
                    </h2>
                    <p
                        class="text-sm/relaxed whitespace-pre-wrap break-keep [overflow-wrap:anywhere] text-zinc-900 dark:text-zinc-100"
                    >
                        {{ useSentence(data.description) }}
                    </p>
                </div>

                <ul
                    v-if="data.tags && data.tags.length"
                    class="hidden xl:flex flex-wrap items-center gap-1.5"
                >
                    <li v-for="tag in data.tags" :key="useId()">
                        <ButtonBase
                            :label="tag"
                            class="rounded-full"
                            @click="navigateTo(`/search?tag=${tag}`)"
                        />
                    </li>
                </ul>
            </div>
        </div>

        <ButtonBase
            label="セットアップを報告"
            icon="lucide:flag"
            :icon-size="16"
            variant="flat"
            class="w-fit px-3 py-2 mt-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-300 hover:dark:bg-zinc-700"
            icon-class="text-red-400 dark:text-red-400"
            @click="
                if (user) modalReport = true;
                else modalLogin = true;
            "
        />

        <ModalBase v-model="modalLogin">
            <UiLogin
                :redirect="`/setup/${route.params.id}`"
                @login-success="
                    modalLogin = false;
                    (async () => {
                        if (!data) return;
                        bookmark = await useCheckBookmark(id);
                    })();
                "
            />
        </ModalBase>

        <ModalReportSetup v-model="modalReport" :id="Number(id)" />
        <ModalDeleteSetup v-model="modalDelete" :id="Number(id)" />
    </div>
</template>
