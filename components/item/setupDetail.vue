<script lang="ts" setup>
const props = withDefaults(
    defineProps<{
        name: string;
        description: string | null;
        avatarName: string;
        avatarThumbnail: string;
        authorId: string;
        authorName: string;
        authorAvatar: string | null;
        createdAt: string;
        image: string | null;
    }>(),
    {
        image: null,
    }
);

const date = new Date(props.createdAt);
const dateLocale = date.toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
});

// const fetchAvatar = ref<Item | null>();
// const fetchImage = ref();
// const loading = ref(true);

onMounted(async () => {
    // fetchAvatar.value = await useFetchBooth(props.avatar);
    // if (!fetchAvatar.value) {
    //     console.log("avatar not found");
    //     // TODO: アバターがリンク切れの場合のハンドリング
    // }
    // if (props.image) {
    //     fetchImage.value = await useGetImage(props.image);
    // } else {
    //     fetchImage.value = null;
    // }
    // loading.value = false;
});
</script>

<template>
    <ItemBase>
        <template #thumbnail>
            <div class="p-2 flex-shrink-0">
                <NuxtImg
                    :src="
                        props.image
                            ? useGetImage(props.image)
                            : props.avatarThumbnail
                    "
                    :alt="props.name"
                    class="h-28 w-28 md:w-auto object-cover rounded-lg overflow-clip"
                />
            </div>
        </template>
        <template #main>
            <div class="w-full flex flex-col gap-3 justify-between px-4 py-5">
                <div class="flex flex-col gap-1">
                    <p
                        class="text-lg font-medium text-neutral-700 dark:text-neutral-200 break-all line-clamp-1"
                    >
                        {{ props.name }}
                    </p>
                    <p
                        class="text-sm text-neutral-500 dark:text-neutral-400 break-keep line-clamp-1"
                    >
                        {{ useSentence(useAvatarName(props.avatarName)) }}
                    </p>
                </div>
                <div class="gap-4 flex justify-between items-center">
                    <p
                        class="text-sm text-neutral-600 dark:text-neutral-400 break-all line-clamp-1"
                    >
                        {{ props.description ? props.description : "" }}
                    </p>
                    <div class="flex items-center gap-2">
                        <UiTooltip :text="dateLocale">
                            <p
                                class="text-sm text-neutral-600 dark:text-neutral-400 whitespace-nowrap"
                            >
                                {{ useDateElapsed(date) }}
                            </p>
                        </UiTooltip>
                        <UiTooltip :text="props.authorName">
                            <NuxtLink
                                :to="{
                                    name: 'user-id',
                                    params: { id: props.authorId },
                                }"
                                class="flex flex-row gap-2 items-center"
                            >
                                <UAvatar
                                    v-if="props.authorAvatar"
                                    size="xs"
                                    :src="props.authorAvatar"
                                    :alt="props.authorName"
                                />
                                <div
                                    v-else
                                    class="flex items-center justify-center size-[25px] rounded-full flex-shrink-0 bg-neutral-200 dark:bg-neutral-500"
                                >
                                    <Icon
                                        name="lucide:user-round"
                                        size="14"
                                        class="text-neutral-600 dark:text-neutral-300"
                                    />
                                </div>
                            </NuxtLink>
                        </UiTooltip>
                    </div>
                </div>
            </div>
        </template>
    </ItemBase>
</template>
