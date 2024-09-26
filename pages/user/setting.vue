<script lang="ts" setup>
const client = await useSBClient();
const user = useSupabaseUser();

const storeMyAvatar = useMyAvatar();
const { GetMyAvatar } = storeMyAvatar;
const { myAvatar } = storeToRefs(storeMyAvatar);

const loading = ref(true);
const faild = ref(false);
const avatar_loading = ref(false);

const username = ref("");
const bio = ref("");
const links = ref<string[]>([]);

const link_input = ref("");
const link_adding = ref(false);

const AddLink = async () => {
    if (link_input.value === "") return;
    link_adding.value = true;

    links.value.push(link_input.value);
    await useSaveLink(links.value);

    link_input.value = "";
    link_adding.value = false;
};

const RemoveLink = async (link: string) => {
    links.value = links.value.filter((i) => i !== link);
    await useSaveLink(links.value);
};

const PasteFromClipboard = async () => {
    const text = await navigator.clipboard.readText();
    link_input.value = text;
};

const ChangeAvatar = async () => {
    const { open, onChange } = useFileDialog({
        accept: "image/png, image/jpeg, image/tiff", // Set to accept only image files
        multiple: false,
    });

    const faild = () => {
        useAddToast(
            "アバターの変更に失敗しました",
            "画像の形式が非対応の可能性があります。"
        );
        avatar_loading.value = false;
    };

    open();
    onChange(async (files) => {
        if (!files || files.length === 0) throw new Error("No files selected");
        const file = files[0];

        avatar_loading.value = true;

        const uploaded = await useUploadAvatar(file);

        if (!uploaded) {
            faild();
            return;
        }

        const legacy = await client
            .from("users")
            .select("avatar")
            .eq("id", user.value.id)
            .single();

        const { error } = await client
            .from("users")
            .update({ avatar: uploaded } as never)
            .eq("id", user.value.id);

        if (error) {
            faild();
            return;
        }

        if (legacy.data) {
            await client.storage.from("images").remove([legacy.data.avatar]);
        }

        await GetMyAvatar();

        useAddToast("アバターを変更しました");
        avatar_loading.value = false;
    });
};

onMounted(async () => {
    const { data } = await client
        .from("users")
        .select("name, avatar, bio, links")
        .eq("id", user.value.id)
        .single();

    if (!data) {
        faild.value = true;
        return;
    }
    username.value = data.name;
    bio.value = data.bio;
    links.value = data.links;

    await GetMyAvatar();

    loading.value = false;
});
</script>

