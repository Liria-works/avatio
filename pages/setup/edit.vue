<script setup lang="ts">
const router = useRouter();
const skip_router_hook = ref(false);

const publishing = ref(false);
const modalComplete = ref(false);
const publishedSetupId = ref<number | null>(null);

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
const coAuthors = ref<
    {
        id: string;
        name: string;
        avatar: string;
        note: string;
    }[]
>([]);
const image = ref<File | null>(null);

const editImage = ref();

const itemsFlatten = computed(() => [
    ...items.value.avatar,
    ...items.value.cloth,
    ...items.value.accessory,
    ...items.value.other,
]);

const errorCheck = (options: { toast?: boolean } = { toast: true }) => {
    const returnError = (message: string) => {
        publishing.value = false;
        if (options.toast) useToast().add(message);
        return true;
    };

    if (!title.value?.length)
        return returnError(getErrors().publishSetup.noTitle.client.title);

    if (title.value.length > setupLimits().title)
        return returnError(getErrors().publishSetup.tooLongTitle.client.title);

    if (description.value.length > setupLimits().description)
        return returnError(
            getErrors().publishSetup.tooLongDescription.client.title
        );

    if (tags.value.length > setupLimits().tags)
        return returnError(getErrors().publishSetup.tooManyTags.client.title);

    const avatarCount = itemsFlatten.value.filter(
        (i) => i.category === 'avatar'
    ).length;
    const nonAvatarCount = itemsFlatten.value.filter(
        (i) => i.category !== 'avatar'
    ).length;

    if (!avatarCount)
        return returnError(getErrors().publishSetup.noAvatar.client.title);
    if (avatarCount > setupLimits().avatars)
        return returnError(
            getErrors().publishSetup.tooManyAvatars.client.title
        );
    if (!nonAvatarCount)
        return returnError(getErrors().publishSetup.noItems.client.title);
    if (nonAvatarCount > setupLimits().items)
        return returnError(getErrors().publishSetup.tooManyItems.client.title);

    return false;
};

const PublishSetup = async () => {
    publishing.value = true;

    if (errorCheck()) return;

    if (image.value && image.value.size > 3.5 * 1024 * 1024) {
        publishing.value = false;
        return useToast().add(
            '画像サイズが大きすぎます',
            '3.5MB以下の画像を選択してください'
        );
    }

    type res = ApiResponse<{ id: number; image: string | null }>;
    const response = await $fetch<res>('/api/setup', {
        method: 'PUT',
        body: {
            name: title.value,
            description: description.value,
            tags: tags.value,
            coAuthors: coAuthors.value.map((i) => ({
                id: i.id,
                note: i.note,
            })),
            items: itemsFlatten.value.map((i) => ({
                id: i.id,
                note: i.note,
                unsupported: i.unsupported,
            })),
            image: image.value ? await convertFileToBase64(image.value) : null,
        },
    });

    if (!response.data) {
        publishing.value = false;
        return useToast().add(
            '投稿に失敗しました',
            response.error!.client.title || '不明なエラー'
        );
    }

    publishedSetupId.value = response.data.id;
    publishing.value = false;
    modalComplete.value = true;
};

const reset = () => {
    title.value = '';
    description.value = '';
    tags.value = [];
    coAuthors.value = [];
    items.value = { avatar: [], cloth: [], accessory: [], other: [] };
    image.value = null;
    editImage.value.reset();
    publishedSetupId.value = null;
    publishing.value = false;
    skip_router_hook.value = false;
};

onBeforeRouteLeave((to, from, next) => {
    if (skip_router_hook.value) return next(true);

    const hasChanges =
        title.value ||
        description.value.length ||
        tags.value.length ||
        itemsFlatten.value.length;

    if (hasChanges) {
        const answer = window.confirm(
            '入力された内容が破棄されます。よろしいですか？'
        );
        return next(answer);
    }
    return next(true);
});

useOGP({ title: 'セットアップ作成' });
</script>

<template>
    <div class="flex-col justify-start items-start gap-8 flex w-full px-3">
        <div
            class="flex flex-wrap-reverse md:flex-row gap-x-10 gap-y-3 items-center justify-between w-full"
        >
            <div class="w-full flex flex-col gap-2 pt-1">
                <UiTextinput
                    v-model="title"
                    placeholder="セットアップ名を入力"
                    unstyled
                    class="text-2xl font-bold"
                >
                    <template #trailing>
                        <UiCount
                            v-if="title.length"
                            :count="title.length"
                            :max="setupLimits().title"
                        />
                    </template>
                </UiTextinput>
                <UiDivider
                    border-class="border-zinc-300 dark:border-zinc-600"
                />
            </div>
            <div class="w-full md:w-fit flex gap-2 items-center">
                <Button
                    :disabled="errorCheck({ toast: false })"
                    :label="!publishing ? '公開' : '処理中'"
                    :icon="
                        !publishing
                            ? 'lucide:upload'
                            : 'i-svg-spinners-ring-resize'
                    "
                    :icon-size="18"
                    class="grow md:grow-0 rounded-full px-4"
                    @click="PublishSetup"
                >
                    <template #tooltip>
                        <div
                            class="flex flex-col gap-1 text-xs px-4 py-2 rounded-lg text-zinc-900 dark:text-zinc-100"
                        >
                            <p v-if="!title">
                                {{
                                    getErrors().publishSetup.noTitle.client
                                        .title
                                }}
                            </p>
                            <p v-if="!items.avatar.length">
                                {{
                                    getErrors().publishSetup.noAvatar.client
                                        .title
                                }}
                            </p>
                            <p
                                v-if="
                                    !items.cloth.length &&
                                    !items.accessory.length &&
                                    !items.other.length
                                "
                            >
                                {{
                                    getErrors().publishSetup.noItems.client
                                        .title
                                }}
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
                </Button>

                <Button
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
                <EditImage ref="editImage" v-model="image" />

                <div class="w-full flex flex-col items-start gap-3">
                    <div class="w-full flex gap-2 items-center justify-between">
                        <UiTitle label="説明" icon="lucide:text" />
                        <UiCount
                            v-if="description.length"
                            :count="description.length"
                            :max="setupLimits().description"
                        />
                    </div>
                    <UiTextarea
                        v-model="description"
                        placeholder="説明を入力"
                        class="w-full"
                    />
                </div>

                <div class="w-full flex flex-col items-start gap-3">
                    <div class="w-full flex gap-2 items-center justify-between">
                        <UiTitle label="タグ" icon="lucide:tags" />
                        <UiCount
                            v-if="tags.length"
                            :count="tags.length"
                            :max="setupLimits().tags"
                        />
                    </div>
                    <EditTags v-model="tags" />
                </div>

                <div class="w-full flex flex-col items-start gap-3">
                    <div class="w-full flex gap-2 items-center justify-between">
                        <UiTitle label="共同作者" icon="lucide:users-round" />
                        <UiCount
                            v-if="coAuthors.length"
                            :count="coAuthors.length"
                            :max="setupLimits().coAuthors"
                        />
                    </div>
                    <EditCoAuthor v-model="coAuthors" />
                </div>
            </div>
        </div>

        <ModalPublishSetupComplete
            v-model="modalComplete"
            :id="publishedSetupId"
            @continue="reset"
        />
    </div>
</template>
