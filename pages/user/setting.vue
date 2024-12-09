<script lang="ts" setup>
const client = await useSBClient();
const user = useSupabaseUser();

const faild = ref<boolean>(false);
const avatarLoading = ref<boolean>(false);
const modalDeleteUser = ref<boolean>(false);

const avatar = ref<string>('');
const username = ref<string>('');
const bio = ref<string>('');
const links = ref<string[]>([]);

const linkInput = ref<string>('');
const linkAdding = ref<boolean>(false);

const AddLink = async () => {
    if (linkInput.value === '') return;

    if (links.value.length >= 8)
        return useAddToast('リンクは最大 8 つまでです');

    try {
        new URL(linkInput.value);
    } catch (e) {
        useAddToast('URL が不正です');
        console.error(e);
        return;
    }

    linkAdding.value = true;
    links.value.push(linkInput.value);

    try {
        await useSaveLink(links.value);
    } catch (e) {
        console.error(e);
        links.value = links.value.filter((i) => i !== linkInput.value);
    }

    linkInput.value = '';
    linkAdding.value = false;
};

const RemoveLink = async (link: string) => {
    links.value = links.value.filter((i) => i !== link);
    await useSaveLink(links.value);
};

const PasteFromClipboard = async () =>
    (linkInput.value = await navigator.clipboard.readText());

const ChangeAvatar = async () => {
    const { open, onChange } = useFileDialog({
        accept: 'image/png, image/jpeg, image/webp, image/avif, image/gif, image/svg, image/tiff',
        multiple: false,
    });

    const faild = () => {
        useAddToast(
            'アバターの変更に失敗しました',
            '画像の形式が非対応の可能性があります。'
        );
        avatarLoading.value = false;
    };

    open();
    onChange(async (files) => {
        if (!files || files.length === 0) throw new Error('No files selected');
        const file = files[0];

        avatarLoading.value = true;

        const uploaded = await useUploadAvatar(file);
        if (!uploaded) return faild();

        const { data: legacy } = await client
            .from('users')
            .select('avatar')
            .eq('id', user.value.id)
            .maybeSingle();

        const { error } = await client
            .from('users')
            .update({ avatar: uploaded } as never)
            .eq('id', user.value.id);
        if (error) return faild();

        if (legacy) await useDeleteImage(legacy.avatar);

        useAddToast('アバターを変更しました');
        avatar.value = uploaded;
        avatarLoading.value = false;
    });
};

if (!user.value) faild.value = true;

const { data } = await client
    .from('users')
    .select('name, avatar, bio, links')
    .eq('id', user.value.id)
    .maybeSingle();

if (!data) faild.value = true;
else {
    avatar.value = data.avatar;
    username.value = data.name;
    bio.value = data.bio;
    links.value = data.links;
}
</script>

