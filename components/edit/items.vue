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

    if (data.category === 'avatar') {
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
    } else if (data.category === 'cloth') {
        if (items.value.cloth.map((i) => i.id).includes(id))
            useAddToast(ERROR_MESSAGES.MULTIPLE_ITEM);
        else {
            items.value.cloth.push(d);
            inputUrl.value = '';
        }
    } else if (data.category === 'accessory') {
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

const getOwnedAvatars = async () => {
    const client = await useSBClient();
    const user = useSupabaseUser();

    if (!user.value) return null;

    const { data } = await client
        .from('setups')
        .select(
            `
            items:setup_items(
                data:item_id(
                    id, outdated, category, name, thumbnail, nsfw
                )
            )
            `
        )
        .eq('author', user.value.id)
        .eq('setup_items.item_id.category', 'avatar')
        .order('created_at', { ascending: false })
        .limit(30);

    if (!data) return null;

    const avatars = [
        ...new Map(
            data
                .map((s) => s.items.filter((i) => i.data).map((i) => i.data))
                .flat()
                .flat()
                .map((obj) => [obj.id, obj])
        ).values(),
    ].slice(0, 6);

    return avatars;
};

quickAvatarsOwned.value = await getOwnedAvatars();
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
                    class="w-full"
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

            <div class="gap-2 flex items-center justify-between">
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

                    <div
                        class="ml-2 pl-2 pr-2.5 py-1 rounded-full flex gap-1 items-center ring-1 ring-zinc-500"
                    >
                        <Icon
                            name="lucide:person-standing"
                            size="16"
                            class="bg-zinc-600 dark:bg-zinc-400"
                        />
                        <span class="text-xs leading-none">
                            {{ items.avatar.length }} / 1
                        </span>
                    </div>

                    <div
                        class="ml-1 pl-2 pr-2.5 py-1 rounded-full flex gap-1 items-center ring-1 ring-zinc-500"
                    >
                        <Icon
                            name="lucide:box"
                            size="16"
                            class="bg-zinc-600 dark:bg-zinc-400"
                        />
                        <span class="text-xs leading-none">
                            {{
                                items.cloth.length +
                                items.accessory.length +
                                items.other.length
                            }}
                            / 32
                        </span>
                    </div>
                </div>

                <ButtonBase
                    icon="lucide:search"
                    label="アバター・アイテムを検索"
                    class="h-9"
                    @click="modalSearchItem = true"
                />
            </div>
        </div>

        <div
            v-if="
                !items.avatar.length &&
                !items.cloth.length &&
                !items.accessory.length &&
                !items.other.length
            "
            class="flex flex-col gap-6 items-center"
        >
            <p class="text-sm text-zinc-600 dark:text-zinc-400">
                アイテムが登録されていません
            </p>
            <div class="flex flex-wrap gap-2 items-center justify-center">
                <ButtonBase
                    v-for="i in quickAvatarsOwned"
                    class="p-1 pr-2.5"
                    @click="addItem(i.id)"
                >
                    <NuxtImg
                        :src="i.thumbnail"
                        width="40"
                        height="40"
                        class="rounded-lg"
                    />
                    <span>{{ useAvatarName(i.name) }}</span>
                </ButtonBase>
            </div>
        </div>

        <div v-else class="w-full flex flex-col gap-5">
            <div
                v-for="(value, key) in items"
                :key="useId()"
                class="empty:hidden w-full flex flex-col gap-3"
            >
                <template v-if="value.length">
                    <UiTitle
                        :label="itemCategories()[key].label"
                        :icon="itemCategories()[key].icon"
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
                            :size="item.category === 'avatar' ? 'lg' : 'md'"
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
