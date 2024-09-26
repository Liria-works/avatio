<script setup lang="ts">
import { ref, onMounted, watch, useId } from "vue";
import { Icon } from "@iconify/vue";
import { TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText, TagsInputRoot, Separator, } from "radix-vue";
import { useTextareaAutosize } from "@vueuse/core";

import Button from "../../components/button.vue";
import Title from "../../components/title.vue";
import ItemBoothEdit from "../../components/item/boothEdit.vue";
import ItemTiny from "../../components/item/tiny.vue";
import ModalAddAvatar from "../../components/modal/addAvatar.vue";

import type { Item } from "../../lib/item";
import { categoryAttr } from "../../lib/item";
import { addAvatarOpen } from "../../lib/store";
import { supabase } from "../../lib/supabase";
import { lineBreak } from "../../lib/text";
import { addToast } from "../../lib/ui";

const { textarea } = useTextareaAutosize()

const props = withDefaults(
    defineProps<{
        id?: number;
    }>(),
    {
        id: undefined,
    }
);

interface Items {
    avatar: Item | null;
    avatar_note: string;
    items: Item[];
}

const items = ref<Items>({
    avatar: null,
    avatar_note: "",
    items: [],
});

const title = ref<string>("");
const description = ref<string>("");
const tags = ref<string[]>([]);

const input_url = ref<string>("https://booth.pm/ja/items/3087170");
const adding = ref(false);
const publishing = ref(false);

const fetchingItem = ref<Item | null>(null);
const categorizedItems = ref<{ [key: string]: Item[] }>({});

const ERROR_MESSAGES = {
    URL_EMPTY: "URLを入力してください。",
    URL_INVALID: "無効なURLです。",
    ADD_ITEM_FAILED: "エラーによりアイテムの追加に失敗しました。",
    MULTIPLE_AVATAR: "ベースアバターを複数登録することはできません。",
    MULTIPLE_ITEM: "アイテムは重複して追加できません。",
    ITEM_IN_AVATAR: "アイテムはベースアバターとして登録されています。",
    PUBLISH_FAILED: "セットアップの公開に失敗しました。",
    UPDATE_FAILED: "セットアップの更新に失敗しました。",
    NO_AVATAR: "ベースアバターが登録されていません。",
    NO_ITEMS: "アイテムが登録されていません。",
    NO_TITLE: "セットアップ名が入力されていません。",
};

const AddItem = async (
    id: number | null = null,
) => {
    adding.value = true;

    if (id === null) {
        addToast({ description: ERROR_MESSAGES.URL_EMPTY });
        adding.value = false;
        return;
    }

    if (
        items.value.items.some(
            (item: { id: number }) => item.id === id
        )
    ) {
        addToast({ description: ERROR_MESSAGES.MULTIPLE_ITEM });
        fetchingItem.value = null;
        adding.value = false;
        return;
    }

    if (items.value.avatar && items.value.avatar.id === id) {
        addToast({ description: ERROR_MESSAGES.ITEM_IN_AVATAR });
        fetchingItem.value = null;
        adding.value = false;
        return;
    }

    const { data: itemData, error: itemError } = await supabase.from("items")
        .select("id, updated_at, outdated, category, name, thumbnail, price, shop_id(id, name, thumbnail, verified), nsfw")
        .eq("id", id)
        .maybeSingle();

    if (!itemData) {
        addToast({ description: ERROR_MESSAGES.ADD_ITEM_FAILED });
        fetchingItem.value = null;
        adding.value = false;
        return;
    }

    fetchingItem.value = itemData as unknown as Item;

    if (itemData.category === 208) {
        addAvatarOpen.set(true);
        adding.value = false;
        return;
    }

    handleAddItem(itemData as unknown as Item);
};

const handleAddAvatar = (data: Item) => {
    items.value.avatar = data;
}

const handleAddItem = (data: Item) => {
    items.value.items.push({
        id: data.id,
        category: data.category,
        note: "",
        unsupported: false,
        updated_at: data.updated_at,
        name: data.name,
        thumbnail: data.thumbnail,
        price: data.price,
        shop_id: data.shop_id,
        nsfw: data.nsfw,
    });

    input_url.value = "";
    adding.value = false;
}

