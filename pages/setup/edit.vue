<script setup lang="ts">
import {
    TagsInputInput,
    TagsInputItem,
    TagsInputItemDelete,
    TagsInputItemText,
    TagsInputRoot,
} from "radix-vue";

const route = useRoute();
const router = useRouter();
const client = await useSBClient();
const skip_router_hook = ref(false);

const modalSearchItem = ref(false);

const id = route.query.id;
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

const AddItem = async (
    id: number | null = null,
    note: string = "",
    unsupported: boolean = false
) => {
    adding.value = true;

    if (id === null && !input_url.value) {
        useAddToast(ERROR_MESSAGES.EMPTY_URL);
        adding.value = false;
        return;
    }

    let data;
    if (id) {
        data = await useFetchBooth({ id: id, url: null });
    } else {
        data = await useFetchBooth({ id: null, url: input_url.value });
    }

    if (!data) {
        useAddToast(ERROR_MESSAGES.ADD_ITEM_FAILED);
        adding.value = false;
        return;
    }

    handleData(data, note, unsupported);
    adding.value = false;
};

const handleData = (
    data: { category: number; id: number },
    note: string = "",
    unsupported: boolean = false
) => {
    if (data.category === 208) {
        if (!items.value.avatar) {
            items.value.avatar = data.id;
            input_url.value = "";
        } else {
            useAddToast(
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
            useAddToast(ERROR_MESSAGES.MULTIPLE_ITEM);
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

const { files, open, reset, onChange } = useFileDialog({
    accept: "image/png, image/jpeg, image/tiff", // Set to accept only image files
    multiple: false,
});

const imagePreview = ref<string | ArrayBuffer | null>(null);

onChange((files) => {
    if (files?.length) {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            if (!e.target) return;
            imagePreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        imagePreview.value = null;
    }
});

const PublishSetup = async () => {
    publishing.value = true;

    if (!items.value.avatar) {
        useAddToast("ベースアバターが登録されていません。");
        publishing.value = false;
        return;
    }

    let image = null;
    if (files.value && files.value.length > 0) {
        image = files.value[0];
    }

    try {
        const id = await usePublishSetup(
            {
                name: title.value,
                description: description.value,
                tags: tags.value,
                avatar: items.value.avatar,
                avatar_note: items.value.avatar_note,
                items: items.value.items,
            },
            image
        );
        reset();
        useAddToast("セットアップを公開しました。");
        skip_router_hook.value = true;
        router.push("/setup/" + id);
    } catch (error) {
        console.error(error);
        useAddToast("セットアップの公開に失敗しました。");
    } finally {
        publishing.value = false;
    }
};

const UpdateSetup = async () => {
    // const client = await useSupabaseClient();

    const setup: {
        name: string;
        description: string;
        tags: string[];
        avatar: number | null;
        avatar_note: string;
    } = {
        name: title.value,
        description: useLineBreak(description.value),
        tags: tags.value,
        avatar: items.value.avatar,
        avatar_note: useLineBreak(items.value.avatar_note),
    };

    try {
        await useUpdateSetup(Number(id), setup, items.value);

        useAddToast("セットアップを更新しました。");
        skip_router_hook.value = true;
        router.push("/setup/" + id);
    } catch (error) {
        console.error(error);

        useAddToast("セットアップの更新に失敗しました。");
    }
};

const PasteFromClipboard = async () => {
    try {
        const text = await navigator.clipboard.readText();
        input_url.value = text;
    } catch (err) {
        console.error("Failed to read clipboard contents: ", err);
    }
};

onBeforeRouteLeave(
    (to: unknown, from: unknown, next: (arg0: boolean | undefined) => void) => {
        if (skip_router_hook.value) {
            next(true);
            return;
        }
        if (
            title.value ||
            description.value ||
            tags.value.length ||
            items.value.avatar ||
            items.value.items.length
        ) {
            const answer = window.confirm(
                "入力された内容が破棄されます。よろしいですか？"
            );
            if (answer) {
                next(true);
            } else {
                next(false);
            }
        } else {
            next(true);
        }
    }
);

const quickAvatars = ref<
    { id: number; name: string; short: Languages; thumbnail: string }[] | null
>(null);

const quickAvatarsOwned = ref<
    { id: number; name: string; short: Languages; thumbnail: string }[] | null
>(null);

onMounted(async () => {
    quickAvatars.value = await useGetPopularAvatars();
    quickAvatarsOwned.value = await useGetOwnedAvatars();

    if (id) {
        const { data } = await client
            .from("setups")
            .select(
                "id, created_at, name, description, avatar, avatar_note, tags, author, image, setup_items(item_id, note, unsupported)"
            )
            .eq("id", Number(id))
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
            <UInput
                v-model="title"
                placeholder="セットアップ名を入力"
                size="xl"
                :padded="false"
                variant="none"
                :ui="{ size: { xl: 'text-2xl font-bold' } }"
                class="w-full"
            />
            <div class="flex gap-2 items-center">
                <UButton
                    v-if="!route.query.id"
                    :disabled="
                        publishing ||
                        !title ||
                        !items.avatar ||
                        !items.items.length
                    "
                    truncate
                    size="lg"
                    label="公開"
                    :icon="
                        !publishing
                            ? 'i-heroicons-arrow-up-tray-16-solid'
                            : 'i-svg-spinners-ring-resize'
                    "
                    :ui="{
                        rounded: 'rounded-full',
                        inline: 'pr-4',
                        truncate: 'whitespace-nowrap',
                    }"
                    @click="PublishSetup"
                />

                <UButton
                    v-else
                    :disabled="!title || !items.avatar || !items.items.length"
                    truncate
                    size="lg"
                    label="更新"
                    icon="i-heroicons-arrow-up-tray-16-solid"
                    :ui="{
                        rounded: 'rounded-full',
                        inline: 'pr-4',
                        truncate: 'whitespace-nowrap',
                    }"
                    @click="UpdateSetup"
                />

                <AButton
                    icon="lucide:trash"
                    :icon-size="18"
                    class="size-10"
                    @click="router.back()"
                />
            </div>
        </div>

        <div class="flex flex-col md:flex-row items-start gap-8 w-full">
            <div class="flex-col items-center gap-8 flex w-full">
                <div class="w-full flex flex-col items-center gap-4">
                    <div class="flex gap-1 items-center w-full">
                        <div
                            class="w-full p-1 rounded-xl border border-1 border-neutral-400 dark:border-neutral-500 bg-neutral-200 dark:bg-neutral-900"
                        >
                            <UInput
                                v-model="input_url"
                                :disabled="adding"
                                autocomplete="off"
                                variant="none"
                                size="sm"
                                placeholder="BOOTH URLからアイテムを追加"
                                block
                                :ui="{
                                    rounded: 'rounded-xl',
                                    icon: { trailing: { pointer: '' } },
                                }"
                                @keyup.enter="AddItem()"
                            >
                                <template #trailing>
                                    <UButton
                                        v-show="!input_url"
                                        color="gray"
                                        variant="link"
                                        icon="i-heroicons-clipboard"
                                        :padded="false"
                                        @click="PasteFromClipboard"
                                    />
                                    <UButton
                                        v-show="input_url !== ''"
                                        color="gray"
                                        variant="link"
                                        icon="i-heroicons-x-mark-20-solid"
                                        :padded="false"
                                        @click="input_url = ''"
                                    />
                                </template>
                            </UInput>
                        </div>
                        <UButton
                            :icon="
                                !adding
                                    ? 'i-heroicons-plus'
                                    : 'i-svg-spinners-ring-resize'
                            "
                            :disabled="adding"
                            label="追加"
                            size="sm"
                            :ui="{
                                rounded: 'rounded-xl',
                            }"
                            class="pr-3 h-[40px]"
                            @click="AddItem()"
                        />
                    </div>

                    <div class="w-full flex items-center gap-2">
                        <UButton
                            block
                            icon="lucide:search"
                            label="アイテムを検索"
                            variant="outline"
                            :ui="{
                                rounded: 'rounded-xl',
                                variant: {
                                    outline:
                                        'ring-neutral-400 dark:ring-neutral-500 hover:bg-neutral-300 hover:dark:bg-neutral-750',
                                },
                            }"
                            class="h-9"
                            @click="modalSearchItem = true"
                        />
                        <UModal
                            v-model="modalSearchItem"
                            :ui="{
                                background: 'bg-white dark:bg-neutral-100',
                                ring: 'ring-0',
                                rounded: 'rounded-xl',
                                inner: 'fixed inset-auto top-10 left-0 right-0 overflow-y-auto',
                            }"
                        >
                            <ModalSearchItem
                                @add="AddItem"
                                @close="modalSearchItem = false"
                            />
                        </UModal>
                    </div>
                </div>

                <ACategory title="ベースアバター" icon="lucide:person-standing">
                    <div
                        v-if="!items.avatar"
                        class="w-full p-5 flex flex-col gap-5 rounded-lg bg-white dark:bg-neutral-700"
                    >
                        <div
                            v-if="quickAvatarsOwned?.length"
                            class="w-full flex flex-col gap-3"
                        >
                            <ATitle
                                title="あなたのセットアップから"
                                icon="lucide:user-round"
                            />
                            <div
                                class="justify-start items-center gap-1.5 flex flex-row flex-wrap w-full"
                            >
                                <button
                                    v-for="i in quickAvatarsOwned"
                                    :key="'suggest-avatar-' + i.id"
                                    @click="AddItem(i.id)"
                                >
                                    <ItemTiny
                                        :label="i.short ? i.short.ja : i.name"
                                        :thumbnail="i.thumbnail"
                                        class="bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 hover:dark:bg-neutral-700"
                                    />
                                </button>
                            </div>
                        </div>
                        <div
                            v-if="quickAvatars"
                            class="w-full flex flex-col gap-3"
                        >
                            <ATitle
                                title="人気のアバター"
                                icon="lucide:sparkles"
                                infomation="Avatioの投稿数から算出"
                            />
                            <div
                                class="justify-start items-center gap-1.5 flex flex-row flex-wrap w-full"
                            >
                                <button
                                    v-for="i in quickAvatars"
                                    :key="'suggest-avatar-' + i.id"
                                    @click="AddItem(i.id)"
                                >
                                    <ItemTiny
                                        :label="i.short ? i.short.ja : i.name"
                                        :thumbnail="i.thumbnail"
                                        class="bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 hover:dark:bg-neutral-700"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    <ItemBoothEdit
                        v-if="items.avatar"
                        :id="items.avatar"
                        :key="'item-' + items.avatar"
                        size="lg"
                        :avatar="true"
                        @remove="items.avatar = null"
                        @update:note="items.avatar_note = $event"
                        :note="items.avatar_note"
                    />
                </ACategory>

                <div
                    v-if="!items.items.length"
                    class="my-10 font-medium text-neutral-400"
                >
                    アイテムが登録されていません
                </div>

                <ACategory
                    v-if="
                        items.items.filter((item) => item.category === 209)
                            .length
                    "
                    title="衣装"
                    icon="lucide:shirt"
                >
                    <ItemBoothEdit
                        v-for="i in items.items.filter(
                            (item) => item.category === 209
                        )"
                        :id="i.id"
                        :key="'item-' + i.id"
                        @remove="
                            items.items = items.items.filter(
                                (item) => item.id !== i.id
                            )
                        "
                        @update:note="i.note = $event"
                        @update:unsupported="i.unsupported = $event"
                        :note="i.note"
                        :unsupported="i.unsupported"
                    />
                </ACategory>

                <ACategory
                    v-if="
                        items.items.filter((item) => item.category === 217)
                            .length
                    "
                    title="アクセサリー"
                    icon="lucide:star"
                >
                    <ItemBoothEdit
                        v-for="i in items.items.filter(
                            (item) => item.category === 217
                        )"
                        :id="i.id"
                        :key="'item-' + i.id"
                        @remove="
                            items.items = items.items.filter(
                                (item) => item.id !== i.id
                            )
                        "
                        @update:note="i.note = $event"
                        @update:unsupported="i.unsupported = $event"
                        :note="i.note"
                        :unsupported="i.unsupported"
                    />
                </ACategory>

                <ACategory
                    v-if="
                        items.items.filter(
                            (item) =>
                                item.category !== 209 &&
                                item.category !== 217 &&
                                item.category !== 208
                        ).length
                    "
                    title="その他"
                    icon="lucide:box"
                >
                    <ItemBoothEdit
                        v-for="i in items.items.filter(
                            (item) =>
                                item.category !== 209 &&
                                item.category !== 217 &&
                                item.category !== 208
                        )"
                        :id="i.id"
                        :key="'item-' + i.id"
                        @remove="
                            items.items = items.items.filter(
                                (item) => item.id !== i.id
                            )
                        "
                        @update:note="i.note = $event"
                        @update:unsupported="i.unsupported = $event"
                        :note="i.note"
                        :unsupported="i.unsupported"
                    />
                </ACategory>
            </div>

            <UDivider
                :ui="{
                    border: {
                        base: 'border-neutral-300 dark:border-neutral-600 mx-3 my-2',
                    },
                }"
                class="block md:hidden"
            />

            <div
                class="w-full md:w-96 flex-col justify-start items-start gap-8 flex"
            >
                <div v-if="!id" class="w-full flex flex-col gap-6 items-start">
                    <button
                        v-if="!imagePreview"
                        @click="open()"
                        class="h-40 flex flex-col items-center justify-center w-full rounded-xl hover:bg-neutral-200 dark:bg-black/10 dark:hover:bg-black/15 border-4 border-dashed border-neutral-300 dark:border-neutral-600"
                    >
                        <Icon
                            name="lucide:plus"
                            class="text-4xl text-neutral-400 dark:text-neutral-500"
                        />
                        <span
                            class="font-medium text-neutral-400 dark:text-neutral-500"
                            >画像を追加</span
                        >
                    </button>
                    <div
                        v-if="imagePreview"
                        class="flex flex-col items-center gap-1 h-fit"
                    >
                        <div class="relative w-auto h-fit">
                            <NuxtImg
                                :src="imagePreview.toString()"
                                alt="Image Preview"
                                class="object-contain max-h-64 rounded-xl"
                            />
                            <button
                                @click="reset()"
                                class="size-8 absolute top-2 right-2 bg-black/30 hover:bg-black/50 rounded-full p-1 backdrop-blur-lg"
                            >
                                <Icon
                                    name="lucide:x"
                                    class="size-full bg-neutral-100"
                                />
                            </button>
                        </div>
                        <div
                            v-if="files"
                            class="w-full line-clamp-1 break-all text-xs px-1 text-neutral-600 dark:text-neutral-400"
                        >
                            {{ files[0].name }}
                        </div>
                    </div>
                    <PopupUploadImage class="mt-[-16px]" />
                </div>
                <ACategory title="説明" icon="lucide:text">
                    <div
                        class="w-full p-3 rounded-lg border border-1 border-neutral-400 dark:border-neutral-600 bg-neutral-200 dark:bg-neutral-900"
                    >
                        <UTextarea
                            v-model="description"
                            autoresize
                            placeholder="説明を入力"
                            :padded="false"
                            variant="none"
                            class="w-full"
                        />
                    </div>
                </ACategory>

                <ACategory title="タグ" icon="lucide:tags">
                    <TagsInputRoot
                        v-model="tags"
                        class="flex gap-2 items-center p-2 rounded-lg w-full flex-wrap border border-1 border-neutral-400 dark:border-neutral-600 bg-neutral-200 dark:bg-neutral-900"
                    >
                        <TagsInputItem
                            v-for="item in tags"
                            :key="item"
                            :value="item"
                            class="dark:text-white text-black flex items-center justify-center gap-2 rounded-md p-1 border border-1 border-neutral-300 dark:border-neutral-600 bg-neutral-100 dark:bg-neutral-700"
                        >
                            <TagsInputItemText class="text-sm pl-1.5" />
                            <TagsInputItemDelete
                                class="mr-0.5 rounded hover:bg-neutral-300 hover:dark:bg-neutral-700 flex items-center justify-center"
                            >
                                <Icon name="lucide:x" />
                            </TagsInputItemDelete>
                        </TagsInputItem>

                        <TagsInputInput
                            placeholder="タグを入力"
                            class="text-sm focus:outline-none flex-1 bg-transparent px-1 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                        />
                    </TagsInputRoot>
                </ACategory>
            </div>
        </div>
    </div>
</template>
