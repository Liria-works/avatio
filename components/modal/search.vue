<script lang="ts" setup>
const router = useRouter();

const emit = defineEmits(["close"]);
const client = await useSBClient();

const searchWord = ref<string>("");
const searchResultsSetup = ref();
const searchResultsAvatar = ref();

const avatarsOwned = ref();
const avatars = ref();
const tags = ref();

const filterSetup = ref<boolean>(false);
const filterAvatar = ref<boolean>(false);

const loading = ref<boolean>(true);
const searching = ref<boolean>(false);

onMounted(async () => {
    avatarsOwned.value = await useGetOwnedAvatars();
    avatars.value = await useGetPopularAvatars();
    tags.value = await useGetPopularTags();

    loading.value = false;
});

const handleInputChange = useDebounceFn(
    async (value) => {
        searching.value = true;

        if (!value.length) {
            searching.value = false;
            searchResultsSetup.value = [];
            return;
        }

        searchResultsSetup.value = await client
            .rpc("search_setups", {
                keywords: searchWord.value,
            })
            .select("id, name, author, avatar, image")
            .limit(6); // 取得数を制限しています
        searchResultsSetup.value = searchResultsSetup.value.data;

        for (const i of searchResultsSetup.value) {
            if (i.image) {
                i.image = await useGetImage(i.image);
            }
            i.avatar = await useFetchBooth(i.avatar);
            if (i.avatar.avatar_details) {
                i.avatar_short = i.avatar.avatar_details.short_ja;
            } else {
                i.avatar_short = null;
            }
            i.avatar = i.avatar.thumbnail;
        }

        searchResultsAvatar.value = await client
            .rpc("search_items", {
                keywords: value.toString(),
            })
            .select("id, name, thumbnail, shop, category")
            .eq("category", 208)
            .limit(6); // 取得数を制限しています
        searchResultsAvatar.value = searchResultsAvatar.value.data;

        searching.value = false;
    },
    400,
    { maxWait: 1000 }
); // 400～1000ms デバウンス

watch(searchWord, (newValue) => {
    handleInputChange(newValue);
});
</script>