const AddItemFromURL = async () => {
    if (!input_url.value) {
        addToast({ description: ERROR_MESSAGES.URL_EMPTY });
        return;
    }

    try { new URL(input_url.value); } catch (_) {
        addToast({ description: ERROR_MESSAGES.URL_INVALID });
        return;
    }

    const url = new URL(input_url.value);

    if (url.hostname.split(".").slice(-2)[1] !== 'pm' || url.hostname.split(".").slice(-2)[0] !== 'booth') {
        addToast({ description: ERROR_MESSAGES.URL_INVALID });
        return;
    }

    const id = url.pathname.split("/").slice(-1)[0];

    if (!Number.isInteger(Number(id))) {
        addToast({ description: ERROR_MESSAGES.URL_INVALID });
        return;
    }

    AddItem(Number(id));
};

const RemoveItem = (id: number) => {
    items.value.items = items.value.items.filter((item) => item.id !== id);
}

// const { files, open, reset, onChange } = useFileDialog({
//     accept: "image/png, image/jpeg, image/tiff", // Set to accept only image files
//     multiple: false,
// });

// const imagePreview = ref<string | ArrayBuffer | null>(null);

// onChange((files) => {
//     if (files?.length) {
//         const file = files[0];
//         const reader = new FileReader();
//         reader.onload = (e) => {
//             if (!e.target) return;
//             imagePreview.value = e.target.result;
//         };
//         reader.readAsDataURL(file);
//     } else {
//         imagePreview.value = null;
//     }
// });

// const PublishSetup = async () => {
//     publishing.value = true;

//     if (!items.value.avatar) {
//         toast("ベースアバターが登録されていません。");
//         publishing.value = false;
//         return;
//     }

//     let image = null;
//     if (files.value && files.value.length > 0) {
//         image = files.value[0];
//     }

//     try {
//         const id = await usePublishSetup(
//             {
//                 name: title.value,
//                 description: description.value,
//                 tags: tags.value,
//                 avatar: items.value.avatar,
//                 avatar_note: items.value.avatar_note,
//                 items: items.value.items,
//             },
//             image
//         );
//         reset();
//         toast("セットアップを公開しました。");
//     } catch (error) {
//         console.error(error);
//         toast("セットアップの公開に失敗しました。");
//     } finally {
//         publishing.value = false;
//     }
// };

// const UpdateSetup = async () => {
//     // const client = await useSupabaseClient();

//     const setup: {
//         name: string;
//         description: string;
//         tags: string[];
//         avatar: number | null;
//         avatar_note: string;
//     } = {
//         name: title.value,
//         description: lineBreak(description.value),
//         tags: tags.value,
//         avatar: items.value.avatar,
//         avatar_note: lineBreak(items.value.avatar_note),
//     };

//     try {
//         await useUpdateSetup(props.id, setup, items.value);

//         toast("セットアップを更新しました。");
//     } catch (error) {
//         console.error(error);

//         toast("セットアップの更新に失敗しました。");
//     }
// };

const PasteFromClipboard = async () => {
    try {
        const text = await navigator.clipboard.readText();
        input_url.value = text;
    } catch (err) {
        console.error("Failed to read clipboard contents: ", err);
    }
};

// onBeforeRouteLeave(
//     (to: unknown, from: unknown, next: (arg0: boolean | undefined) => void) => {
//         if (skip_router_hook.value) {
//             next(true);
//             return;
//         }
//         if (
//             title.value ||
//             description.value ||
//             tags.value.length ||
//             items.value.avatar ||
//             items.value.items.length
//         ) {
//             const answer = window.confirm(
//                 "入力された内容が破棄されます。よろしいですか？"
//             );
//             if (answer) {
//                 next(true);
//             } else {
//                 next(false);
//             }
//         } else {
//             next(true);
//         }
//     }
// );

const quickAvatars = ref<
    | { id: number; name: string; short: string | null; thumbnail: string }[]
    | null
>(null);

const quickAvatarsOwned = ref<
    | { id: number; name: string; short: string | null; thumbnail: string }[]
    | null
>(null);

onMounted(async () => {
    // quickAvatars.value = await useGetPopularAvatars();
    // quickAvatarsOwned.value = await useGetOwnedAvatars();

    if (props.id) {
        const { data } = await supabase
            .from("setups")
            .select(
                "id, created_at, name, description, avatar, avatar_note, tags, author, image, setup_items(item_id, note, unsupported)"
            )
            .eq("id", props.id)
            .single();

        if (data) {
            title.value = data.name;
            description.value = data.description;
            tags.value = data.tags;
            // todo: アバターとアイテムのデータを登録
        }
    }
});

