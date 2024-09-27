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
const skip_router_hook = ref(false);

const modalSearchItem = ref(false);

const id = route.query.id;
const input_url = ref<string>("");
const adding = ref(false);
const publishing = ref(false);

interface Items {
    avatar: SetupItem | null;
    avatar_note: string;
    items: SetupItem[];
}

const items = ref<Items>({
    avatar: null,
    avatar_note: "",
    items: [],
});

const categorizedItems = ref<{ [key: string]: SetupItem[] }>({});
const categoryAttr: { [key: string]: { label: string; icon: string } } = {
    cloth: { label: "衣装", icon: "lucide:shirt" },
    accessory: { label: "アクセサリー", icon: "lucide:star" },
    other: { label: "その他", icon: "lucide:package" },
};

const title = ref<string>("");
const description = ref<string>("");
const tags = ref<string[]>([]);

const ERROR_MESSAGES = {
    EMPTY_URL: "URLを入力してください。",
    INVALID_URL: "無効なURLです。",
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

const AddItem = async (id: number) => {
    adding.value = true;

    const data = await useFetchBooth(id);

    // outdated === true だった場合に、細かくエラーの理由を説明するほうが、
    // ユーザーが何回も追加を試さなくてもよくなりそう

    if (!data) {
        useAddToast(ERROR_MESSAGES.ADD_ITEM_FAILED);
        adding.value = false;
        return;
    }

    handleData(data);
    adding.value = false;
};

const handleData = (data: Item) => {
    if (data.category === 208) {
        if (!items.value.avatar) {
            items.value.avatar = {
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
                outdated: data.outdated,
            };
            input_url.value = "";
        } else {
            useAddToast(
                ERROR_MESSAGES.MULTIPLE_AVATAR,
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
                note: "",
                unsupported: false,
                updated_at: data.updated_at,
                name: data.name,
                thumbnail: data.thumbnail,
                price: data.price,
                shop_id: data.shop_id,
                nsfw: data.nsfw,
                outdated: data.outdated,
            });
            input_url.value = "";
        }
    }
};

const AddItemFromURL = async () => {
    if (!input_url.value) {
        useAddToast(ERROR_MESSAGES.EMPTY_URL);
        return;
    }

    try {
        new URL(input_url.value);
    } catch (e) {
        console.error(e);
        useAddToast(ERROR_MESSAGES.INVALID_URL);
        return;
    }

    const url = new URL(input_url.value);

    if (
        url.hostname.split(".").slice(-2)[1] !== "pm" ||
        url.hostname.split(".").slice(-2)[0] !== "booth"
    ) {
        useAddToast(ERROR_MESSAGES.INVALID_URL);
        return;
    }

    const id = url.pathname.split("/").slice(-1)[0];

    if (!Number.isInteger(Number(id))) {
        useAddToast(ERROR_MESSAGES.INVALID_URL);
        return;
    }

    AddItem(Number(id));
};

