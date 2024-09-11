<script lang="ts" setup>
const props = withDefaults(
    defineProps<{
        name: string;
        avatar: number;
        author: string;
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

const fetchAvatar = ref<BoothItem | null>();
const fetchImage = ref();
const loading = ref(true);

onMounted(async () => {
    fetchAvatar.value = await useFetchBooth({ id: props.avatar, url: null });

    if (!fetchAvatar.value) {
        console.log("avatar not found");
        // TODO: アバターがリンク切れの場合のハンドリング
    }

    if (props.image) {
        fetchImage.value = await useGetImage(props.image);
    } else {
        fetchImage.value = null;
    }

    loading.value = false;
});
</script>

<template>
    <ItemBase>
        <template #hero>
            <div v-if="props.image && !fetchImage" class="h-[190px]"></div>
            <div
                v-if="fetchImage && !noHero"
                class="p-1.5 h-[190px] overflow-clip"
            >
                <NuxtImg
                    :src="fetchImage"
                    class="size-full rounded-lg overflow-clip object-cover"
                />
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
                    :src="fetchAvatar?.thumbnail"
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
                            {{
                                fetchAvatar?.avatar_details
                                    ? fetchAvatar.avatar_details.short_ja
                                    : fetchAvatar?.name
                            }}
                        </p>
                        <div class="flex items-center gap-2">
                            <ATooltip :text="dateLocale">
                                <p
                                    class="text-xs text-neutral-600 dark:text-neutral-400 whitespace-nowrap"
                                >
                                    {{ useDateElapsed(date) }}
                                </p>
                            </ATooltip>
                            <AUser :user="props.author" size="sm" />
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </ItemBase>
</template>
