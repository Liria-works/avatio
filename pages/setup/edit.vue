<script setup lang="ts">
const router = useRouter();
const skip_router_hook = ref(false);

const publishing = ref(false);

interface Items {
    avatar: SetupItem | null;
    avatar_note: string;
    items: SetupItem[];
}

const items = ref<Items>({
    avatar: null,
    avatar_note: '',
    items: [],
});
const { undo, redo } = useRefHistory(items, { deep: true });

const title = ref<string>('');
const description = ref<string>('');
const tags = ref<string[]>([]);
const image = ref<File | null>(null);

const PublishSetup = async () => {
    publishing.value = true;

    if (!items.value.avatar) {
        useAddToast(ERROR_MESSAGES.NO_AVATAR);
        publishing.value = false;
        return;
    }

    try {
        const id = await usePublishSetup(
            {
                name: title.value,
                description: description.value,
                tags: tags.value,
                avatar: items.value.avatar.id,
                avatar_note: items.value.avatar_note,
                items: items.value.items,
            },
            image.value
        );
        useAddToast('セットアップを公開しました。');
        skip_router_hook.value = true;
        navigateTo(`/setup/${id}`);
    } catch (error) {
        console.error(error);
        useAddToast('セットアップの公開に失敗しました。');
    } finally {
        publishing.value = false;
    }
};

onBeforeRouteLeave(
    (to: unknown, from: unknown, next: (arg0: boolean | undefined) => void) => {
        if (skip_router_hook.value) {
            next(true);
            return;
        }
        if (
            title.value ||
            description.value ||
            tags.value.length ||
            items.value.avatar ||
            items.value.items.length
        ) {
            const answer = window.confirm(
                '入力された内容が破棄されます。よろしいですか？'
            );
            if (answer) {
                next(true);
            } else {
                next(false);
            }
        } else {
            next(true);
        }
    }
);

onMounted(async () => {
    useSeoEdit();
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
                <UDivider
                    :ui="{
                        border: {
                            base: `${
                                title.length < 25
                                    ? 'border-neutral-300 dark:border-neutral-600'
                                    : 'border-red-400 dark:border-red-600'
                            }`,
                        },
                    }"
                    class="w-full"
                />
            </div>
            <div class="flex gap-2 items-center">
                <UPopover
                    mode="hover"
                    :popper="{ placement: 'top' }"
                    :ui="{
                        rounded: 'rounded-xl',
                        ring: 'ring-1 ring-gray-300 dark:ring-gray-600',
                    }"
                    class="flex"
                >
                    <UButton
                        :disabled="
                            publishing ||
                            !title ||
                            !items.avatar ||
                            !items.items.length
                        "
                        truncate
                        size="lg"
                        label="公開"
                        :icon="
                            !publishing
                                ? 'i-heroicons-arrow-up-tray-16-solid'
                                : 'i-svg-spinners-ring-resize'
                        "
                        :ui="{
                            rounded: 'rounded-full',
                            inline: 'pr-4',
                            truncate: 'whitespace-nowrap',
                        }"
                        @click="PublishSetup"
                    />

                    <template #panel>
                        <div
                            class="flex flex-col gap-1 text-xs px-4 py-2 rounded-lg text-neutral-900 dark:text-neutral-100"
                        >
                            <p v-if="!title">
                                {{ ERROR_MESSAGES.NO_TITLE }}
                            </p>
                            <p v-if="!items.avatar">
                                {{ ERROR_MESSAGES.NO_AVATAR }}
                            </p>
                            <p v-if="!items.items.length">
                                {{ ERROR_MESSAGES.NO_ITEMS }}
                            </p>

                            <p
                                v-if="
                                    title && items.avatar && items.items.length
                                "
                            >
                                セットアップを投稿
                            </p>
                        </div>
                    </template>
                </UPopover>

                <UiButton
                    tooltip="破棄"
                    icon="lucide:trash"
                    :icon-size="18"
                    class="outline-0"
                    @click="router.back()"
                />
            </div>
        </div>

        <div class="flex flex-col lg:flex-row items-start gap-8 w-full">
            <EditItems v-model="items" @undo="undo" @redo="redo" />

            <UDivider
                :ui="{
                    border: {
                        base: 'border-neutral-300 dark:border-neutral-600 mx-3 my-2',
                    },
                }"
                class="block lg:hidden"
            />

            <div
                class="w-full lg:w-96 flex-col justify-start items-start gap-8 flex"
            >
                <EditImage v-model="image" />

                <UiCategory title="説明" icon="lucide:text">
                    <div class="w-full flex flex-col gap-1 items-end">
                        <div
                            :class="`w-full p-3 rounded-lg border border-1 bg-neutral-200 dark:bg-neutral-900 ${
                                description.length < 141
                                    ? 'border-neutral-400 dark:border-neutral-600'
                                    : 'border-red-400 dark:border-red-600'
                            }`"
                        >
                            <UTextarea
                                v-model="description"
                                autoresize
                                placeholder="説明を入力"
                                :padded="false"
                                variant="none"
                                class="w-full"
                            />
                        </div>

                        <span
                            :class="`text-sm pr-1 ${
                                description.length < 141
                                    ? 'text-neutral-500 dark:text-neutral-500'
                                    : 'text-red-500 dark:text-red-400'
                            }`"
                        >
                            {{ description.length }} / 140
                        </span>
                    </div>
                </UiCategory>

                <UiCategory title="タグ" icon="lucide:tags">
                    <EditTags v-model="tags" />
                </UiCategory>
            </div>
        </div>
    </div>
</template>
