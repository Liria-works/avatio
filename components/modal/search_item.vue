<script lang="ts" setup>
const router = useRouter();

const emit = defineEmits(["close", "add"]);
const client = await useSBClient();

const searchWord = ref<string>("");
const searchItems = ref<
    {
        id: number;
        name: string;
        thumbnail: string;
        shop: string;
        category: number;
    }[]
>([]);

const filter = ref<string[]>([]);
const searching = ref<boolean>(false);

onMounted(async () => { });

const handleInputChange = useDebounceFn(
    async (value) => {
        searching.value = true;

        if (!value.length) {
            searching.value = false;
            return;
        }

        let query = client.rpc("search_items", {
            keywords: value.toString(),
        });

        if (filter.value.length) {
            if (filter.value.includes("other")) {
                let ignore: { [key: string]: number } = {
                    avatar: 208,
                    cloth: 209,
                    accessory: 217,
                };
                for (const i of filter.value) {
                    ignore = Object.keys(ignore).reduce(
                        (acc: { [key: string]: number }, key) => {
                            if (key !== i) acc[key] = ignore[key];
                            return acc;
                        },
                        {}
                    );
                }
                query = query.not(
                    "category",
                    "in",
                    `(${Object.values(ignore).join(",")})`
                );
            } else {
                const categories = [];
                if (filter.value.includes("avatar")) categories.push(208);
                if (filter.value.includes("cloth")) categories.push(209);
                if (filter.value.includes("accessory")) categories.push(217);

                if (categories.length)
                    query = query.or(
                        categories.map((cat) => `category.eq.${cat}`).join(",")
                    );
            }
        }

        const { data } = await query.limit(10); // 取得数を制限しています;
        searchItems.value = data;

        searching.value = false;
    },
    400,
    { maxWait: 1000 }
); // 400～1000ms デバウンス

watch(searchWord, (newValue) => {
    handleInputChange(newValue);
});
watch(filter.value, () => {
    handleInputChange(searchWord.value);
});
</script>

