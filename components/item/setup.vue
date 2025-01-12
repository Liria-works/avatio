<script lang="ts" setup>
interface Props {
    link?: boolean;
    id: number;
    name: string;
    avatar: { name: string; thumbnail: string; outdated: boolean };
    author: Author;
    createdAt: string;
    image: string | null;
    imageSize?: { width: number; height: number } | null;
    noHero?: boolean;
    noUser?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
    link: true,
    image: null,
    imageSize: null,
    noHero: false,
});

const emit = defineEmits(['click']);

const date = new Date(props.createdAt);
const dateLocale = date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
});
</script>

<template>
    <ItemBase
        :to="
            props.link
                ? { name: 'setup-id', params: { id: props.id } }
                : undefined
        "
        :class="[
            'hover:ring-2 hover:ring-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:shadow-xl shadow-black dark:shadow-white/10',
            'transition duration-50 ease-in-out',
        ]"
        @click="emit('click')"
    >
        <template #hero>
            <div
                v-if="props.image && !noHero"
                class="w-full p-1.5 aspect-video"
            >
                <NuxtImg
                    :src="useGetImage(props.image, { prefix: 'setup' })"
                    :alt="props.name"
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
                :src="props.avatar.thumbnail"
                :alt="props.name"
                preset="avatarThumbnail"
                :placeholder="[30, 30, 75, 5]"
                class="h-20 my-1.5 ml-1.5 rounded-lg overflow-clip flex-shrink-0 object-cover"
            />

            <div
                v-else-if="props.avatar.outdated"
                class="size-14 my-1.5 ml-1.5 rounded-lg flex flex-shrink-0 items-center justify-center text-zinc-400 bg-zinc-300 dark:bg-zinc-600"
            >
                ?
            </div>
        </template>
        <template #main>
            <div
                class="w-full py-2 pr-2 pl-3 flex flex-col items-start justify-center gap-2"
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

                <div class="flex items-center gap-1">
                    <Icon
                        name="lucide:person-standing"
                        size="15"
                        class="bg-zinc-500 dark:bg-zinc-400"
                    />
                    <span
                        class="text-xs text-zinc-500 dark:text-zinc-400 break-all line-clamp-1 leading-none"
                    >
                        {{
                            !props.avatar.outdated
                                ? useAvatarName(props.avatar.name)
                                : '不明なベースアバター'
                        }}
                    </span>
                </div>

                <div class="self-end flex items-center gap-2">
                    <UiTooltip :text="dateLocale">
                        <p
                            class="text-xs text-zinc-600 dark:text-zinc-400 whitespace-nowrap"
                        >
                            {{ useDateElapsed(date) }}
                        </p>
                    </UiTooltip>
                    <HovercardUser v-if="!noUser" :user="props.author">
                        <NuxtLink
                            :to="{
                                name: 'user-id',
                                params: { id: props.author.id },
                            }"
                            :aria-label="props.author.name"
                            class="flex flex-row gap-2 items-center"
                        >
                            <UiAvatar
                                :url="
                                    props.author.avatar
                                        ? useGetImage(props.author.avatar, {
                                              prefix: 'avatar',
                                          })
                                        : ''
                                "
                                :alt="props.author.name ?? ''"
                                aria-hidden="true"
                                :icon-size="12"
                                class="size-5"
                            />
                        </NuxtLink>
                    </HovercardUser>
                </div>
            </div>
        </template>
    </ItemBase>
</template>
