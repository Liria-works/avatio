<script lang="ts" setup>
interface Items {
    avatar: SetupItem | null;
    avatar_note: string;
    items: SetupItem[];
}

const items = defineModel<Items>({
    default: { avatar: null, avatar_note: '', items: [] },
});

const adding = ref(false);
const modalSearchItem = ref(false);
const modalReplaceAvatar = ref(false);

const categorizedItems = ref<{ [key: string]: SetupItem[] }>({});
const categoryAttr: { [key: string]: { label: string; icon: string } } = {
    cloth: { label: '衣装', icon: 'lucide:shirt' },
    accessory: { label: 'アクセサリー', icon: 'lucide:star' },
    other: { label: 'その他', icon: 'lucide:package' },
};
const quickAvatarsOwned = ref<
    | { id: number; name: string; short: string | null; thumbnail: string }[]
    | null
>(null);
const inputUrl = ref<string>('');
const replaceAvatar = ref<SetupItem | null>(null);

const pasteFromClipboard = async () => {
    try {
        const text = await navigator.clipboard.readText();
        inputUrl.value = text;
    } catch (err) {
        console.error('Failed to read clipboard contents: ', err);
    }
};

const addItem = async (id: number) => {
    adding.value = true;

    const data = await useFetchBooth(id);

    // outdated === true だった場合に、細かくエラーの理由を説明するほうが、
    // ユーザーが何回も追加を試さなくてもよくなりそう

    if (!data) {
        useAddToast(ERROR_MESSAGES.ADD_ITEM_FAILED);
        adding.value = false;
        return;
    }

    const d = { ...data, note: '', unsupported: false };

    if (data.category === 208) {
        if (items.value.avatar) {
            if (items.value.avatar.id === d.id) {
                useAddToast(ERROR_MESSAGES.SAME_AVATAR);
            } else {
                replaceAvatar.value = d;
                modalReplaceAvatar.value = true;
            }
        } else {
            items.value.avatar = d;
            inputUrl.value = '';
        }
    } else {
        if (items.value.items.some((item) => item.id === data.id)) {
            useAddToast(ERROR_MESSAGES.MULTIPLE_ITEM);
        } else {
            items.value.items.push(d);
            inputUrl.value = '';
        }
    }
    adding.value = false;
};

const addItemFromURL = async () => {
    if (!inputUrl.value) {
        useAddToast(ERROR_MESSAGES.EMPTY_URL);
        return;
    }

    try {
        new URL(inputUrl.value);
    } catch (e) {
        console.error(e);
        useAddToast(ERROR_MESSAGES.INVALID_URL);
        return;
    }

    const url = new URL(inputUrl.value);

    if (
        url.hostname.split('.').slice(-2)[1] !== 'pm' ||
        url.hostname.split('.').slice(-2)[0] !== 'booth'
    ) {
        useAddToast(ERROR_MESSAGES.INVALID_URL);
        return;
    }

    const id = url.pathname.split('/').slice(-1)[0];

    if (!Number.isInteger(Number(id))) {
        useAddToast(ERROR_MESSAGES.INVALID_URL);
        return;
    }

    addItem(Number(id));
};

const removeItem = (id: number) => {
    items.value.items = items.value.items.filter((item) => item.id !== id);
};

const categorize = () => {
    categorizedItems.value = {};

    if (items.value.items.length) {
        for (const item of items.value.items) {
            let category: string;
            if (item.category === 209) {
                category = 'cloth';
            } else if (item.category === 217) {
                category = 'accessory';
            } else {
                category = 'other';
            }

            if (!categorizedItems.value[category]) {
                categorizedItems.value[category] = [];
            }
            categorizedItems.value[category].push(item);
        }
    }
};

watch(items.value, () => {
    categorize();
});
</script>

<template>
    <div class="flex-col items-center gap-8 flex w-full">
        <div class="w-full flex flex-col gap-4 items-stretch">
            <div class="flex gap-1 items-center">
                <div
                    class="w-full p-1 rounded-lg border border-1 border-neutral-400 dark:border-neutral-500 bg-neutral-200 dark:bg-neutral-900"
                >
                    <UInput
                        v-model="inputUrl"
                        :disabled="adding"
                        autocomplete="off"
                        variant="none"
                        size="sm"
                        placeholder="BOOTH URLからアバター・アイテムを追加"
                        block
                        :ui="{
                            rounded: 'rounded-lg',
                            icon: { trailing: { pointer: '' } },
                        }"
                        @keyup.enter="addItemFromURL"
                    >
                        <template #trailing>
                            <UButton
                                v-show="!inputUrl"
                                color="gray"
                                variant="link"
                                icon="i-heroicons-clipboard"
                                :padded="false"
                                @click="pasteFromClipboard"
                            />
                            <UButton
                                v-show="inputUrl !== ''"
                                color="gray"
                                variant="link"
                                icon="i-heroicons-x-mark-20-solid"
                                :padded="false"
                                @click="inputUrl = ''"
                            />
                        </template>
                    </UInput>
                </div>
                <UiButton
                    :disabled="adding"
                    :icon="
                        !adding
                            ? 'i-heroicons-plus'
                            : 'i-svg-spinners-ring-resize'
                    "
                    label="追加"
                    class="pr-3 h-[40px]"
                    @click="addItemFromURL"
                />
            </div>
            <UiButton
                icon="lucide:search"
                label="アバター・アイテムを検索"
                class="h-9 w-full"
                @click="modalSearchItem = true"
            />
        </div>

        <UiCategory title="ベースアバター" icon="lucide:person-standing">
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
                            @click="addItem(i.id)"
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
            class="my-10 font-medium text-neutral-400"
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
                    @remove="removeItem(item.id)"
                />
            </div>
        </div>
    </div>

    <ModalSearchItem v-model="modalSearchItem" @add="addItem" />

    <ModalReplaceAvatar
        v-model="modalReplaceAvatar"
        :from="items.avatar"
        :to="replaceAvatar"
        @accept="((inputUrl = ''), (items.avatar = replaceAvatar))"
        @close="modalReplaceAvatar = false"
    />
</template>
