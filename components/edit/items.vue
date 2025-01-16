<script lang="ts" setup>
import { VueDraggable } from 'vue-draggable-plus';

const emit = defineEmits(['undo', 'redo']);

const items = defineModel<{
    avatar: SetupItem[];
    cloth: SetupItem[];
    accessory: SetupItem[];
    other: SetupItem[];
}>({
    default: { avatar: [], cloth: [], accessory: [], other: [] },
});

const adding = ref(false);
const modalSearchItem = ref(false);
const modalReplaceAvatar = ref(false);

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
        if (items.value.avatar.length) {
            if (items.value.avatar[0].id === id)
                useAddToast(ERROR_MESSAGES.SAME_AVATAR);
            else {
                replaceAvatar.value = d;
                modalReplaceAvatar.value = true;
            }
        } else {
            items.value.avatar.push(d);
            inputUrl.value = '';
        }
    } else if (data.category === 209) {
        if (items.value.cloth.map((i) => i.id).includes(id))
            useAddToast(ERROR_MESSAGES.MULTIPLE_ITEM);
        else {
            items.value.cloth.push(d);
            inputUrl.value = '';
        }
    } else if (data.category === 217) {
        if (items.value.accessory.map((i) => i.id).includes(id))
            useAddToast(ERROR_MESSAGES.MULTIPLE_ITEM);
        else {
            items.value.accessory.push(d);
            inputUrl.value = '';
        }
    } else {
        if (items.value.other.map((i) => i.id).includes(id))
            useAddToast(ERROR_MESSAGES.MULTIPLE_ITEM);
        else {
            items.value.other.push(d);
            inputUrl.value = '';
        }
    }

    adding.value = false;
};

const addItemFromURL = async () => {
    if (!inputUrl.value) return useAddToast(ERROR_MESSAGES.EMPTY_URL);

    try {
        new URL(inputUrl.value);
    } catch {
        return useAddToast(ERROR_MESSAGES.INVALID_URL);
    }

    const url = new URL(inputUrl.value);

    if (url.hostname.split('.').slice(-2).join('.') !== 'booth.pm')
        return useAddToast(ERROR_MESSAGES.INVALID_URL);

    const id = url.pathname.split('/').slice(-1)[0];

    if (!Number.isInteger(Number(id)))
        return useAddToast(ERROR_MESSAGES.INVALID_URL);

    addItem(Number(id));
};

const removeItem = (id: number) => {
    items.value.avatar = items.value.avatar.filter((item) => item.id !== id);
    items.value.cloth = items.value.cloth.filter((item) => item.id !== id);
    items.value.accessory = items.value.accessory.filter(
        (item) => item.id !== id
    );
    items.value.other = items.value.other.filter((item) => item.id !== id);
};

onMounted(async () => {
    quickAvatarsOwned.value = await useGetOwnedAvatars();
});
</script>

<template>
    <div class="flex-col items-center gap-8 flex w-full">
        <div class="w-full flex flex-col gap-4 items-stretch">
            <div class="flex gap-1 items-center">
                <UiTextinput
                    v-model="inputUrl"
                    :disabled="adding"
                    autocomplete="off"
                    placeholder="BOOTH URLからアバター・アイテムを追加"
                    @keyup.enter="addItemFromURL"
                >
                    <template #trailing>
                        <ButtonBase
                            v-if="!inputUrl"
                            icon="lucide:clipboard"
                            variant="flat"
                            class="p-1.5"
                            @click="pasteFromClipboard"
                        />
                        <ButtonBase
                            v-if="inputUrl !== ''"
                            icon="lucide:x"
                            variant="flat"
                            class="p-1.5"
                            @click="inputUrl = ''"
                        />
                    </template>
                </UiTextinput>
                <ButtonBase
                    :disabled="adding"
                    :icon="
                        !adding ? 'lucide:plus' : 'i-svg-spinners-ring-resize'
                    "
                    label="追加"
                    class="pr-3 h-[40px]"
                    @click="addItemFromURL"
                />
            </div>

            <div class="self-end gap-2 flex">
                <ButtonBase
                    icon="lucide:search"
                    label="アバター・アイテムを検索"
                    class="h-9"
                    @click="modalSearchItem = true"
                />

                <div class="self-end gap-1 flex items-center">
                    <ButtonBase
                        icon="lucide:undo-2"
                        class="size-9"
                        @click="emit('undo')"
                    />
                    <ButtonBase
                        icon="lucide:redo-2"
                        class="size-9"
                        @click="emit('redo')"
                    />
                </div>
            </div>
        </div>

        <div
            v-if="
                !items.avatar.length &&
                !items.cloth.length &&
                !items.accessory.length &&
                !items.other.length
            "
            class="flex flex-col gap-3"
        >
            <p class="text-sm text-zinc-400">アイテムが登録されていません</p>
        </div>

        <div v-else class="w-full flex flex-col gap-5">
            <div
                v-for="(value, key) in items"
                :key="useId()"
                class="empty:hidden w-full flex flex-col gap-3"
            >
                <template v-if="value.length">
                    <UiTitle
                        :label="categoryAttr[key].label"
                        :icon="categoryAttr[key].icon"
                    />

                    <VueDraggable
                        v-model="items[key]"
                        :animation="150"
                        handle=".draggable"
                        drag-class="opacity-100"
                        ghost-class="opacity-0"
                        class="flex flex-col gap-2"
                    >
                        <ItemBoothEdit
                            v-for="item in value"
                            v-model:note="item.note"
                            v-model:unsupported="item.unsupported"
                            :key="'item-' + item.id"
                            :size="item.category === 208 ? 'lg' : 'md'"
                            :item="item"
                            @remove="removeItem(item.id)"
                        />
                    </VueDraggable>
                </template>
            </div>
        </div>
    </div>

    <ModalSearchItem
        v-model="modalSearchItem"
        @add="addItem"
        @close="modalSearchItem = false"
    />

    <ModalReplaceAvatar
        v-if="replaceAvatar"
        v-model="modalReplaceAvatar"
        :from="items.avatar[0]"
        :to="replaceAvatar"
        @accept="((inputUrl = ''), (items.avatar[0] = replaceAvatar))"
        @close="modalReplaceAvatar = false"
    />
</template>