watch(items.value,
    () => {
        categorizedItems.value = {};

        if (items.value.items.length) {
            for (const item of items.value.items) {
                let category: string;
                if (item.category === 209) {
                    category = "cloth";
                } else if (item.category === 217) {
                    category = "accessory";
                } else {
                    category = "other";
                }

                if (!categorizedItems.value[category]) {
                    categorizedItems.value[category] = [];
                }
                categorizedItems.value[category].push(item);
            }
        }

        console.log(categorizedItems.value);
    }
);
</script>

<template>
    <ModalAddAvatar :item="fetchingItem"
        @add-as-avatar="if (fetchingItem) { handleAddAvatar(fetchingItem) }; addAvatarOpen.set(false)"
        @add-as-item="if (fetchingItem) { handleAddItem(fetchingItem) }; addAvatarOpen.set(false)" />

    <div w-full px-3 pt-4 gap-8 flex flex-col justify-start items-start>
        <div w-full gap-6 flex items-center justify-between>
            <div w-full gap-2 pt-1 flex flex-col>
                <input v-model="title" placeholder="セットアップ名を入力" w-full bg-transparent outline-none font-semibold
                    text="2xl neutral-900 dark:neutral-100 placeholder:neutral-400 placeholder:dark:neutral-600" />
                <Separator decorative h-px w-full :bg="title.length < 25 ? 'neutral-500' : 'red-400'" />
            </div>
            <div flex gap-2 items-center>
                <Button label="公開" :icon="!publishing ? 'lucide:upload' : 'svg-spinners:ring-resize'" />

                <Button tooltip="破棄" icon="lucide:trash" :icon-size="18" padding="p-3" />
            </div>
        </div>

        <div w-full gap-8 flex flex-col lg:flex-row items-start>
            <div w-full gap-8 flex flex-col items-center>
                <div w-full gap-4 flex flex-col items-center>
                    <Button icon="lucide:search" label="アバター・アイテムを検索" size="w-full" rounded="rounded-2xl" @click="" />
                    <!-- <UModal v-model="modalSearchItem" :ui="{
                            background: 'bg-white dark:bg-neutral-100',
                            ring: 'ring-0',
                            rounded: 'rounded-xl',
                            inner: 'fixed inset-auto top-10 left-0 right-0 overflow-y-auto',
                        }">
                            <ModalSearchItem @add="AddItem" @close="modalSearchItem = false" />
                        </UModal> -->

                    <div w-full gap-1 flex items-center>

                        <div w-full px-3 h-10 rounded-2xl flex bg="neutral-200 dark:neutral-900"
                            class="border border-1 border-neutral-400 dark:border-neutral-500">
                            <input v-model="input_url" :disabled="adding" placeholder="BOOTH URLからベースアバターを追加" w-full
                                bg-transparent outline-none
                                text="sm neutral-900 dark:neutral-100 placeholder:neutral-400 placeholder:dark:neutral-600"
                                @keyup.enter="AddItemFromURL" />
                        </div>

                        <Button :icon="!adding
                            ? 'lucide:plus'
                            : 'svg-spinners:ring-resize'
                            " :disabled="adding" label="追加" size="h-10" rounded="rounded-2xl"
                            @click="AddItemFromURL" />
                    </div>
                </div>

                <div class="w-full gap-4 flex flex-col">
                    <Title label="ベースアバター" icon="lucide:person-standing" />

                    <ItemBoothEdit v-if="items.avatar" size="lg" :avatar="true" :id="items.avatar.id"
                        :note="items.avatar.note" :unsupported="items.avatar.unsupported" :name="items.avatar.name"
                        :thumbnail="items.avatar.thumbnail" :price="items.avatar.price"
                        :shop="items.avatar.shop_id.name" :shopId="items.avatar.shop_id.id"
                        :shopThumbnail="items.avatar.shop_id.thumbnail" :shopVerified="items.avatar.shop_id.verified"
                        :nsfw="items.avatar.nsfw" :updated_at="items.avatar.updated_at"
                        @update:note="items.avatar.note = $event"
                        @update:unsupported="items.avatar.unsupported = $event" @remove="items.avatar = null" />

                    <div v-if="!items.avatar" w-full p-5 flex flex-col gap-5 rounded-xl
                        class="border border-1 border-neutral-400 dark:border-neutral-500">
                        <div v-if="quickAvatarsOwned?.length" class="w-full flex flex-col gap-3">
                            <Title label="あなたのセットアップから" icon="lucide:user-round" />
                            <div class="justify-start items-center gap-1.5 flex flex-row flex-wrap w-full">
                                <button v-for="i in quickAvatarsOwned" :key="'suggest-avatar-' + i.id"
                                    @click="AddItem(i.id)">
                                    <ItemTiny :label="i.short ? i.short : i.name" :thumbnail="i.thumbnail"
                                        class="bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 hover:dark:bg-neutral-700" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="!Object.keys(categorizedItems).length" my-10 font-medium text-neutral-400>
                    アイテムが登録されていません
                </div>

                <div v-if="Object.keys(categorizedItems).length" w-full flex flex-col gap-3>
                    <div v-for="i in Object.keys(categorizedItems)" w-full flex flex-col gap-3>
                        <Title :label="categoryAttr[i].label" :icon="categoryAttr[i].icon" />

                        <ItemBoothEdit v-for="item in categorizedItems[i]" :id="item.id" :key="'item-' + item.id"
                            :note="item.note" :unsupported="item.unsupported" :name="item.name"
                            :thumbnail="item.thumbnail" :price="item.price" :shop="item.shop_id.name"
                            :shopId="item.shop_id.id" :shopThumbnail="item.shop_id.thumbnail"
                            :shopVerified="item.shop_id.verified" :nsfw="item.nsfw" :updated_at="item.updated_at"
                            @update:note="item.note = $event" @update:unsupported="item.unsupported = $event"
                            @remove="RemoveItem(item.id)" />
                    </div>
                </div>
            </div>

            <Separator />

            <div w-full lg:w-96 gap-8 flex flex-col justify-start items-start>

                <div w-full flex flex-col gap-3>
                    <div w-full flex items-center justify-between>
                        <Title label="説明" icon="lucide:text" />

                        <span text-sm pr-1 :class="`${description.length < 141
                            ? 'text-neutral-500 dark:text-neutral-500'
                            : 'text-red-500 dark:text-red-400'
                            }`">
                            {{ description.length }} / 140
                        </span>
                    </div>
                    <div w-full p-3 rounded-lg bg="neutral-200 dark:neutral-900"
                        :class="`border border-1 ${description.length < 141 ? 'border-neutral-400 dark:border-neutral-600' : 'border-red-400'}`">
                        <textarea ref="textarea" v-model="description" placeholder="説明を入力" rows="3" resize-none w-full
                            bg-transparent outline-none
                            text="sm neutral-900 dark:neutral-100 placeholder:neutral-400 placeholder:dark:neutral-600" />
                    </div>
                </div>

                <div w-full flex flex-col gap-3>
                    <div w-full flex items-center justify-between>
                        <Title label="タグ" icon="lucide:tags" />

                        <span text-sm pr-1 :class="`${tags.length < 11
                            ? 'text-neutral-500 dark:text-neutral-500'
                            : 'text-red-500 dark:text-red-400'
                            }`">
                            {{ tags.length }} / 10
                        </span>
                    </div>

                    <TagsInputRoot v-model="tags" flex gap-2 items-center p-2 rounded-lg w-full flex-wrap
                        bg="neutral-200 dark:neutral-900"
                        class="border border-1 border-neutral-400 dark:border-neutral-600">
                        <TagsInputItem v-for="item in tags" :key="item" :value="item" flex items-center justify-center
                            gap-2 rounded-md p-1 text="neutral-900 dark:neutral-100" bg="neutral-100 dark:neutral-700"
                            class="border border-1 border-neutral-300 dark:border-neutral-600">
                            <TagsInputItemText pl-1.5 text="sm neutral-900 dark:neutral-100" />
                            <TagsInputItemDelete mr-0.5 rounded flex items-center justify-center
                                bg="hover:neutral-300 hover:dark:neutral-700">
                                <Icon icon="lucide:x" />
                            </TagsInputItemDelete>
                        </TagsInputItem>

                        <TagsInputInput placeholder="タグを入力" text-sm flex-1 px-1 bg-transparent focus:outline-none
                            text="neutral-900 dark:neutral-100 placeholder:neutral-400 placeholder:dark:neutral-600" />
                    </TagsInputRoot>
                </div>
            </div>
        </div>
    </div>
</template>