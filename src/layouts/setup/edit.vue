<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import {
    TagsInputInput,
    TagsInputItem,
    TagsInputItemDelete,
    TagsInputItemText,
    TagsInputRoot,
    Separator,
} from "radix-vue";

import Button from "../../components/button.vue";
import Title from "../../components/title.vue";

import { supabase } from "../../lib/supabase";
import { lineBreak } from "../../lib/text";

const props = withDefaults(
    defineProps<{
        id?: number;
    }>(),
    {
        id: undefined,
    }
);

const modalSearchItem = ref(false);

const input_url = ref<string>("");
const adding = ref(false);
const publishing = ref(false);

interface Items {
    avatar: number | null;
    avatar_note: string;
    items: {
        id: number;
        category: number;
        note: string;
        unsupported: boolean;
    }[];
}

const items = ref<Items>({
    avatar: null,
    avatar_note: "",
    items: [],
});

const title = ref<string>("");
const description = ref<string>("");
const tags = ref<string[]>([]);

const ERROR_MESSAGES = {
    EMPTY_URL: "URLを入力してください。",
    ADD_ITEM_FAILED: "エラーによりアイテムの追加に失敗しました。",
    MULTIPLE_AVATAR: "ベースアバターを複数登録することはできません。",
    MULTIPLE_ITEM: "アイテムは重複して追加できません。",
};

const toast = (message: string, description = "") => {
    console.log(message, description);
};

const AddItem = async (
    id: number | null = null,
    url: string | null = null,
    note = "",
    unsupported = false
) => {
    adding.value = true;

    if (id === null && !input_url.value) {
        toast(ERROR_MESSAGES.EMPTY_URL);
        adding.value = false;
        return;
    }

    let data;
    // if (id) {
    //     data = await useFetchBooth({ id: id, url: null });
    // } else {
    //     data = await useFetchBooth({ id: null, url: input_url.value });
    // }

    await supabase.from("items")
        .select("id, updated_at, outdated, category, name, thumbnail, price, shop_id(id, name, thumbnail, verified), nsfw")
        .eq("id", id)
        .maybeSingle();

    if (!data) {
        toast(ERROR_MESSAGES.ADD_ITEM_FAILED);
        adding.value = false;
        return;
    }

    handleData(data, note, unsupported);
    adding.value = false;
};

const handleData = (
    data: { category: number; id: number },
    note = "",
    unsupported = false
) => {
    if (data.category === 208) {
        if (!items.value.avatar) {
            items.value.avatar = data.id;
            input_url.value = "";
        } else {
            toast(
                "ベースアバターを複数登録することはできません。",
                "ベースアバターを置き換えるオプションの実装"
            );
        }
    } else {
        if (
            items.value.items.some(
                (item: { id: number }) => item.id === data.id
            )
        ) {
            toast(ERROR_MESSAGES.MULTIPLE_ITEM);
        } else {
            items.value.items.push({
                id: data.id,
                category: data.category,
                note: note,
                unsupported: unsupported,
            });
            input_url.value = "";
        }
    }
};

// const { files, open, reset, onChange } = useFileDialog({
//     accept: "image/png, image/jpeg, image/tiff", // Set to accept only image files
//     multiple: false,
// });

const imagePreview = ref<string | ArrayBuffer | null>(null);

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
            items.value.avatar = data.avatar;
            items.value.avatar_note = data.avatar_note;
            for (const item of data.setup_items) {
                AddItem(item.item_id, item.note, item.unsupported);
            }
        }
    }
});
</script>

