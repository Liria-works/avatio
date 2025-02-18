<script setup lang="ts">
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
    <div class="size-full pb-5 relative pl-[23rem]">
        <EditSidebar
            v-model:publishing="publishing"
            v-model:title="title"
            v-model:description="description"
            v-model:tags="tags"
            v-model:co-authors="coAuthors"
            v-model:image="image"
            class="absolute top-0 bottom-4 left-0 w-[22rem] overflow-y-auto"
            @publish="PublishSetup"
        />

        <EditItems
            v-model="items"
            class="w-full h-full"
            @undo="undo"
            @redo="redo"
        />

        <ModalPublishSetupComplete
            v-model="modalComplete"
            :id="publishedSetupId"
            @continue="reset"
        />
    </div>
</template>
