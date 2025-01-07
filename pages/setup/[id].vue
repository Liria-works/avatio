<script setup lang="ts">
const user = useSupabaseUser();
const client = await useSBClient();
const route = useRoute();

const modalLogin = ref(false);
const modalReport = ref(false);
const modalDelete = ref(false);

const id = Number(route.params.id);
const setup = ref<Setup | null>(null);
const items = ref<CategorizedSetupItems>({
    avatar: {
        label: 'ベースアバター',
        icon: 'lucide:person-standing',
        items: [],
    },
    cloth: { label: '衣装', icon: 'lucide:shirt', items: [] },
    accessory: { label: 'アクセサリー', icon: 'lucide:star', items: [] },
    other: { label: 'その他', icon: 'lucide:package', items: [] },
});
const bookmark = ref(false);

const toggleBookmark = async () => {
    if (!user.value) return (modalLogin.value = true);

    if (!setup.value) return new Error('Invalid setup data');

    if (bookmark.value) await useRemoveBookmark(setup.value.id);
    else await useAddBookmark(setup.value.id);

    bookmark.value = await useCheckBookmark(setup.value.id);
};

onMounted(async () => {
    if (!id)
        return showError({
            statusCode: 404,
            message: 'IDが無効です',
        });

    bookmark.value = await useCheckBookmark(id);

    const { data } = await client
        .from('setups')
        .select(
            `
            id,
            created_at,
            name,
            description,
            author(id, name, avatar),
            image,
            items:setup_items(
                data:item_id(
                    id, updated_at, outdated, category, name, thumbnail, price, shop:shop_id(id, name, thumbnail, verified), nsfw
                ),
                note,
                unsupported
            ),
            tags:setup_tags(tag)
            `
        )
        .eq('id', Number(id))
        .maybeSingle();

    setup.value = data as unknown as Setup;

    if (!setup.value)
        return showError({
            statusCode: 404,
            message: 'セットアップが見つかりませんでした',
        });

    if (setup.value?.items)
        for (const item of setup.value.items) {
            const categoryMap: { [key: number]: keyof CategorizedSetupItems } =
                {
                    208: 'avatar',
                    209: 'cloth',
                    217: 'accessory',
                };

            const categoryKey = categoryMap[item.data.category] || 'other';
            items.value[categoryKey].items.push({
                ...item.data,
                note: item.note,
                unsupported: item.unsupported,
            });
        }

    useOGP({
        title: setup.value.name,
        description: setup.value.description,
        image: setup.value.image
            ? useGetImage(setup.value.image, { prefix: 'setup' })
            : '/ogp.png',
        twitterCard: setup.value.image ? 'summary_large_image' : 'summary',
    });
});
</script>

