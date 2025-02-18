<script lang="ts" setup>
import { twMerge } from 'tailwind-merge';
import { VueDraggable } from 'vue-draggable-plus';

const { class: propClass } = defineProps<{ class?: string | string[] }>();
const emit = defineEmits(['undo', 'redo']);

const items = defineModel<{
    avatar: SetupItem[];
    cloth: SetupItem[];
    accessory: SetupItem[];
    other: SetupItem[];
}>({ default: { avatar: [], cloth: [], accessory: [], other: [] } });

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
        useToast().add(
            getErrors().editSetup.addItemFailed.client.title,
            getErrors().editSetup.addItemFailed.client.description
        );
        adding.value = false;
        return;
    }

    const d = { ...data, note: '', unsupported: false };

    if (data.category === 'avatar') {
        if (items.value.avatar.length) {
            if (items.value.avatar[0].id === id)
                useToast().add(
                    getErrors().publishSetup.sameAvatars.client.title,
                    getErrors().publishSetup.sameAvatars.client.description
                );
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
            useToast().add(
                getErrors().publishSetup.sameItems.client.title,
                getErrors().publishSetup.sameItems.client.description
            );
        else {
            items.value.cloth.push(d);
            inputUrl.value = '';
        }
    } else if (data.category === 'accessory') {
        if (items.value.accessory.map((i) => i.id).includes(id))
            useToast().add(
                getErrors().publishSetup.sameItems.client.title,
                getErrors().publishSetup.sameItems.client.description
            );
        else {
            items.value.accessory.push(d);
            inputUrl.value = '';
        }
    } else {
        if (items.value.other.map((i) => i.id).includes(id))
            useToast().add(
                getErrors().publishSetup.sameItems.client.title,
                getErrors().publishSetup.sameItems.client.description
            );
        else {
            items.value.other.push(d);
            inputUrl.value = '';
        }
    }

    adding.value = false;
};

const addItemFromURL = async () => {
    if (!inputUrl.value)
        return useToast().add(
            getErrors().editSetup.emptyUrl.client.title,
            getErrors().editSetup.emptyUrl.client.description
        );

    try {
        new URL(inputUrl.value);
    } catch {
        return useToast().add(
            getErrors().editSetup.invalidUrl.client.title,
            getErrors().editSetup.invalidUrl.client.description
        );
    }

    const url = new URL(inputUrl.value);

    if (url.hostname.split('.').slice(-2).join('.') !== 'booth.pm')
        return useToast().add(
            getErrors().editSetup.invalidUrl.client.title,
            getErrors().editSetup.invalidUrl.client.description
        );

    const id = url.pathname.split('/').slice(-1)[0];

    if (!Number.isInteger(Number(id)))
        return useToast().add(
            getErrors().editSetup.invalidUrl.client.title,
            getErrors().editSetup.invalidUrl.client.description
        );

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
    const client = useSupabaseClient();
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
    <div :class="twMerge('flex-col items-center gap-8 flex', propClass)">
        <div class="w-full flex flex-col gap-4 items-stretch">
            <!-- <div class="flex gap-1 items-center">
                <UiTextinput
                    v-model="inputUrl"
                    :disabled="adding"
                    autocomplete="off"
                    placeholder="BOOTH URLからアバター・アイテムを追加"
                    class="w-full"
                    @keyup.enter="addItemFromURL"
                >
                    <template #trailing>
                        <Button
                            v-if="!inputUrl"
                            icon="lucide:clipboard"
                            variant="flat"
                            class="p-1.5"
                            @click="pasteFromClipboard"
                        />
                        <Button
                            v-if="inputUrl !== ''"
                            icon="lucide:x"
                            variant="flat"
                            class="p-1.5"
                            @click="inputUrl = ''"
                        />
                    </template>
                </UiTextinput>
                <Button
                    :disabled="adding"
                    :icon="
                        !adding ? 'lucide:plus' : 'i-svg-spinners-ring-resize'
                    "
                    label="追加"
                    class="pr-3"
                    @click="addItemFromURL"
                />
            </div> -->

            <div class="gap-2 flex items-center">
                <div class="grow gap-1 flex items-center">
                    <Button
                        icon="lucide:undo-2"
                        variant="flat"
                        class="size-9"
                        @click="emit('undo')"
                    />
                    <Button
                        icon="lucide:redo-2"
                        variant="flat"
                        class="size-9"
                        @click="emit('redo')"
                    />

                    <div
                        class="ml-2 pl-2 pr-2.5 py-1 rounded-full flex gap-1 items-center ring-1 ring-zinc-500"
                    >
                        <Icon
                            name="lucide:person-standing"
                            size="16"
                            class="shrink-0 bg-zinc-600 dark:bg-zinc-400"
                        />
                        <span class="text-xs leading-none whitespace-nowrap">
                            {{ items.avatar.length }} / 1
                        </span>
                    </div>

                    <div
                        :data-exceeded="
                            useSum(
                                items.cloth.length,
                                items.accessory.length,
                                items.other.length
                            ).value > 32
                        "
                        class="ml-1 pl-2 pr-2.5 py-1 rounded-full flex gap-1 items-center ring-1 ring-zinc-500 data-[exceeded=true]:ring-red-500"
                    >
                        <Icon
                            name="lucide:box"
                            size="16"
                            class="shrink-0 bg-zinc-600 dark:bg-zinc-400"
                        />
                        <span class="text-xs leading-none whitespace-nowrap">
                            <span>{{
                                items.cloth.length +
                                items.accessory.length +
                                items.other.length
                            }}</span>
                            <span
                                v-if="
                                    useSum(
                                        items.cloth.length,
                                        items.accessory.length,
                                        items.other.length
                                    ).value > 32
                                "
                                >/ 32</span
                            >
                        </span>
                    </div>
                </div>

                <Button
                    icon="lucide:plus"
                    label="アバター・アイテムを追加"
                    class="px-4"
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
            class="h-full flex flex-col gap-6 items-center justify-center"
        >
            <p class="text-sm text-zinc-600 dark:text-zinc-400">
                アイテムが登録されていません
            </p>
            <div class="flex flex-wrap gap-2 items-center justify-center">
                <Button
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
                </Button>
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
                        <EditItemsItem
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
