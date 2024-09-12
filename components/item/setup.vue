<script lang="ts" setup>
const props = withDefaults(
    defineProps<{
        name: string;
        avatar_name: string;
        avatar_thumbnail: string;
        author_id: string;
        author_name: string;
        author_avatar: string | null;
        createdAt: string;
        image: string | null;
        noHero?: boolean;
    }>(),
    {
        image: null,
        noHero: false,
    }
);

const date = new Date(props.createdAt);
const dateLocale = date.toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
});

// const fetchAvatar = ref<BoothItem | null>();
const fetchImage = ref();
const fetchAuthorAvatar = ref();
const loading = ref(true);

onMounted(async () => {
    // fetchAvatar.value = await useFetchBooth({ id: props.avatar, url: null });

    // if (!fetchAvatar.value) {
    //     console.log("avatar not found");
    //     // TODO: アバターがリンク切れの場合のハンドリング
    // }

    if (props.image) {
        fetchImage.value = await useGetImage(props.image);
    } else {
        fetchImage.value = null;
    }

    if (props.author_avatar) {
        fetchAuthorAvatar.value = await useGetImage(props.author_avatar);
    } else {
        fetchAuthorAvatar.value = null;
    }

    loading.value = false;
});
</script>

<template>
    <ItemBase>
        <template #hero>
            <div v-if="fetchImage && !noHero" class="px-1.5 pt-1.5 pb-0.5">
                <div class="max-h-80 rounded-lg overflow-hidden">
                    <NuxtImg
                        :src="fetchImage"
                        class="size-full rounded-lg object-cover"
                    />
                </div>
            </div>
        </template>
        <template #thumbnail>
            <div
                v-if="fetchImage && noHero"
                class="py-1.5 pl-1.5 flex-shrink-0 max-w-20"
            >
                <NuxtImg
                    :src="fetchImage"
                    :alt="props.name"
                    class="h-14 rounded-lg overflow-clip object-cover"
                />
            </div>

            <div v-if="!fetchImage" class="py-1.5 pl-1.5 flex-shrink-0">
                <NuxtImg
                    :src="props.avatar_thumbnail"
                    :alt="props.name"
                    class="h-14 rounded-lg overflow-clip"
                />
            </div>
        </template>
        <template #main>
            <div class="w-full h-16 flex justify-between">
                <div
                    class="w-full flex flex-col justify-center gap-0.5 py-2 pr-2 pl-3"
                >
                    <p
                        class="text-md font-medium text-neutral-700 dark:text-neutral-200 break-all line-clamp-1"
                    >
                        {{ props.name }}
                    </p>
                    <div class="flex justify-between items-center gap-2">
                        <p
                            class="text-sm text-neutral-500 dark:text-neutral-400 break-all line-clamp-1"
                        >
                            {{ props.avatar_name }}
                        </p>
                        <div class="flex items-center gap-2">
                            <ATooltip :text="dateLocale">
                                <p
                                    class="text-xs text-neutral-600 dark:text-neutral-400 whitespace-nowrap"
                                >
                                    {{ useDateElapsed(date) }}
                                </p>
                            </ATooltip>
                            <ATooltip :text="props.author_name">
                                <NuxtLink
                                    :to="{
                                        name: 'user-id',
                                        params: { id: props.author_id },
                                    }"
                                    class="flex flex-row gap-2 items-center"
                                >
                                    <UAvatar
                                        v-if="fetchAuthorAvatar"
                                        size="xs"
                                        :src="fetchAuthorAvatar"
                                        :alt="props.author_name"
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
                            </ATooltip>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </ItemBase>
</template>