<template>
    <div class="w-full px-2 flex flex-col gap-5">
        <div class="w-full flex items-center justify-between">
            <div class="flex gap-6 items-center w-full">
                <UChip
                    size="xl"
                    position="top-right"
                    inset
                    :ui="{
                        base: '-mx-1 rounded-none ring-0',
                        background: '',
                    }"
                >
                    <div
                        v-if="avatarLoading"
                        class="flex items-center justify-center size-20 rounded-full flex-shrink-0 bg-neutral-200 dark:bg-neutral-500 relative"
                    >
                        <Icon
                            name="svg-spinners:ring-resize"
                            size="36"
                            class="text-neutral-600 dark:text-neutral-300"
                        />
                    </div>
                    <div
                        v-else-if="avatar && avatar.length"
                        class="flex items-center justify-center size-20 rounded-full flex-shrink-0 bg-neutral-200 dark:bg-neutral-500 relative"
                    >
                        <UAvatar
                            :src="useGetImage(avatar)"
                            alt="Avatar"
                            size="3xl"
                        />
                        <button
                            type="button"
                            class="absolute inset-0 hover:bg-black/20 rounded-full"
                            @click="ChangeAvatar"
                        />
                    </div>
                    <div
                        v-else
                        class="flex items-center justify-center size-20 rounded-full flex-shrink-0 bg-neutral-200 dark:bg-neutral-500 relative"
                    >
                        <Icon
                            name="lucide:user-round"
                            size="36"
                            class="text-neutral-600 dark:text-neutral-300"
                        />
                        <button
                            type="button"
                            class="absolute inset-0 hover:bg-black/20 rounded-full"
                            @click="ChangeAvatar"
                        />
                    </div>
                    <template #content>
                        <button
                            type="button"
                            class="rounded-full p-2 flex bg-neutral-900"
                        >
                            <Icon
                                name="lucide:pen-line"
                                size="18"
                                class="size-4 flex-shrink-0 text-neutral-200"
                            />
                        </button>
                    </template>
                </UChip>
                <div class="flex flex-col gap-0.5 w-full">
                    <h2 class="font-medium text-sm text-neutral-400">
                        ユーザー名
                    </h2>
                    <div class="gap-2 flex items-center w-full">
                        <div class="flex flex-col gap-0.5 w-full">
                            <UInput
                                v-model="username"
                                id="name"
                                placeholder="ユーザー名を入力"
                                size="xl"
                                :padded="false"
                                variant="none"
                                :ui="{
                                    size: { xl: 'text-2xl font-bold' },
                                    rounded: 'rounded-none',
                                }"
                                class="w-full"
                            />
                            <UiDivider
                                :border-class="
                                    !bio || (bio && bio.length < 141)
                                        ? 'border-neutral-300 dark:border-neutral-600'
                                        : 'border-red-400 dark:border-red-400'
                                "
                            />
                            <p
                                v-if="
                                    username.length === 0 ||
                                    username.length > 17
                                "
                                class="text-sm mt-1 text-red-400"
                            >
                                ユーザー名は 1 ～ 16 文字である必要があります
                            </p>
                        </div>
                        <UButton
                            label="保存"
                            size="sm"
                            variant="outline"
                            :ui="{ rounded: 'rounded-xl' }"
                            @click="useSaveUsername(username)"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div class="w-full flex flex-col gap-6 pl-2">
            <div
                class="w-full flex flex-col rounded-xl px-4 py-3 gap-2 border border-1 border-neutral-400"
            >
                <div class="w-full flex items-center justify-between">
                    <h2 class="text-neutral-500 text-sm font-semibold">bio</h2>
                    <UButton
                        label="保存"
                        size="sm"
                        variant="outline"
                        :ui="{ rounded: 'rounded-xl' }"
                        @click="useSaveBio(bio)"
                    />
                </div>
                <UTextarea
                    v-model="bio"
                    autoresize
                    placeholder="簡単な自己紹介をしてみましょう"
                    variant="none"
                    :padded="false"
                />
                <UiDivider
                    :border-class="
                        !bio || (bio && bio.length < 141)
                            ? 'border-neutral-300 dark:border-neutral-600'
                            : 'border-red-400 dark:border-red-400'
                    "
                />
                <span
                    :class="`w-full text-right text-sm pr-1 ${
                        !bio || (bio && bio.length < 141)
                            ? 'text-neutral-500 dark:text-neutral-500'
                            : 'text-red-500 dark:text-red-400'
                    }`"
                >
                    {{ bio ? bio.length : 0 }} / 140
                </span>
            </div>

            <div class="flex flex-col gap-2 items-start w-full">
                <div class="flex gap-4 items-center">
                    <UiTitle label="リンク" icon="lucide:link" is="h2" />
                    <p
                        :class="`text-sm whitespace-nowrap text-neutral-700 dark:text-neutral-400 ${links.length === 8 ? 'text-red-400 dark:text-red-400' : ''}`"
                    >
                        {{ links.length }} / 8
                    </p>
                </div>

                <div class="flex gap-1 items-center w-full mt-1">
                    <div
                        class="w-full px-1 rounded-xl bg-neutral-300 dark:bg-neutral-900"
                    >
                        <UInput
                            v-model="linkInput"
                            :disabled="linkAdding"
                            autocomplete="off"
                            variant="none"
                            size="sm"
                            placeholder="リンクを入力"
                            class="w-full"
                            :ui="{
                                rounded: 'rounded-xl',
                                icon: { trailing: { pointer: '' } },
                            }"
                            @keyup.enter="AddLink()"
                        >
                            <template #trailing>
                                <UButton
                                    v-show="!linkInput"
                                    color="gray"
                                    variant="link"
                                    icon="i-heroicons-clipboard"
                                    :padded="false"
                                    @click="PasteFromClipboard"
                                />
                                <UButton
                                    v-show="linkInput !== ''"
                                    color="gray"
                                    variant="link"
                                    icon="i-heroicons-x-mark-20-solid"
                                    :padded="false"
                                    @click="linkInput = ''"
                                />
                            </template>
                        </UInput>
                    </div>
                    <UButton
                        :icon="
                            !linkAdding
                                ? 'i-heroicons-plus'
                                : 'i-svg-spinners-ring-resize'
                        "
                        :disabled="linkAdding"
                        label="追加"
                        size="sm"
                        :ui="{
                            rounded: 'rounded-xl',
                        }"
                        class="pr-3 h-[32px]"
                        @click="AddLink()"
                    />
                </div>
                <div v-if="links" class="flex flex-wrap items-center gap-2">
                    <div
                        v-for="i in links"
                        :key="'link-' + i"
                        class="pl-5 pr-4 py-2 flex gap-3 items-center rounded-full bg-neutral-300 dark:bg-neutral-700"
                    >
                        <p class="dark:text-neutral-300">{{ i }}</p>
                        <button
                            class="flex flex-shrink-0"
                            @click="RemoveLink(i)"
                        >
                            <Icon
                                name="lucide:x"
                                size="20"
                                class="text-neutral-500 dark:text-neutral-300 hover:text-red-500 hover:dark:text-red-400"
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div
            class="gap-3 p-3 mt-6 rounded-lg flex flex-col border border-red-300 dark:border-red-400"
        >
            <UiTitle label="DANGER ZONE" icon="lucide:circle-alert" is="h2" />
            <div class="w-full pl-3 flex gap-2 justify-between items-center">
                <div class="flex flex-col gap-1">
                    <h3 class="text-sm font-semibold">アカウント削除</h3>
                    <p class="text-xs">
                        アカウントおよびアカウントに紐づくデータをすべて削除します。<br />
                        削除したアカウントは復元できません。
                    </p>
                </div>
                <UiButton
                    label="アカウント削除"
                    class="text-red-500 dark:text-red-400 hover:text-white hover:dark:text-white hover:bg-red-500 hover:dark:bg-red-800 hover:outline-red-400 hover:dark:outline-red-700"
                    @click="modalDeleteUser = true"
                />
            </div>
        </div>

        <ModalDeleteUser
            v-model="modalDeleteUser"
            @close="modalDeleteUser = false"
        />
    </div>
</template>
