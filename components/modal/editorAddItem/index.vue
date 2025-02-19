<script lang="ts" setup>
const vis = defineModel<boolean>({
    default: false,
});
const emit = defineEmits(['add']);

const searchWord = ref<string>('');
const searchItems = ref<
    {
        id: number;
        name: string;
        thumbnail: string;
        shop: string;
        category: string;
    }[]
>([]);
const categoryFilter = ref<string[]>([]);
const searching = ref<boolean>(false);

const client = useSupabaseClient();

const handleInputChange = useDebounceFn(
    async (value) => {
        searching.value = true;

        if (!value.length) return (searching.value = false);

        const { data } = await client.rpc('search_items', {
            keyword: value.toString(),
            exclude_categories: categoryFilter.value.length
                ? Object.values(itemCategories())
                      .map((c) => c.id)
                      .filter((id) => !categoryFilter.value.includes(id))
                : [],
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
watch(categoryFilter, () => {
    handleInputChange(searchWord.value);
});
watchEffect(() => {
    if (vis.value) {
        searchWord.value = '';
        searchItems.value = [];
    }
});
</script>

<template>
    <Modal
        v-model="vis"
        :anchor="searchWord.length ? 'top' : 'center'"
        class="transition-all mt-12 p-0 rounded-none border-0 bg-transparent dark:bg-transparent shadow-none"
    >
        <ModalEditorAddItemUrl
            v-if="!searchWord.length"
            class="mb-3"
            @add="emit('add', $event)"
        />

        <ModalEditorAddItemSearch v-model="searchWord" />

        <div
            v-if="searchWord.length"
            class="p-1 shrink-0 flex items-center gap-1 overflow-x-auto overflow-y-visible"
        >
            <Button
                v-for="c in Object.values(itemCategories())"
                :label="c.label"
                :class="[
                    'px-3 py-2 rounded-full',
                    c.id
                        ? categoryFilter.includes(c.id)
                            ? 'bg-zinc-700 dark:bg-zinc-300 hover:bg-zinc-500 hover:dark:bg-zinc-400 text-zinc-100 dark:text-zinc-900'
                            : 'bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 hover:dark:bg-zinc-600'
                        : '',
                ]"
                @click="
                    () => {
                        if (categoryFilter.includes(c.id))
                            categoryFilter = categoryFilter.filter(
                                (v) => v !== c.id
                            );
                        else categoryFilter = [...categoryFilter, c.id];
                    }
                "
            />
        </div>

        <ModalEditorAddItemSearchedItems
            v-if="searchWord.length"
            v-model:items="searchItems"
            v-model:searching="searching"
            @add="emit('add', $event)"
        />
    </Modal>
</template>
