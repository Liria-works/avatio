<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { useStore } from '@nanostores/vue';
import { searchOpen } from '../../lib/modal';
import { supabase } from '../../lib/supabase';
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle,
} from '@headlessui/vue';
import { Icon } from '@iconify/vue';

import Title from '../title.vue';
import ItemTiny from '../item/tiny.vue';

const $searchOpen = useStore(searchOpen);

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
    // avatarsOwned.value = await useGetOwnedAvatars();
    // avatars.value = await useGetPopularAvatars();
    // tags.value = await useGetPopularTags();

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

        searchResultsSetup.value = await supabase
            .rpc("search_setups", {
                keywords: searchWord.value,
            })
            .select("id, name, author, avatar, image")
            .limit(6); // 取得数を制限しています
        searchResultsSetup.value = searchResultsSetup.value.data;

        // for (const i of searchResultsSetup.value) {
        //     // if (i.image) {
        //     //     i.image = await useGetImage(i.image);
        //     // }
        //     i.avatar = await useFetchBooth({ id: i.avatar, url: null });
        //     if (i.avatar.avatar_details) {
        //         i.avatar_short = i.avatar.avatar_details.short_ja;
        //     } else {
        //         i.avatar_short = null;
        //     }
        //     i.avatar = i.avatar.thumbnail;
        // }

        // searchResultsAvatar.value = await supabase
        //     .rpc("search_items", {
        //         keywords: value.toString(),
        //     })
        //     .select("id, name, thumbnail, shop, category")
        //     .eq("category", 208)
        //     .limit(6); // 取得数を制限しています
        // searchResultsAvatar.value = searchResultsAvatar.value.data;

        // searching.value = false;
    },
    400,
    { maxWait: 1000 }
); // 400～1000ms デバウンス

watch(searchWord, (newValue) => {
    handleInputChange(newValue);
});

const close = () => {
    searchOpen.set(!$searchOpen);
};
</script>