<template>
    <UCard :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
    }">
        <template #header>
            <UInput v-model="searchWord" autofocus icon="i-heroicons-magnifying-glass-20-solid" size="lg" variant="none"
                :trailing="false" :padded="false" placeholder="アイテム名検索" class="mt-1" @keyup.enter="
                    emit('close');
                router.push(`/search?q=${encodeURIComponent(searchWord)}`);
                ">
                <template #trailing>
                    <Icon name="lucide:arrow-right" class="size-5 text-neutral-500 dark:text-neutral-500" />
                </template>
            </UInput>
        </template>

        <div v-if="!searchWord.length" class="w-full flex flex-col items-center gap-6 p-3">
            <p class="text-sm text-neutral-500">
                アイテムの検索は、Avatio上に登録されているアイテムのみを検索します。<br />
                BOOTHなどの外部サイトに登録されているアイテムすべてを検索することはできません。
            </p>
        </div>

        <div v-if="searchWord.length" class="w-full max-h-[60vh] overflow-auto flex flex-col gap-5">
            <div class="flex items-center gap-2">
                <button :class="`py-1 px-3 rounded-full text-sm border border-1 border-neutral-400 ${filter.includes('avatar')
                        ? 'text-white dark:text-black bg-neutral-500 hover:bg-neutral-400 dark:bg-neutral-400 hover:dark:bg-neutral-500'
                        : 'hover:bg-neutral-200 dark:hover:bg-neutral-800'
                    }`" @click="
                        filter.includes('avatar')
                            ? filter.splice(filter.indexOf('avatar'), 1)
                            : filter.push('avatar')
                        ">
                    ベースアバター
                </button>
                <button :class="`py-1 px-3 rounded-full text-sm border border-1 border-neutral-400 ${filter.includes('cloth')
                        ? 'text-white dark:text-black bg-neutral-500 hover:bg-neutral-400 dark:bg-neutral-400 hover:dark:bg-neutral-500'
                        : 'hover:bg-neutral-200 dark:hover:bg-neutral-800'
                    }`" @click="
                        filter.includes('cloth')
                            ? filter.splice(filter.indexOf('cloth'), 1)
                            : filter.push('cloth')
                        ">
                    衣装
                </button>

                <button :class="`py-1 px-3 rounded-full text-sm border border-1 border-neutral-400 ${filter.includes('accessory')
                        ? 'text-white dark:text-black bg-neutral-500 hover:bg-neutral-400 dark:bg-neutral-400 hover:dark:bg-neutral-500'
                        : 'hover:bg-neutral-200 dark:hover:bg-neutral-800'
                    }`" @click="
                        filter.includes('accessory')
                            ? filter.splice(filter.indexOf('accessory'), 1)
                            : filter.push('accessory')
                        ">
                    アクセサリー
                </button>

                <button :class="`py-1 px-3 rounded-full text-sm border border-1 border-neutral-400 ${filter.includes('other')
                        ? 'text-white dark:text-black bg-neutral-500 hover:bg-neutral-400 dark:bg-neutral-400 hover:dark:bg-neutral-500'
                        : 'hover:bg-neutral-200 dark:hover:bg-neutral-800'
                    }`" @click="
                        filter.includes('other')
                            ? filter.splice(filter.indexOf('other'), 1)
                            : filter.push('other')
                        ">
                    その他
                </button>
            </div>

            <div v-if="!searching" class="w-full flex flex-col gap-6">
                <div v-if="
                    searchItems &&
                    searchItems.filter((item) => item.category === 208)
                        .length
                " class="w-full flex flex-col gap-3">
                    <UiTitle title="ベースアバター" icon="lucide:search" />
                    <div class="w-full flex flex-col gap-2 px-3">
                        <button v-for="i in searchItems.filter(
                            (item) => item.category === 208
                        )" :key="'search-result-' + i.id"
                            class="w-full h-10 pr-3 flex gap-2 items-center justify-between rounded-xl bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 hover:dark:bg-neutral-700"
                            @click="
                                emit('add', i.id);
                            emit('close');
                            ">
                            <NuxtImg :src="i.thumbnail" :alt="i.name" class="size-10 rounded-lg" />
                            <p
                                class="grow text-left text-sm line-clamp-1 break-all text-neutral-800 dark:text-neutral-200">
                                {{ i.name }}
                            </p>
                            <p
                                class="min-w-20 max-w-32 text-xs text-right line-clamp-1 break-all text-neutral-800 dark:text-neutral-200">
                                {{ i.shop }}
                            </p>
                        </button>
                    </div>
                </div>

                <div v-if="
                    searchItems &&
                    searchItems.filter((item) => item.category === 209)
                        .length
                " class="w-full flex flex-col gap-3">
                    <UiTitle title="衣装" icon="lucide:search" />
                    <div class="w-full flex flex-col gap-2 px-3">
                        <button v-for="i in searchItems.filter(
                            (item) => item.category === 209
                        )" :key="'search-result-' + i.id"
                            class="w-full h-10 pr-3 flex gap-2 items-center justify-between rounded-xl bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 hover:dark:bg-neutral-700"
                            @click="
                                emit('add', i.id);
                            emit('close');
                            ">
                            <NuxtImg :src="i.thumbnail" :alt="i.name" class="size-10 rounded-lg" />
                            <p
                                class="grow text-left text-sm line-clamp-1 break-all text-neutral-800 dark:text-neutral-200">
                                {{ i.name }}
                            </p>
                            <p
                                class="min-w-20 max-w-32 text-xs text-right line-clamp-1 break-all text-neutral-800 dark:text-neutral-200">
                                {{ i.shop }}
                            </p>
                        </button>
                    </div>
                </div>

                <div v-if="
                    searchItems &&
                    searchItems.filter((item) => item.category === 217)
                        .length
                " class="w-full flex flex-col gap-3">
                    <UiTitle title="アクセサリー" icon="lucide:search" />
                    <div class="w-full flex flex-col gap-2 px-3">
                        <button v-for="i in searchItems.filter(
                            (item) => item.category === 217
                        )" :key="'search-result-' + i.id"
                            class="w-full h-10 pr-3 flex gap-2 items-center justify-between rounded-xl bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 hover:dark:bg-neutral-700"
                            @click="
                                emit('add', i.id);
                            emit('close');
                            ">
                            <NuxtImg :src="i.thumbnail" :alt="i.name" class="size-10 rounded-lg" />
                            <p
                                class="grow text-left text-sm line-clamp-1 break-all text-neutral-800 dark:text-neutral-200">
                                {{ i.name }}
                            </p>
                            <p
                                class="min-w-20 max-w-32 text-xs text-right line-clamp-1 break-all text-neutral-800 dark:text-neutral-200">
                                {{ i.shop }}
                            </p>
                        </button>
                    </div>
                </div>

                <div v-if="
                    searchItems &&
                    searchItems.filter((item) => item.category !== 217)
                        .length
                " class="w-full flex flex-col gap-3">
                    <UiTitle title="その他" icon="lucide:search" />
                    <div class="w-full flex flex-col gap-2 px-3">
                        <button v-for="i in searchItems.filter(
                            (item) =>
                                item.category !== 208 &&
                                item.category !== 209 &&
                                item.category !== 217
                        )" :key="'search-result-' + i.id"
                            class="w-full h-10 pr-3 flex gap-2 items-center justify-between rounded-xl bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 hover:dark:bg-neutral-700"
                            @click="
                                emit('add', i.id);
                            emit('close');
                            ">
                            <NuxtImg :src="i.thumbnail" :alt="i.name" class="size-10 rounded-lg" />
                            <p
                                class="grow text-left text-sm line-clamp-1 break-all text-neutral-800 dark:text-neutral-200">
                                {{ i.name }}
                            </p>
                            <p
                                class="min-w-20 max-w-32 text-xs text-right line-clamp-1 break-all text-neutral-800 dark:text-neutral-200">
                                {{ i.shop }}
                            </p>
                        </button>
                    </div>
                </div>
            </div>

            <div v-if="searching" class="w-full h-80 flex items-center justify-center">
                <Icon name="i-svg-spinners-ring-resize" />
            </div>
        </div>
    </UCard>
</template>
