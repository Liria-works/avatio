<script lang="ts" setup>
const props = withDefaults(
    defineProps<{
        id: number;
        name: string;
        avatarName: string;
        avatarThumbnail: string;
        authorId: string;
        authorName: string;
        authorAvatar: string | null;
        createdAt: string;
        image: string | null;
        imageSize?: { width: number; height: number } | null;
        noHero?: boolean;
        noUser?: boolean;
    }>(),
    {
        image: null,
        imageSize: null,
        noHero: false,
    }
);

const date = new Date(props.createdAt);
const dateLocale = date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
});

// const fetchAvatar = ref<BoothItem | null>();

// onMounted(async () => {
// fetchAvatar.value = await useFetchBooth({ id: props.avatar, url: null });
// if (!fetchAvatar.value) {
//     console.log("avatar not found");
//     // TODO: アバターがリンク切れの場合のハンドリング
// }
// });
</script>

<template>
    <NuxtLink :to="{ name: 'setup-id', params: { id: props.id } }">
        <ItemBase
            class="hover:bg-neutral-200 dark:hover:bg-neutral-700 transition duration-50 delay-0 ease-in-out"
        >
            <template #hero>
                <div
                    v-if="props.image && !noHero"
                    class="w-full p-1.5 aspect-video"
                >
                    <NuxtImg
                        :src="useGetImage(props.image)"
                        format="webp"
                        quality="85"
                        sizes="300px"
                        loading="lazy"
                        class="size-full max-h-[420px] rounded-lg object-cover"
                    />
                </div>
            </template>
            <template #thumbnail>
                <div
                    v-if="props.image && noHero"
                    class="py-1.5 pl-1.5 flex-shrink-0 max-w-20"
                >
                    <NuxtImg
                        :src="useGetImage(props.image)"
                        :alt="props.name"
                        fit="cover"
                        format="webp"
                        quality="80"
                        sizes="80px"
                        class="h-14 rounded-lg overflow-clip flex-shrink-0 object-cover"
                    />
                </div>

                <div v-if="!props.image" class="py-1.5 pl-1.5 flex-shrink-0">
                    <NuxtImg
                        :src="props.avatarThumbnail"
                        :alt="props.name"
                        fit="cover"
                        format="webp"
                        quality="80"
                        sizes="56px"
                        loading="lazy"
                        class="h-14 rounded-lg overflow-clip flex-shrink-0"
                    />
                </div>
            </template>
            <template #main>
                <div
                    class="w-full py-2 pr-2 pl-3 flex flex-col justify-center gap-1"
                >
                    <p
                        class="text-sm font-medium text-neutral-700 dark:text-neutral-200 break-all line-clamp-1 leading-none"
                    >
                        {{ props.name }}
                    </p>
                    <div class="flex justify-between items-center gap-2">
                        <p
                            class="text-xs text-neutral-500 dark:text-neutral-400 break-all line-clamp-1 leading-none"
                        >
                            {{ useAvatarName(props.avatarName) }}
                        </p>
                        <div class="flex items-center gap-2">
                            <UiTooltip :text="dateLocale">
                                <p
                                    class="text-xs text-neutral-600 dark:text-neutral-400 whitespace-nowrap"
                                >
                                    {{ useDateElapsed(date) }}
                                </p>
                            </UiTooltip>
                            <UiTooltip v-if="!noUser" :text="props.authorName">
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
                                        :src="useGetImage(props.authorAvatar)"
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
    </NuxtLink>
</template>