<template>
    <TransitionRoot :show="$searchOpen" as="template">
        <Dialog as="div" :open="$searchOpen" @close="close()" class="relative z-10">
            <TransitionChild enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
                leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-black/25" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4 text-center">
                    <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95">
                        <DialogPanel class="w-full p-6 flex flex-col gap-3 max-w-md rounded-xl bg-white text-left">
                            <div class="flex items-center">
                                <input v-model="searchWord" autofocus icon="lucide:search" placeholder="キーワード検索"
                                    class="grow mt-1 outline-none" @keyup.enter="close(); (`/search?q=${encodeURIComponent(searchWord)}`);
                                    " />
                                <Icon icon="lucide:arrow-right" class="size-5 text-neutral-500 dark:text-neutral-500" />
                            </div>

                            <div v-if="!loading && !searchWord.length"
                                class="w-full flex flex-col items-center gap-6 p-3">
                                <div v-if="avatarsOwned" class="w-full flex flex-col gap-3">
                                    <Title label="あなたのセットアップから" icon="lucide:user-round" />
                                    <div class="justify-start items-center gap-1.5 flex flex-row flex-wrap w-full">
                                        <a v-for="i in avatarsOwned" :key="'suggest-avatar-' + i.id"
                                            :to="{ name: 'search', query: { item: i.id } }" @click="close()">
                                            <ItemTiny :label="i.short ? i.short : i.name" :thumbnail="i.thumbnail"
                                                class="bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 hover:dark:bg-neutral-700" />
                                        </a>
                                    </div>
                                </div>

                                <div v-if="avatars" class="w-full flex flex-col gap-3">
                                    <Title label="人気のアバターから" icon="lucide:sparkles" />
                                    <div class="justify-start items-center gap-1.5 flex flex-row flex-wrap w-full">
                                        <a v-for="i in avatars" :key="'suggest-avatar-' + i.id"
                                            :to="{ name: 'search', query: { item: i.id } }" @click="close()">
                                            <ItemTiny :label="i.short ? i.short : i.name" :thumbnail="i.thumbnail"
                                                class="bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 hover:dark:bg-neutral-700" />
                                        </a>
                                    </div>
                                </div>

                                <div v-if="tags" class="w-full flex flex-col gap-3">
                                    <Title label="タグから" icon="lucide:tags" />
                                    <div class="justify-start items-center gap-1.5 flex flex-row flex-wrap w-full">
                                        <a v-for="i in tags" :key="'suggest-avatar-' + i"
                                            :to="{ name: 'search', query: { tag: i } }" @click="close()">
                                            <button
                                                class="px-2.5 py-1 rounded-lg justify-center items-center flex gap-1 border border-1 border-neutral-300 dark:border-neutral-600 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 hover:dark:bg-neutral-700">
                                                <Icon icon="lucide:tag"
                                                    class="size-4 min-w-max min-h-max text-neutral-500 dark:text-neutral-400" />
                                                <p
                                                    class="text-sm font-normal whitespace-nowrap text-black dark:text-white">
                                                    {{ i }}
                                                </p>
                                            </button>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div v-if="loading && !searchWord.length"
                                class="w-full h-80 flex items-center justify-center">
                                <Icon icon="svg-spinners:ring-resize" />
                            </div>

                            <div v-if="searchWord.length" class="w-full max-h-[60vh] overflow-auto flex flex-col gap-5">
                                <div class="flex items-center gap-2">
                                    <button :class="filterSetup
                                        ? 'py-1 px-3 rounded-full text-sm border border-1 border-neutral-400 text-white dark:text-black bg-neutral-500 hover:bg-neutral-400 dark:bg-neutral-400 hover:dark:bg-neutral-500'
                                        : 'py-1 px-3 rounded-full text-sm border border-1 border-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800'
                                        " @click="filterSetup = !filterSetup">
                                        セットアップ
                                    </button>
                                    <button :class="filterAvatar
                                        ? 'py-1 px-3 rounded-full text-sm border border-1 border-neutral-400 text-white dark:text-black bg-neutral-500 hover:bg-neutral-400 dark:bg-neutral-400 hover:dark:bg-neutral-500'
                                        : 'py-1 px-3 rounded-full text-sm border border-1 border-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800'
                                        " @click="filterAvatar = !filterAvatar">
                                        ベースアバター
                                    </button>
                                </div>

                                <div v-if="!searching" class="w-full flex flex-col gap-6">
                                    <div v-if="
                                        searchResultsSetup &&
                                        searchResultsSetup.length &&
                                        ((filterSetup && !filterAvatar) ||
                                            (filterSetup && filterAvatar) ||
                                            (!filterSetup && !filterAvatar))
                                    " class="w-full flex flex-col gap-3">
                                        <Title label="セットアップ" icon="lucide:search" />
                                        <div class="w-full flex flex-col gap-2 px-3">
                                            <a v-for="i in searchResultsSetup" :key="'search-result-' + i.id"
                                                :to="{ name: 'setup-id', params: { id: i.id } }"
                                                class="w-full rounded-xl" @click="close()">
                                                <button
                                                    class="w-full h-12 pr-3 flex gap-2 items-center justify-between rounded-lg border border-1 border-neutral-300 dark:border-neutral-600 bg-neutral-100 hover:bg-neutral-300 dark:bg-neutral-800 hover:dark:bg-neutral-700">
                                                    <img :src="i.image ? i.image : i.avatar" :alt="i.name"
                                                        class="w-16 h-full rounded-lg object-cover p-1" />
                                                    <p
                                                        class="grow text-left text-sm line-clamp-1 break-all text-neutral-800 dark:text-neutral-200">
                                                        {{ i.name }}
                                                    </p>
                                                    <p
                                                        class="min-w-20 max-w-32 text-xs text-right line-clamp-1 break-all text-neutral-800 dark:text-neutral-200">
                                                        {{ i.avatar_short.ja }}
                                                    </p>
                                                </button>
                                            </a>
                                        </div>
                                    </div>

                                    <div v-if="
                                        searchResultsAvatar &&
                                        searchResultsAvatar.length &&
                                        ((!filterSetup && filterAvatar) ||
                                            (filterSetup && filterAvatar) ||
                                            (!filterSetup && !filterAvatar))
                                    " class="w-full flex flex-col gap-3">
                                        <Title label="ベースアバター" icon="lucide:search" />
                                        <div class="w-full flex flex-col gap-2 px-3">
                                            <button v-for="i in searchResultsAvatar" :key="'search-result-' + i.id"
                                                class="w-full h-10 pr-3 flex gap-2 items-center justify-between rounded-lg border border-1 border-neutral-300 dark:border-neutral-600 bg-neutral-100 hover:bg-neutral-300 dark:bg-neutral-800 hover:dark:bg-neutral-700">
                                                <img :src="i.thumbnail" :alt="i.name" class="size-10 rounded-lg p-1" />
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
                                    <Icon icon="svg-spinners:ring-resize" :width="20" :height="20"
                                        class="text-neutral-600" />
                                </div>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>