<template>
    <UCard
        :ui="{
            ring: '',
            divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
    >
        <template #header>
            <UInput
                v-model="searchWord"
                autofocus
                icon="i-heroicons-magnifying-glass-20-solid"
                size="lg"
                variant="none"
                :trailing="false"
                :padded="false"
                placeholder="キーワード検索"
                class="mt-1"
                @keyup.enter="
                    emit('close');
                    router.push(`/search?q=${encodeURIComponent(searchWord)}`);
                "
            >
                <template #trailing>
                    <Icon
                        name="lucide:arrow-right"
                        class="size-5 text-neutral-500 dark:text-neutral-500"
                    />
                </template>
            </UInput>
        </template>

        <div
            v-if="!loading && !searchWord.length"
            class="w-full flex flex-col items-center gap-6 p-3"
        >
            <div v-if="avatarsOwned" class="w-full flex flex-col gap-3">
                <UiTitle
                    label="あなたのセットアップから"
                    icon="lucide:user-round"
                />
                <div
                    class="justify-start items-center gap-1.5 flex flex-row flex-wrap w-full"
                >
                    <NuxtLink
                        v-for="i in avatarsOwned"
                        :key="'suggest-avatar-' + i.id"
                        :to="{ name: 'search', query: { item: i.id } }"
                        @click="emit('close')"
                    >
                        <ItemTiny
                            :label="i.short ? i.short : i.name"
                            :thumbnail="i.thumbnail"
                            class="bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 hover:dark:bg-neutral-700"
                        />
                    </NuxtLink>
                </div>
            </div>

            <div v-if="avatars" class="w-full flex flex-col gap-3">
                <UiTitle label="人気のアバターから" icon="lucide:sparkles" />
                <div
                    class="justify-start items-center gap-1.5 flex flex-row flex-wrap w-full"
                >
                    <NuxtLink
                        v-for="i in avatars"
                        :key="'suggest-avatar-' + i.id"
                        :to="{ name: 'search', query: { item: i.id } }"
                        @click="emit('close')"
                    >
                        <ItemTiny
                            :label="i.short ? i.short : i.name"
                            :thumbnail="i.thumbnail"
                            class="bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 hover:dark:bg-neutral-700"
                        />
                    </NuxtLink>
                </div>
            </div>

            <div v-if="tags" class="w-full flex flex-col gap-3">
                <UiTitle label="タグから" icon="lucide:tags" />
                <div
                    class="justify-start items-center gap-1.5 flex flex-row flex-wrap w-full"
                >
                    <NuxtLink
                        v-for="i in tags"
                        :key="'suggest-avatar-' + i"
                        :to="{ name: 'search', query: { tag: i } }"
                        @click="emit('close')"
                    >
                        <button
                            class="px-2.5 py-1 rounded-lg justify-center items-center flex gap-1 border border-1 border-neutral-300 dark:border-neutral-600 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 hover:dark:bg-neutral-700"
                        >
                            <Icon
                                name="lucide:tag"
                                class="size-4 min-w-max min-h-max text-neutral-500 dark:text-neutral-400"
                            />
                            <p
                                class="text-sm font-normal whitespace-nowrap text-black dark:text-white"
                            >
                                {{ i }}
                            </p>
                        </button>
                    </NuxtLink>
                </div>
            </div>
        </div>

        <div
            v-if="loading && !searchWord.length"
            class="w-full h-80 flex items-center justify-center"
        >
            <Icon name="i-svg-spinners-ring-resize" />
        </div>

        <div
            v-if="searchWord.length"
            class="w-full max-h-[60vh] overflow-auto flex flex-col gap-5"
        >
            <div class="flex items-center gap-2">
                <button
                    :class="
                        filterSetup
                            ? 'py-1 px-3 rounded-full text-sm border border-1 border-neutral-400 text-white dark:text-black bg-neutral-500 hover:bg-neutral-400 dark:bg-neutral-400 hover:dark:bg-neutral-500'
                            : 'py-1 px-3 rounded-full text-sm border border-1 border-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800'
                    "
                    @click="filterSetup = !filterSetup"
                >
                    セットアップ
                </button>
                <button
                    :class="
                        filterAvatar
                            ? 'py-1 px-3 rounded-full text-sm border border-1 border-neutral-400 text-white dark:text-black bg-neutral-500 hover:bg-neutral-400 dark:bg-neutral-400 hover:dark:bg-neutral-500'
                            : 'py-1 px-3 rounded-full text-sm border border-1 border-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800'
                    "
                    @click="filterAvatar = !filterAvatar"
                >
                    ベースアバター
                </button>
            </div>

            <div v-if="!searching" class="w-full flex flex-col gap-6">
                <div
                    v-if="
                        searchResultsSetup &&
                        searchResultsSetup.length &&
                        ((filterSetup && !filterAvatar) ||
                            (filterSetup && filterAvatar) ||
                            (!filterSetup && !filterAvatar))
                    "
                    class="w-full flex flex-col gap-3"
                >
                    <UiTitle label="セットアップ" icon="lucide:search" />
                    <div class="w-full flex flex-col gap-2 px-3">
                        <NuxtLink
                            v-for="i in searchResultsSetup"
                            :key="'search-result-' + i.id"
                            :to="{ name: 'setup-id', params: { id: i.id } }"
                            class="w-full rounded-xl"
                            @click="emit('close')"
                        >
                            <button
                                class="w-full h-12 pr-3 flex gap-2 items-center justify-between rounded-lg border border-1 border-neutral-300 dark:border-neutral-600 bg-neutral-100 hover:bg-neutral-300 dark:bg-neutral-800 hover:dark:bg-neutral-700"
                            >
                                <NuxtImg
                                    :src="i.image ? i.image : i.avatar"
                                    :alt="i.name"
                                    class="w-16 h-full rounded-lg object-cover p-1"
                                />
                                <p
                                    class="grow text-left text-sm line-clamp-1 break-all text-neutral-800 dark:text-neutral-200"
                                >
                                    {{ i.name }}
                                </p>
                                <p
                                    class="min-w-20 max-w-32 text-xs text-right line-clamp-1 break-all text-neutral-800 dark:text-neutral-200"
                                >
                                    {{ i.avatar_short.ja }}
                                </p>
                            </button>
                        </NuxtLink>
                    </div>
                </div>

                <div
                    v-if="
                        searchResultsAvatar &&
                        searchResultsAvatar.length &&
                        ((!filterSetup && filterAvatar) ||
                            (filterSetup && filterAvatar) ||
                            (!filterSetup && !filterAvatar))
                    "
                    class="w-full flex flex-col gap-3"
                >
                    <UiTitle label="ベースアバター" icon="lucide:search" />
                    <div class="w-full flex flex-col gap-2 px-3">
                        <button
                            v-for="i in searchResultsAvatar"
                            :key="'search-result-' + i.id"
                            class="w-full h-10 pr-3 flex gap-2 items-center justify-between rounded-lg border border-1 border-neutral-300 dark:border-neutral-600 bg-neutral-100 hover:bg-neutral-300 dark:bg-neutral-800 hover:dark:bg-neutral-700"
                        >
                            <NuxtImg
                                :src="i.thumbnail"
                                :alt="i.name"
                                class="size-10 rounded-lg p-1"
                            />
                            <p
                                class="grow text-left text-sm line-clamp-1 break-all text-neutral-800 dark:text-neutral-200"
                            >
                                {{ i.name }}
                            </p>
                            <p
                                class="min-w-20 max-w-32 text-xs text-right line-clamp-1 break-all text-neutral-800 dark:text-neutral-200"
                            >
                                {{ i.shop }}
                            </p>
                        </button>
                    </div>
                </div>
            </div>

            <div
                v-if="searching"
                class="w-full h-80 flex items-center justify-center"
            >
                <Icon name="i-svg-spinners-ring-resize" />
            </div>
        </div>
    </UCard>
</template>
