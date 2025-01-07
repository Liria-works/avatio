<script lang="ts" setup>
const props = withDefaults(
    defineProps<{
        id: number;
        name: string;
        avatarName: string;
        avatarThumbnail: string;
        avatarOutdated: boolean;
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
</script>

<template>
    <ItemBase
        :to="{ name: 'setup-id', params: { id: props.id } }"
        class="hover:bg-zinc-200 dark:hover:bg-zinc-700 transition duration-50 delay-0 ease-in-out"
    >
        <template #hero>
            <div
                v-if="props.image && !noHero"
                class="w-full p-1.5 aspect-video"
            >
                <NuxtImg
                    :src="useGetImage(props.image, { prefix: 'setup' })"
                    preset="thumbnail"
                    :placeholder="[50, 25, 75, 5]"
                    class="size-full max-h-[420px] rounded-lg object-cover"
                />
            </div>
        </template>
        <template #thumbnail>
            <NuxtImg
                v-if="props.image && noHero"
                :src="useGetImage(props.image, { prefix: 'setup' })"
                :alt="props.name"
                preset="avatarThumbnail"
                :placeholder="[30, 30, 75, 5]"
                class="max-w-20 h-20 my-1.5 ml-1.5 rounded-lg overflow-clip flex-shrink-0 object-cover"
            />

            <NuxtImg
                v-if="!props.image"
                :src="props.avatarThumbnail"
                :alt="props.name"
                preset="avatarThumbnail"
                :placeholder="[30, 30, 75, 5]"
                class="h-20 my-1.5 ml-1.5 rounded-lg overflow-clip flex-shrink-0 object-cover"
            />

            <div
                v-else-if="props.avatarOutdated"
                class="size-14 my-1.5 ml-1.5 rounded-lg flex flex-shrink-0 items-center justify-center text-zinc-400 bg-zinc-300 dark:bg-zinc-600"
            >
                ?
            </div>
        </template>
        <template #main>
            <div
                class="w-full py-2 pr-2 pl-3 flex flex-col justify-center gap-1.5"
            >
                <span
                    :class="[
                        'text-md font-medium text-zinc-700 dark:text-zinc-200 break-all',
                        noHero
                            ? 'line-clamp-1 leading-none'
                            : 'line-clamp-2 leading-1',
                    ]"
                >
                    {{ props.name }}
                </span>

                <span
                    class="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 break-all line-clamp-1 leading-none"
                >
                    {{
                        !props.avatarOutdated
                            ? useAvatarName(props.avatarName)
                            : '不明なベースアバター'
                    }}
                </span>

                <div class="self-end flex items-center gap-2">
                    <UiTooltip :text="dateLocale">
                        <p
                            class="text-xs text-zinc-600 dark:text-zinc-400 whitespace-nowrap"
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
                            <UiAvatar
                                :url="
                                    props.authorAvatar
                                        ? useGetImage(props.authorAvatar)
                                        : ''
                                "
                                :alt="props.authorName ?? ''"
                                :icon-size="14"
                                class="size-6"
                            />
                        </NuxtLink>
                    </UiTooltip>
                </div>
            </div>
        </template>
    </ItemBase>
</template>
