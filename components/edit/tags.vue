<script lang="ts" setup>
import {
    TagsInputInput,
    TagsInputItem,
    TagsInputItemDelete,
    TagsInputItemText,
    TagsInputRoot,
} from 'radix-vue';

const client = await useSBClient();

const tags = defineModel<string[]>({
    default: [],
});
const suggestion = ref<string[]>([]);
const loading = ref(false);

const add = (tag: string) => {
    if (!tags.value.includes(tag)) {
        tags.value.push(tag);
    }
    const input = document.getElementById('tagInput') as HTMLInputElement;
    if (input) {
        input.value = '';
    }
    input.focus();
};

const handle = () => {
    const input = document.getElementById('tagInput') as HTMLInputElement;

    suggestion.value = [];
    if (input?.value.length) {
        loading.value = true;
    } else {
        loading.value = false;
    }
    suggest();
};

const suggest = useDebounceFn(
    async () => {
        const input = document.getElementById('tagInput') as HTMLInputElement;

        if (input?.value.length) {
            console.log(input.value, tags.value);
            const { data, error } = await client.rpc('search_tags', {
                keywords: input.value,
                exclude: tags.value,
            });
            console.log(data);

            if (error) {
                suggestion.value = [];
                loading.value = false;
                return;
            }

            suggestion.value = data.map((i: { tag: string }) => i.tag);

            loading.value = false;
        } else {
            suggestion.value = [];
            loading.value = false;
        }
    },
    700,
    { maxWait: 1600 }
); // 700～1600ms デバウンス

watch(tags.value, () => {
    suggestion.value = [];
});
</script>

<template>
    <div class="w-full flex flex-col gap-1">
        <TagsInputRoot
            v-model="tags"
            class="flex gap-2 items-center p-2 rounded-lg w-full flex-wrap border border-1 border-neutral-400 dark:border-neutral-600 bg-neutral-200 dark:bg-neutral-900"
        >
            <TagsInputItem
                v-for="item in tags"
                :key="item"
                :value="item"
                class="dark:text-white text-black flex items-center justify-center gap-1.5 rounded-full px-1 py-1 border border-1 border-neutral-300 dark:border-neutral-600"
            >
                <TagsInputItemText class="text-sm pl-2" />
                <TagsInputItemDelete
                    class="p-1 rounded-full hover:bg-neutral-300 hover:dark:bg-neutral-700 flex items-center justify-center"
                >
                    <Icon name="lucide:x" />
                </TagsInputItemDelete>
            </TagsInputItem>

            <TagsInputInput
                id="tagInput"
                placeholder="タグを入力"
                class="text-sm focus:outline-none flex-1 bg-transparent px-1 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                @input="handle"
            />
        </TagsInputRoot>
        <div
            v-if="suggestion.length || loading"
            class="w-full flex flex-wrap gap-1 rounded-lg p-2 border border-1 border-neutral-400 dark:border-neutral-600 bg-neutral-200 dark:bg-neutral-900"
        >
            <Icon
                v-show="loading"
                name="svg-spinners:ring-resize"
                class="m-1.5 flex-shrink-0"
            />
            <button
                v-for="(i, index) in suggestion"
                :key="'tagSuggest-' + index"
                type="button"
                class="gap-1.5 rounded-full px-3 py-1 text-sm border border-1 border-neutral-400 dark:border-neutral-600 hover:bg-neutral-300 hover:dark:bg-neutral-600 transition ease-in-out duration-100"
                @click="add(i)"
            >
                {{ i }}
            </button>
        </div>
    </div>
</template>
