<script setup lang="ts">
const router = useRouter();
const skip_router_hook = ref(false);

const publishing = ref(false);

const items = ref<SetupItem[]>([]);
const { undo, redo } = useRefHistory(items, { deep: true });

const title = ref<string>('');
const description = ref<string>('');
const tags = ref<string[]>([]);
const image = ref<File | null>(null);

const PublishSetup = async () => {
    publishing.value = true;

    if (!items.value.filter((i) => i.category === 208).length) {
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
                items: items.value,
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
            items.value.length
        ) {
            const answer = window.confirm(
                '入力された内容が破棄されます。よろしいですか？'
            );
            if (answer) next(true);
            else next(false);
        } else {
            next(true);
        }
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
                            !items.filter((i) => i.category === 208).length ||
                            !items.filter((i) => i.category !== 208).length
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
                            class="flex flex-col gap-1 text-xs px-4 py-2 rounded-lg text-zinc-900 dark:text-zinc-100"
                        >
                            <p v-if="!title">
                                {{ ERROR_MESSAGES.NO_TITLE }}
                            </p>
                            <p
                                v-if="
                                    !items.filter((i) => i.category === 208)
                                        .length
                                "
                            >
                                {{ ERROR_MESSAGES.NO_AVATAR }}
                            </p>
                            <p
                                v-if="
                                    !items.filter((i) => i.category !== 208)
                                        .length
                                "
                            >
                                {{ ERROR_MESSAGES.NO_ITEMS }}
                            </p>

                            <p
                                v-if="
                                    title &&
                                    items.filter((i) => i.category === 208)
                                        .length &&
                                    items.filter((i) => i.category !== 208)
                                        .length
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

            <UiDivider class="block lg:hidden mx-3 my-2" />

            <div
                class="w-full lg:w-96 flex-col justify-start items-start gap-8 flex"
            >
                <EditImage v-model="image" />

                <div class="w-full flex flex-col items-start gap-3">
                    <UiTitle label="説明" icon="lucide:text" />
                    <div class="w-full flex flex-col gap-1 items-end">
                        <div
                            :class="`w-full p-3 rounded-lg border border-1 bg-zinc-200 dark:bg-zinc-900 ${
                                description.length < 141
                                    ? 'border-zinc-400 dark:border-zinc-600'
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