<template>
    <div class="w-full px-2">
        <div v-if="loading" class="w-full flex items-center justify-center pt-20">
            <Icon name="svg-spinners:ring-resize" size="32" />
        </div>

        <div v-else class="w-full flex flex-col gap-5">
            <div class="w-full flex items-center justify-between">
                <div class="flex gap-6 items-center w-full">
                    <UChip size="xl" position="top-right" inset :ui="{
                        base: '-mx-1 rounded-none ring-0',
                        background: '',
                    }">
                        <div v-if="myAvatar"
                            class="flex items-center justify-center size-20 rounded-full flex-shrink-0 bg-neutral-200 dark:bg-neutral-500 relative">
                            <UAvatar :src="myAvatar" alt="Avatar" size="3xl" />
                            <button class="absolute inset-0 hover:bg-black/20 rounded-full" @click="ChangeAvatar" />
                        </div>
                        <div v-else
                            class="flex items-center justify-center size-20 rounded-full flex-shrink-0 bg-neutral-200 dark:bg-neutral-500 relative">
                            <Icon name="lucide:user-round" size="36" class="text-neutral-600 dark:text-neutral-300" />
                            <button class="absolute inset-0 hover:bg-black/20 rounded-full" @click="ChangeAvatar" />
                        </div>
                        <template #content>
                            <Icon name="lucide:pen-line" size="18" class="text-neutral-200" />
                        </template>
                    </UChip>
                    <div class="flex flex-col gap-0.5 w-full">
                        <p class="font-medium text-sm text-neutral-400">
                            ユーザー名
                        </p>
                        <div class="gap-2 flex items-center w-full">
                            <div class="flex flex-col gap-0.5 w-full">
                                <UInput v-model="username" id="name" placeholder="ユーザー名を入力" size="xl" :padded="false"
                                    variant="none" :ui="{
                                        size: { xl: 'text-2xl font-bold' },
                                        rounded: 'rounded-none',
                                    }" class="w-full" />
                                <UDivider :ui="{
                                    border: {
                                        base: 'border-neutral-300 dark:border-neutral-600',
                                    },
                                }" />
                                <p v-if="
                                    username.length === 0 ||
                                    username.length > 17
                                " class="text-sm mt-1 text-red-400">
                                    ユーザー名は 1 ～ 16
                                    文字である必要があります
                                </p>
                            </div>
                            <UButton label="保存" size="sm" variant="outline" :ui="{ rounded: 'rounded-xl' }"
                                @click="useSaveUsername(username)" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="w-full flex flex-col gap-6 pl-2">
                <div
                    class="w-full flex flex-col rounded-xl px-4 py-3 gap-2 border border-1 border-neutral-600 bg-neutral-200 dark:bg-neutral-750">
                    <div class="w-full flex items-center justify-between">
                        <p class="text-neutral-500 text-sm">bio</p>
                        <UButton label="保存" size="sm" variant="outline" :ui="{ rounded: 'rounded-xl' }"
                            @click="useSaveBio(bio)" />
                    </div>
                    <UTextarea v-model="bio" autoresize placeholder="簡単な自己紹介をしてみましょう" variant="none" :padded="false" />
                    <UDivider :ui="{
                        border: {
                            base: `${bio.length < 141
                                ? 'border-neutral-300 dark:border-neutral-600'
                                : 'border-red-400 dark:border-red-400'
                                }`,
                        },
                    }" class="w-full" />
                    <span :class="`w-full text-right text-sm pr-1 ${bio.length < 141
                        ? 'text-neutral-500 dark:text-neutral-500'
                        : 'text-red-500 dark:text-red-400'
                        }`">
                        {{ bio.length }} / 140
                    </span>
                </div>

                <div class="flex flex-col gap-2 items-start w-full">
                    <UiTitle title="リンク" icon="lucide:link" />
                    <div class="flex gap-1 items-center w-full mt-1">
                        <div class="w-full px-1 rounded-xl bg-neutral-300 dark:bg-neutral-900">
                            <UInput v-model="link_input" :disabled="link_adding" autocomplete="off" variant="none"
                                size="sm" placeholder="リンクを入力" class="w-full" :ui="{
                                    rounded: 'rounded-xl',
                                    icon: { trailing: { pointer: '' } },
                                }" @keyup.enter="AddLink()">
                                <template #trailing>
                                    <UButton v-show="!link_input" color="gray" variant="link"
                                        icon="i-heroicons-clipboard" :padded="false" @click="PasteFromClipboard" />
                                    <UButton v-show="link_input !== ''" color="gray" variant="link"
                                        icon="i-heroicons-x-mark-20-solid" :padded="false" @click="link_input = ''" />
                                </template>
                            </UInput>
                        </div>
                        <UButton :icon="!link_adding
                            ? 'i-heroicons-plus'
                            : 'i-svg-spinners-ring-resize'
                            " :disabled="link_adding" label="追加" size="sm" :ui="{
                                rounded: 'rounded-xl',
                            }" class="pr-3 h-[32px]" @click="AddLink()" />
                    </div>
                    <div v-if="links" class="flex flex-wrap items-center gap-2">
                        <div v-for="i in links" :key="'link-' + i"
                            class="pl-5 pr-4 py-2 flex gap-3 items-center rounded-full bg-neutral-300 dark:bg-neutral-700">
                            <p class="dark:text-neutral-300">{{ i }}</p>
                            <button class="flex flex-shrink-0" @click="RemoveLink(i)">
                                <Icon name="lucide:x" size="20"
                                    class="text-neutral-500 dark:text-neutral-300 hover:text-red-500 hover:dark:text-red-400" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
