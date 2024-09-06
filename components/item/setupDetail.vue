<script lang="ts" setup>
const props = withDefaults(
    defineProps<{
        name: string;
        description: string | null;
        avatar: number;
        author: string;
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
        fetchImage.value = fetchImage.value.publicUrl;
    } else {
        fetchImage.value = null;
    }

    loading.value = false;
});
</script>

<template>
    <ItemBase>
        <template #thumbnail>
            <div class="p-2 flex-shrink-0">
                <NuxtImg
                    :src="fetchImage ? fetchImage : fetchAvatar?.thumbnail"
                    :alt="props.name"
                    class="h-28 w-28 md:w-auto object-cover rounded-lg overflow-clip"
                />
            </div>
        </template>
        <template #main>
            <div class="w-full flex justify-between">
                <div
                    class="w-full flex flex-col gap-3 justify-between px-4 py-5"
                >
                    <div class="flex flex-col gap-1">
                        <p
                            class="text-lg font-medium text-neutral-700 dark:text-neutral-200 break-all line-clamp-1"
                        >
                            {{ props.name }}
                        </p>
                        <p
                            v-if="fetchAvatar"
                            class="text-sm text-neutral-500 dark:text-neutral-400 break-keep line-clamp-1"
                        >
                            {{ useSentence(fetchAvatar.name) }}
                        </p>
                    </div>
                    <div class="flex justify-between items-center">
                        <p
                            class="text-sm text-neutral-600 dark:text-neutral-400 break-all line-clamp-1"
                        >
                            {{ props.description ? props.description : "" }}
                        </p>
                        <div class="flex items-center gap-2">
                            <ATooltip :text="dateLocale">
                                <p
                                    class="text-sm text-neutral-600 dark:text-neutral-400 whitespace-nowrap"
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