<template>
    <div v-if="setup" class="flex flex-col gap-8">
        <div class="w-full flex flex-col xl:flex-row items-start gap-8">
            <div class="w-full flex flex-col items-center gap-8">
                <div class="w-full flex flex-col gap-3">
                    <h1
                        class="w-full text-left text-2xl font-bold line-clamp-2 break-keep [overflow-wrap:anywhere;] text-black dark:text-white"
                    >
                        {{ useSentence(setup.name) || '' }}
                    </h1>

                    <div class="w-full gap-3 flex flex-wrap items-center">
                        <div
                            class="grow flex flex-wrap items-center gap-x-5 gap-y-2"
                        >
                            <NuxtLink
                                :to="{
                                    name: 'user-id',
                                    params: { id: setup.author.id },
                                }"
                                class="flex flex-row gap-3 items-center"
                            >
                                <UiAvatar
                                    :url="
                                        setup.author.avatar
                                            ? useGetImage(setup.author.avatar, {
                                                  prefix: 'avatar',
                                              })
                                            : ''
                                    "
                                    :alt="setup.author.name"
                                />
                                <p
                                    class="text-black dark:text-white pb-0.5 text-left font-normal"
                                >
                                    {{ setup.author.name }}
                                </p>
                            </NuxtLink>

                            <div class="flex items-center gap-2">
                                <p
                                    class="text-sm text-zinc-500 dark:text-zinc-400 whitespace-nowrap leading-none"
                                >
                                    {{
                                        useLocaledDate(
                                            new Date(setup.created_at)
                                        )
                                    }}
                                    に公開
                                </p>
                            </div>
                        </div>

                        <div class="flex items-center gap-1">
                            <UiButton
                                v-if="user?.id !== setup.author.id"
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
                                padding=""
                                class="p-2.5 hover:bg-zinc-300 hover:dark:bg-zinc-600"
                                :icon-class="
                                    bookmark
                                        ? 'text-red-500 dark:text-red-400'
                                        : 'text-zinc-600 dark:text-zinc-300'
                                "
                                @click="toggleBookmark"
                            />

                            <UiButton
                                v-if="user?.id === setup.author.id"
                                tooltip="削除"
                                icon="lucide:trash"
                                :icon-size="18"
                                class="p-2.5 hover:bg-zinc-300 hover:dark:bg-zinc-600"
                                icon-class="text-red-400 dark:text-red-300"
                                @click="modalDelete = true"
                            />

                            <PopupShare
                                :setup-name="setup.name"
                                :setup-description="
                                    setup.description ? setup.description : ''
                                "
                                :setup-author="setup.author.name"
                            />
                        </div>
                    </div>
                </div>

                <UiImage
                    v-if="setup.image"
                    :src="useGetImage(setup.image, { prefix: 'setup' })"
                    :alt="setup.name"
                    class="w-full max-h-[70vh]"
                />

                <div class="self-stretch flex xl:hidden flex-col gap-3">
                    <div
                        v-if="setup.description"
                        class="self-stretch rounded-lg flex flex-col gap-1.5 px-3 py-2 border border-zinc-300 dark:border-zinc-600"
                    >
                        <p class="text-zinc-500 text-sm mt-1 leading-none">
                            説明
                        </p>
                        <p
                            class="text-sm/relaxed whitespace-pre-wrap break-keep [overflow-wrap:anywhere] text-zinc-900 dark:text-zinc-100"
                        >
                            {{ useSentence(setup.description) }}
                        </p>
                    </div>

                    <div
                        v-if="setup.tags && setup.tags.length"
                        class="items-center gap-1.5 flex flex-row flex-wrap"
                    >
                        <button
                            v-for="tag in setup.tags"
                            :key="useId()"
                            type="button"
                            class="px-3.5 py-2 rounded-full text-sm font-semibold border border-1 border-zinc-400 dark:border-zinc-500 hover:bg-zinc-300 hover:dark:bg-zinc-600 text-zinc-900 dark:text-zinc-200"
                            @click="navigateTo(`/search?tag=${tag.tag}`)"
                        >
                            {{ tag.tag }}
                        </button>
                    </div>
                </div>

                <div class="w-full flex flex-col gap-3">
                    <div
                        v-for="item in items"
                        :key="useId()"
                        :class="[
                            'w-full flex flex-col gap-3',
                            item.items.length ? '' : 'hidden',
                        ]"
                    >
                        <UiTitle :label="item.label" :icon="item.icon" />

                        <ItemBooth
                            v-for="i in item.items"
                            :id="i.id"
                            :key="useId()"
                            :size="i.category === 208 ? 'lg' : 'md'"
                            :note="i.note"
                            :unsupported="i.unsupported"
                            :name="i.name"
                            :thumbnail="i.thumbnail"
                            :price="i.price"
                            :shop="i.shop"
                            :nsfw="i.nsfw"
                            :updated-at="i.updated_at"
                            :outdated="i.outdated"
                        />
                    </div>
                </div>
            </div>

            <div
                class="empty:hidden w-full xl:w-96 xl:pt-12 flex flex-col gap-6"
            >
                <div
                    v-if="setup.description"
                    class="hidden xl:flex flex-col self-stretch rounded-lg gap-1.5 px-3 py-2 border border-zinc-300 dark:border-zinc-600"
                >
                    <p class="text-zinc-500 text-sm mt-1 leading-none">説明</p>
                    <p
                        class="text-sm/relaxed whitespace-pre-wrap break-keep [overflow-wrap:anywhere] text-zinc-900 dark:text-zinc-100"
                    >
                        {{ useSentence(setup.description) }}
                    </p>
                </div>

                <div
                    v-if="setup.tags && setup.tags.length"
                    class="hidden xl:flex flex-wrap items-center gap-1.5"
                >
                    <button
                        v-for="tag in setup.tags"
                        :key="useId()"
                        type="button"
                        class="px-3.5 py-2 rounded-full text-sm font-semibold border border-1 border-zinc-400 dark:border-zinc-500 hover:bg-zinc-300 hover:dark:bg-zinc-600 text-zinc-900 dark:text-zinc-200"
                        @click="navigateTo(`/search?tag=${tag.tag}`)"
                    >
                        {{ tag.tag }}
                    </button>
                </div>
            </div>
        </div>

        <UiButton
            label="セットアップを報告"
            icon="lucide:flag"
            :icon-size="16"
            variant="flat"
            class="px-3 py-2 mt-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-300 hover:dark:bg-zinc-700"
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
                        if (!setup) return;
                        bookmark = await useCheckBookmark(setup.id);
                    })();
                "
            />
        </ModalBase>

        <ModalReportSetup v-model="modalReport" :id="Number(setup?.id)" />

        <ModalDeleteSetup
            v-model="modalDelete"
            :id="Number(setup?.id)"
            :image="setup?.image"
        />
    </div>
</template>
