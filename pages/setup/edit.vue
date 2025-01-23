<script setup lang="ts">
const router = useRouter();
const skip_router_hook = ref(false);

const publishing = ref(false);

const items = ref<{
    avatar: SetupItem[];
    cloth: SetupItem[];
    accessory: SetupItem[];
    other: SetupItem[];
}>({ avatar: [], cloth: [], accessory: [], other: [] });
const { undo, redo } = useRefHistory(items, { deep: true });

const title = ref<string>('');
const description = ref<string>('');
const tags = ref<string[]>([]);
const image = ref<File | null>(null);

const errorCheck = (options: { toast?: boolean } = { toast: true }) => {
    const returnError = (message: string) => {
        publishing.value = false;
        if (options.toast) useAddToast(message);
        return true;
    };

    if (!title.value || !title.value.length)
        return returnError(getErrors().putSetup.noTitle.ja);

    const itemsFlatten = [
        ...items.value.avatar,
        ...items.value.cloth,
        ...items.value.accessory,
        ...items.value.other,
    ];

    if (!itemsFlatten.filter((i) => i.category === 'avatar').length)
        return returnError(getErrors().putSetup.noAvatar.ja);
    if (itemsFlatten.filter((i) => i.category === 'avatar').length > 1)
        return returnError(getErrors().putSetup.tooManyAvatars.ja);
    if (!itemsFlatten.filter((i) => i.category !== 'avatar').length)
        return returnError(getErrors().putSetup.noItems.ja);
    if (itemsFlatten.filter((i) => i.category !== 'avatar').length > 32)
        return returnError(getErrors().putSetup.tooManyItems.ja);

    return false;
};

const PublishSetup = async () => {
    publishing.value = true;

    const itemsFlatten = [
        ...items.value.avatar,
        ...items.value.cloth,
        ...items.value.accessory,
        ...items.value.other,
    ];
    if (errorCheck()) return;

    const response = await $fetch<ApiResponse<{ id: number }>>('/api/setup', {
        method: 'PUT',
        body: {
            name: title.value,
            description: description.value,
            tags: tags.value,
            items: itemsFlatten.map((i) => ({
                id: i.id,
                note: i.note,
                unsupported: i.unsupported,
            })),
            image: image.value ? await convertFileToBase64(image.value) : null,
        },
    });

    if (!response.data) {
        publishing.value = false;
        return useAddToast(
            '投稿に失敗しました',
            response.error!.ja || '不明なエラー'
        );
    }

    publishing.value = false;
    useAddToast('セットアップを公開しました。');
    skip_router_hook.value = true;
    navigateTo(`/setup/${response.data.id}`);
};

onBeforeRouteLeave(
    (to: unknown, from: unknown, next: (arg0: boolean | undefined) => void) => {
        if (skip_router_hook.value) return next(true);

        const itemsFlatten = [
            ...items.value.avatar,
            ...items.value.cloth,
            ...items.value.accessory,
            ...items.value.other,
        ];

        if (
            title.value ||
            description.value ||
            tags.value.length ||
            itemsFlatten.length
        ) {
            const answer = window.confirm(
                '入力された内容が破棄されます。よろしいですか？'
            );
            if (answer) next(true);
            else next(false);
        } else next(true);
    }
);

onMounted(async () => {
    useOGP({
        title: 'セットアップ作成',
    });
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
                <UiDivider
                    :border-class="
                        title.length < 25
                            ? 'border-zinc-300 dark:border-zinc-600'
                            : 'border-red-400 dark:border-red-600'
                    "
                />
            </div>
            <div class="flex gap-2 items-center">
                <ButtonBase
                    :disabled="errorCheck({ toast: false })"
                    :label="!publishing ? '公開' : '処理中'"
                    :icon="
                        !publishing
                            ? 'lucide:upload'
                            : 'i-svg-spinners-ring-resize'
                    "
                    :icon-size="18"
                    class="rounded-full px-4"
                    @click="PublishSetup"
                >
                    <template #tooltip>
                        <div
                            class="flex flex-col gap-1 text-xs px-4 py-2 rounded-lg text-zinc-900 dark:text-zinc-100"
                        >
                            <p v-if="!title">
                                {{ ERROR_MESSAGES.NO_TITLE }}
                            </p>
                            <p v-if="!items.avatar.length">
                                {{ ERROR_MESSAGES.NO_AVATAR }}
                            </p>
                            <p
                                v-if="
                                    !items.cloth.length &&
                                    !items.accessory.length &&
                                    !items.other.length
                                "
                            >
                                {{ ERROR_MESSAGES.NO_ITEMS }}
                            </p>

                            <p
                                v-if="
                                    title &&
                                    items.avatar.length &&
                                    (items.cloth.length ||
                                        items.accessory.length ||
                                        items.other.length)
                                "
                            >
                                セットアップを投稿
                            </p>
                        </div>
                    </template>
                </ButtonBase>

                <ButtonBase
                    tooltip="破棄"
                    icon="lucide:trash"
                    :icon-size="18"
                    variant="flat"
                    @click="router.back()"
                />
            </div>
        </div>

        <div class="flex flex-col lg:flex-row items-start gap-8 w-full">
            <EditItems v-model="items" @undo="undo" @redo="redo" />

            <UiDivider class="block lg:hidden mx-3 my-2" />

            <div
                class="w-full lg:max-w-[30%] flex-col justify-start items-start gap-8 flex"
            >
                <EditImage v-model="image" />

                <div class="w-full flex flex-col items-start gap-3">
                    <UiTitle label="説明" icon="lucide:text" />
                    <div class="w-full flex flex-col gap-1 items-end">
                        <UiTextarea
                            v-model="description"
                            placeholder="説明を入力"
                            :class="`w-full p-3 rounded-lg ${
                                description.length < 141 ||
                                'ring-red-400 dark:ring-red-400'
                            }`"
                        />

                        <span
                            :class="`text-sm pr-1 ${
                                description.length < 141
                                    ? 'text-zinc-500 dark:text-zinc-500'
                                    : 'text-red-500 dark:text-red-400'
                            }`"
                        >
                            {{ description.length }} / 140
                        </span>
                    </div>
                </div>

                <div class="w-full flex flex-col items-start gap-3">
                    <UiTitle label="タグ" icon="lucide:tags" />
                    <EditTags v-model="tags" />
                </div>
            </div>
        </div>
    </div>
</template>