const RemoveItem = (id: number) => {
    items.value.items = items.value.items.filter((item) => item.id !== id);
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
        useAddToast(ERROR_MESSAGES.NO_AVATAR);
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
                avatar: items.value.avatar.id,
                avatar_note: items.value.avatar_note,
                items: items.value.items,
            },
            image
        );
        reset();
        useAddToast("セットアップを公開しました。");
        skip_router_hook.value = true;
        router.push(`/setup/${id}`);
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
        avatar: items.value.avatar.id,
        avatar_note: useLineBreak(items.value.avatar_note),
    };

    try {
        await useUpdateSetup(Number(id), setup, items.value);

        useAddToast("セットアップを更新しました。");
        skip_router_hook.value = true;
        router.push(`/setup/${id}`);
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

const quickAvatarsOwned = ref<
    | { id: number; name: string; short: string | null; thumbnail: string }[]
    | null
>(null);

onMounted(async () => {
    // quickAvatarsOwned.value = await useGetOwnedAvatars();
    // const client = await useSBClient();
    // if (id) {
    //     const { data } = await client
    //         .from("setups")
    //         .select(
    //             "id, created_at, name, description, avatar, avatar_note, tags, author, image, setup_items(item_id, note, unsupported)"
    //         )
    //         .eq("id", Number(id))
    //         .single();
    //     if (data) {
    //         title.value = data.name;
    //         description.value = data.description;
    //         tags.value = data.tags;
    //         items.value.avatar = data.avatar;
    //         items.value.avatar_note = data.avatar_note;
    //         for (const item of data.setup_items) {
    //             AddItem(item.item_id, item.note, item.unsupported);
    //         }
    //     }
    // }
});

watch(items.value, () => {
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
});
</script>

<template>
    <div class="flex-col justify-start items-start gap-8 flex w-full px-3">
        <div class="flex flex-row gap-10 items-center justify-between w-full">
            <div class="w-full flex flex-col gap-2 pt-1">
                <UInput
                    v-model="title"
                    placeholder="セットアップ名を入力"
                    size="xl"
                    :padded="false"
                    variant="none"
                    :ui="{ size: { xl: 'text-2xl font-bold' } }"
                    class="w-full"
                />
                <UDivider
                    :ui="{
                        border: {
                            base: `${
                                title.length < 25
                                    ? 'border-neutral-300 dark:border-neutral-600'
                                    : 'border-red-400 dark:border-red-600'
                            }`,
                        },
                    }"
                    class="w-full"
                />
            </div>
            <div class="flex gap-2 items-center">
                <UPopover
                    v-if="!route.query.id"
                    mode="hover"
                    :popper="{ placement: 'top' }"
                    :ui="{
                        rounded: 'rounded-xl',
                        ring: 'ring-1 ring-gray-300 dark:ring-gray-600',
                    }"
                    class="flex"
                >
                    <UButton
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

                    <template #panel>
                        <div
                            class="flex flex-col gap-1 text-xs px-4 py-2 rounded-lg text-neutral-100"
                        >
                            <p v-if="!title">
                                {{ ERROR_MESSAGES.NO_TITLE }}
                            </p>
                            <p v-if="!items.avatar">
                                {{ ERROR_MESSAGES.NO_AVATAR }}
                            </p>
                            <p v-if="!items.items.length">
                                {{ ERROR_MESSAGES.NO_ITEMS }}
                            </p>

                            <p
                                v-if="
                                    title && items.avatar && items.items.length
                                "
                            >
                                セットアップを投稿
                            </p>
                        </div>
                    </template>
                </UPopover>

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

                <UiButton
                    tooltip="破棄"
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
                                placeholder="BOOTH URLからアバター・アイテムを追加"
                                block
                                :ui="{
                                    rounded: 'rounded-xl',
                                    icon: { trailing: { pointer: '' } },
                                }"
                                @keyup.enter="AddItemFromURL"
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
                            @click="AddItemFromURL"
                        />
                    </div>

                    <div class="w-full flex items-center gap-2">
                        <UButton
                            block
                            icon="lucide:search"
                            label="アバター・アイテムを検索"
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

                <UiCategory
                    title="ベースアバター"
                    icon="lucide:person-standing"
                >
                    <div
                        v-if="!items.avatar"
                        class="w-full p-5 flex flex-col gap-5 rounded-lg bg-white dark:bg-neutral-700"
                    >
                        <div
                            v-if="quickAvatarsOwned?.length"
                            class="w-full flex flex-col gap-3"
                        >
                            <UiTitle
                                label="あなたのセットアップから"
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
                                        :label="i.short ? i.short : i.name"
                                        :thumbnail="i.thumbnail"
                                        class="bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 hover:dark:bg-neutral-700"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    <ItemBoothEdit
                        v-if="items.avatar"
                        :id="items.avatar.id"
                        :key="'item-' + items.avatar.id"
                        size="lg"
                        :note="items.avatar_note"
                        :name="items.avatar.name"
                        :thumbnail="items.avatar.thumbnail"
                        :price="items.avatar.price"
                        :shop="items.avatar.shop_id.name"
                        :shop-id="items.avatar.shop_id.id"
                        :shop-thumbnail="items.avatar.shop_id.thumbnail"
                        :shop-verified="items.avatar.shop_id.verified"
                        :nsfw="items.avatar.nsfw"
                        :updated-at="items.avatar.updated_at"
                        @remove="items.avatar = null"
                        @update:note="items.avatar_note = $event"
                    />
                </UiCategory>

                <div
                    v-if="!Object.keys(categorizedItems).length"
                    my-10
                    font-medium
                    text-neutral-400
                >
                    アイテムが登録されていません
                </div>

                <div
                    v-if="Object.keys(categorizedItems).length"
                    class="w-full flex flex-col gap-3"
                >
                    <div
                        v-for="i in Object.keys(categorizedItems)"
                        :key="useId()"
                        class="w-full flex flex-col gap-3"
                    >
                        <UiTitle
                            :label="categoryAttr[i].label"
                            :icon="categoryAttr[i].icon"
                        />

                        <ItemBoothEdit
                            v-for="item in categorizedItems[i]"
                            :id="item.id"
                            :key="'item-' + item.id"
                            :note="item.note"
                            :unsupported="item.unsupported"
                            :name="item.name"
                            :thumbnail="item.thumbnail"
                            :price="item.price"
                            :shop="item.shop_id.name"
                            :shop-id="item.shop_id.id"
                            :shop-thumbnail="item.shop_id.thumbnail"
                            :shop-verified="item.shop_id.verified"
                            :nsfw="item.nsfw"
                            :updated-at="item.updated_at"
                            @update:note="item.note = $event"
                            @update:unsupported="item.unsupported = $event"
                            @remove="RemoveItem(item.id)"
                        />
                    </div>
                </div>
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
                <UiCategory title="説明" icon="lucide:text">
                    <div class="w-full flex flex-col gap-1 items-end">
                        <div
                            :class="`w-full p-3 rounded-lg border border-1 bg-neutral-200 dark:bg-neutral-900 ${
                                description.length < 141
                                    ? 'border-neutral-400 dark:border-neutral-600'
                                    : 'border-red-400 dark:border-red-600'
                            }`"
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

                        <span
                            :class="`text-sm pr-1 ${
                                description.length < 141
                                    ? 'text-neutral-500 dark:text-neutral-500'
                                    : 'text-red-500 dark:text-red-400'
                            }`"
                        >
                            {{ description.length }} / 140
                        </span>
                    </div>
                </UiCategory>

                <UiCategory title="タグ" icon="lucide:tags">
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
                </UiCategory>
            </div>
        </div>
    </div>
</template>
