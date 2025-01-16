<script lang="ts" setup>
const vis = defineModel<boolean>({
    default: false,
});
const emit = defineEmits(['close', 'add']);

const router = useRouter();
const client = await useSBClient();

const categories = {
    avatar: {
        string: 'avatar',
        id: 208,
        name: 'ベースアバター',
        icon: 'lucide:person-standing',
    },
    cloth: {
        string: 'cloth',
        id: 209,
        name: '衣装',
        icon: 'lucide:shirt',
    },
    accessory: {
        string: 'accessory',
        id: 217,
        name: 'アクセサリー',
        icon: 'lucide:star',
    },
    other: {
        string: 'other',
        id: null,
        name: 'その他',
        icon: 'lucide:package',
    },
};

const searchWord = ref<string>('');
const searchItems = ref<
    {
        id: number;
        name: string;
        thumbnail: string;
        shop: string;
        category: number;
    }[]
>([]);
const categoryFilter = ref<string[]>([]);
const searching = ref<boolean>(false);

const handleInputChange = useDebounceFn(
    async (value) => {
        searching.value = true;

        if (!value.length) return (searching.value = false);

        const { data } = await client.rpc('search_items', {
            keyword: value.toString(),
            exclude_categories: categoryFilter.value.length ? [208] : [],
            num: 20,
        });
        searchItems.value = data ?? [];

        searching.value = false;
    },
    400,
    { maxWait: 1000 }
); // 400～1000ms デバウンス

watch(searchWord, (newValue) => {
    handleInputChange(newValue);
});
watch(categoryFilter.value, () => {
    handleInputChange(searchWord.value);
});
</script>

<template>
    <ModalBase v-model="vis">
        <template #header>
            <UInput
                v-model="searchWord"
                autofocus
                icon="lucide:search"
                size="lg"
                variant="none"
                :trailing="false"
                :padded="false"
                placeholder="アイテム名検索"
                class="mt-1"
                @keyup.enter="
                    emit('close');
                    router.push(`/search?q=${encodeURIComponent(searchWord)}`);
                "
            >
                <template #trailing>
                    <Icon
                        name="lucide:arrow-right"
                        class="size-5 text-500 dark:text-500"
                    />
                </template>
            </UInput>
        </template>

        <div
            v-if="!searchWord.length"
            class="w-full flex flex-col items-center gap-6 p-3"
        >
            <p class="text-sm text-zinc-500">
                アイテムの検索は、Avatio上に登録されているアイテムのみを検索します。<br />
                BOOTHなどの外部サイトに登録されているアイテムすべてを検索することはできません。
            </p>
        </div>

        <div
            v-if="searchWord.length"
            class="w-full max-h-[60vh] flex flex-col gap-5"
        >
            <!-- <div class="px-1 pt-1 flex items-center gap-1">
                <ButtonBase
                    v-for="c in categories"
                    :label="c.name"
                    :class="[
                        'px-3 py-2 rounded-full',
                        c.string
                            ? categoryFilter.includes(c.string)
                                ? 'bg-zinc-500 dark:bg-zinc-500'
                                : ''
                            : '',
                    ]"
                    @click="changeCategoryFilter(c.string)"
                />
            </div> -->

            <div
                v-if="!searching"
                class="w-full flex flex-col gap-6 overflow-auto"
            >
                <template v-if="searchItems.length">
                    <div
                        v-for="c in categories"
                        :key="useId()"
                        class="empty:hidden w-full flex flex-col gap-3"
                    >
                        <template
                            v-if="
                                searchItems.filter((item) =>
                                    c.id
                                        ? item.category === c.id
                                        : !Object.values(categories)
                                              .map((value) => value.id)
                                              .includes(item.category)
                                ).length
                            "
                        >
                            <UiTitle :label="c.name" :icon="c.icon" />
                            <div class="flex flex-col gap-2 px-3">
                                <ButtonBase
                                    v-for="i in searchItems.filter((item) =>
                                        c.id
                                            ? item.category === c.id
                                            : !Object.values(categories)
                                                  .map((value) => value.id)
                                                  .includes(item.category)
                                    )"
                                    :key="useId()"
                                    variant="flat"
                                    class="w-full p-1 pr-2"
                                    @click="
                                        emit('add', i.id);
                                        emit('close');
                                    "
                                >
                                    <NuxtImg
                                        :src="i.thumbnail"
                                        :alt="i.name"
                                        class="size-10 rounded-lg object-cover"
                                    />
                                    <p
                                        class="grow text-left text-sm line-clamp-1 break-all text-zinc-800 dark:text-zinc-200"
                                    >
                                        {{ i.name }}
                                    </p>
                                    <p
                                        class="min-w-20 max-w-32 text-xs text-right line-clamp-1 break-all text-zinc-600 dark:text-zinc-400"
                                    >
                                        {{ i.shop }}
                                    </p>
                                </ButtonBase>
                            </div>
                        </template>
                    </div>
                </template>
            </div>

            <div
                v-if="searching"
                class="w-full h-80 flex items-center justify-center"
            >
                <Icon name="i-svg-spinners-ring-resize" />
            </div>
        </div>
    </ModalBase>
</template>