<template>
    <div class="flex-col justify-start items-start gap-8 flex w-full px-3">
        <div class="flex flex-row gap-10 items-center justify-between w-full">
            <div class="w-full flex flex-col gap-2 pt-1">
                <input v-model="title" placeholder="セットアップ名を入力" class="w-full" />
                <div class="w-full" />
            </div>
            <div class="flex gap-2 items-center">
                <Button label="公開"
                    :icon="!publishing ? 'i-heroicons-arrow-up-tray-16-solid' : 'i-svg-spinners-ring-resize'"
                    :@click="PublishSetup" />

                <Button tooltip="破棄" icon="lucide:trash" :icon-size="18" />
            </div>
        </div>

        <div class="flex flex-col md:flex-row items-start gap-8 w-full">
            <div class="flex-col items-center gap-8 flex w-full">
                <div class="w-full flex flex-col items-center gap-4">
                    <div class="flex gap-1 items-center w-full">
                        <div
                            class="w-full p-1 rounded-xl border border-1 border-neutral-400 dark:border-neutral-500 bg-neutral-200 dark:bg-neutral-900">
                            <input v-model="input_url" :disabled="adding" placeholder="BOOTH URLからアバター・アイテムを追加"
                                @keyup.enter="AddItem()">
                            </input>
                        </div>
                        <Button :icon="!adding
                            ? 'i-heroicons-plus'
                            : 'i-svg-spinners-ring-resize'
                            " :disabled="adding" label="追加" @click="AddItem()" />
                    </div>

                    <div class="w-full flex items-center gap-2">
                        <Button icon="lucide:search" label="アバター・アイテムを検索" @click="modalSearchItem = true" />
                        <!-- <UModal v-model="modalSearchItem" :ui="{
                            background: 'bg-white dark:bg-neutral-100',
                            ring: 'ring-0',
                            rounded: 'rounded-xl',
                            inner: 'fixed inset-auto top-10 left-0 right-0 overflow-y-auto',
                        }">
                            <ModalSearchItem @add="AddItem" @close="modalSearchItem = false" />
                        </UModal> -->
                    </div>
                </div>

                <!-- <ACategory title="ベースアバター" icon="lucide:person-standing">
                    <div v-if="!items.avatar"
                        class="w-full p-5 flex flex-col gap-5 rounded-lg bg-white dark:bg-neutral-700">
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
                        <div v-if="quickAvatars" class="w-full flex flex-col gap-3">
                            <Title label="人気のアバター" icon="lucide:sparkles" infomation="Avatioの投稿数から算出" />
                            <div class="justify-start items-center gap-1.5 flex flex-row flex-wrap w-full">
                                <button v-for="i in quickAvatars" :key="'suggest-avatar-' + i.id"
                                    @click="AddItem(i.id)">
                                    <ItemTiny :label="i.short ? i.short : i.name" :thumbnail="i.thumbnail"
                                        class="bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 hover:dark:bg-neutral-700" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <ItemBoothEdit v-if="items.avatar" :id="items.avatar" :key="'item-' + items.avatar" size="lg"
                        :avatar="true" @remove="items.avatar = null" @update:note="items.avatar_note = $event"
                        :note="items.avatar_note" />
                </ACategory> -->

                <div v-if="!items.items.length" class="my-10 font-medium text-neutral-400">
                    アイテムが登録されていません
                </div>

                <ItemBoothEdit v-for="i in items.items" :id="i.id" :key="'item-' + i.id" @remove=""
                    @update:note="i.note = $event" @update:unsupported="i.unsupported = $event" :note="i.note"
                    :unsupported="i.unsupported" />
            </div>

            <Separator />

            <div class="w-full md:w-96 flex-col justify-start items-start gap-8 flex">

                <div w-full flex flex-col gap-3>
                    <Title label="説明" icon="lucide:text" />
                    <div w-full flex flex-col gap-1 items-end>
                        <div w-full p-3 rounded-lg bg="neutral-200 dark:neutral-900"
                            :class="`border border-1 ${description.length < 141 ? 'border-neutral-400 dark:border-neutral-600' : 'border-red-400 dark:border-red-600'}`">
                            <input v-model="description" placeholder="説明を入力" class="w-full" />
                        </div>

                        <span text-sm pr-1 :class="`${description.length < 141
                            ? 'text-neutral-500 dark:text-neutral-500'
                            : 'text-red-500 dark:text-red-400'
                            }`">
                            {{ description.length }} / 140
                        </span>
                    </div>
                </div>

                <div w-full flex flex-col gap-3>
                    <Title label="タグ" icon="lucide:tags" />

                    <TagsInputRoot v-model="tags" flex gap-2 items-center p-2 rounded-lg w-full flex-wrap
                        bg="neutral-200 dark:neutral-900"
                        class="border border-1 border-neutral-400 dark:border-neutral-600">
                        <TagsInputItem v-for="item in tags" :key="item" :value="item" flex items-center justify-center
                            gap-2 rounded-md p-1 text="dark:white black" bg="neutral-100 dark:neutral-700"
                            class="border border-1 border-neutral-300 dark:border-neutral-600">
                            <TagsInputItemText text-sm pl-1.5 />
                            <TagsInputItemDelete mr-0.5 rounded flex items-center justify-center
                                bg="hover:neutral-300 hover:dark:neutral-700">
                                <Icon icon="lucide:x" />
                            </TagsInputItemDelete>
                        </TagsInputItem>

                        <TagsInputInput placeholder="タグを入力" text-sm flex-1 px-1 bg-transparent focus:outline-none
                            text="placeholder:neutral-400 dark:placeholder:neutral-500" />
                    </TagsInputRoot>
                </div>
            </div>
        </div>
    </div>
</template>