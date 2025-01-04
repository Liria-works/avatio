<script lang="ts" setup>
const emit = defineEmits(['undo', 'redo']);

const items = defineModel<SetupItem[]>({
    default: [],
});

const adding = ref(false);
const modalSearchItem = ref(false);
const modalReplaceAvatar = ref(false);

const categorizedItems = computed(() => {
    const categorized: { [key: string]: SetupItem[] } = {};

    if (items.value.length) {
        for (const item of items.value) {
            let category: string;
            if (item.category === 208) category = 'avatar';
            else if (item.category === 209) category = 'cloth';
            else if (item.category === 217) category = 'accessory';
            else category = 'other';

            if (!categorized[category]) categorized[category] = [];

            categorized[category].push(item);
        }
    }

    return categorized;
});

const categoryAttr: { [key: string]: { label: string; icon: string } } = {
    avatar: { label: 'ベースアバター', icon: 'lucide:person-standing' },
    cloth: { label: '衣装', icon: 'lucide:shirt' },
    accessory: { label: 'アクセサリー', icon: 'lucide:star' },
    other: { label: 'その他', icon: 'lucide:package' },
};

const quickAvatarsOwned = ref<
    { id: number; name: string; thumbnail: string }[] | null
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
        if (items.value.some((i) => i.category === 208)) {
            if (items.value.filter((i) => i.category === 208)[0].id === d.id)
                useAddToast(ERROR_MESSAGES.SAME_AVATAR);
            else {
                replaceAvatar.value = d;
                modalReplaceAvatar.value = true;
            }
        } else {
            items.value.push(d);
            inputUrl.value = '';
        }
    } else {
        if (items.value.some((item) => item.id === data.id))
            useAddToast(ERROR_MESSAGES.MULTIPLE_ITEM);
        else {
            items.value.push(d);
            inputUrl.value = '';
        }
    }

    adding.value = false;
};

const addItemFromURL = async () => {
    if (!inputUrl.value) return useAddToast(ERROR_MESSAGES.EMPTY_URL);

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
    )
        return useAddToast(ERROR_MESSAGES.INVALID_URL);

    const id = url.pathname.split('/').slice(-1)[0];

    if (!Number.isInteger(Number(id)))
        return useAddToast(ERROR_MESSAGES.INVALID_URL);

    addItem(Number(id));
};

const removeItem = (id: number) => {
    items.value = items.value.filter((item) => item.id !== id);
};

onMounted(async () => {
    quickAvatarsOwned.value = await useGetOwnedAvatars();
});
</script>

<template>
    <div class="flex-col items-center gap-8 flex w-full">
        <div class="w-full flex flex-col gap-4 items-stretch">
            <div class="flex gap-1 items-center">
                <div
                    class="w-full p-1 rounded-lg border border-1 border-zinc-400 dark:border-zinc-500 bg-zinc-200 dark:bg-zinc-900"
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

            <div class="self-end gap-2 flex">
                <UiButton
                    icon="lucide:search"
                    label="アバター・アイテムを検索"
                    class="h-9"
                    @click="modalSearchItem = true"
                />

                <div class="self-end gap-1 flex items-center">
                    <UiButton
                        icon="lucide:undo-2"
                        class="size-9"
                        @click="emit('undo')"
                    />
                    <UiButton
                        icon="lucide:redo-2"
                        class="size-9"
                        @click="emit('redo')"
                    />
                </div>
            </div>
        </div>

        <div
            v-if="!Object.keys(categorizedItems).length"
            class="flex flex-col gap-3"
        >
            <p class="text-sm text-zinc-400">アイテムが登録されていません</p>
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
                    v-model:note="item.note"
                    v-model:unsupported="item.unsupported"
                    :id="item.id"
                    :key="'item-' + item.id"
                    :size="item.category === 208 ? 'lg' : 'md'"
                    :name="item.name"
                    :thumbnail="item.thumbnail"
                    :price="item.price"
                    :shop="item.shop.name"
                    :shop-id="item.shop.id"
                    :shop-thumbnail="item.shop.thumbnail"
                    :shop-verified="item.shop.verified"
                    :nsfw="item.nsfw"
                    :updated-at="item.updated_at"
                    @remove="removeItem(item.id)"
                />
            </div>
        </div>
    </div>

    <ModalSearchItem
        v-model="modalSearchItem"
        @add="addItem"
        @close="modalSearchItem = false"
    />

    <!-- <ModalReplaceAvatar
        v-model="modalReplaceAvatar"
        :from="items.avatar"
        :to="replaceAvatar"
        @accept="((inputUrl = ''), (items.avatar = replaceAvatar))"
        @close="modalReplaceAvatar = false"
    /> -->
</template>
