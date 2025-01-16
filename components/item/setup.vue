<script lang="ts" setup>
interface Props {
    link?: boolean;
    imageSize?: { width: number; height: number } | null;
    noHero?: boolean;
    noUser?: boolean;
    setup: SetupSimple;
}
const props = withDefaults(defineProps<Props>(), {
    link: true,
    image: null,
    imageSize: null,
    noHero: false,
});

const emit = defineEmits(['click']);

const date = new Date(props.setup.created_at);
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
                ? { name: 'setup-id', params: { id: props.setup.id } }
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
                v-if="props.setup.image && !props.noHero"
                class="w-full p-1.5 aspect-video"
            >
                <NuxtImg
                    :src="useGetImage(props.setup.image, { prefix: 'setup' })"
                    :alt="props.setup.name"
                    preset="thumbnail"
                    :placeholder="[50, 25, 75, 5]"
                    class="size-full max-h-[420px] rounded-lg object-cover"
                />
            </div>
        </template>
        <template #thumbnail>
            <NuxtImg
                v-if="props.setup.image && props.noHero"
                :src="useGetImage(props.setup.image, { prefix: 'setup' })"
                :alt="props.setup.name"
                preset="avatarThumbnail"
                :placeholder="[30, 30, 75, 5]"
                class="max-w-20 h-20 my-1.5 ml-1.5 rounded-lg overflow-clip flex-shrink-0 object-cover"
            />

            <NuxtImg
                v-if="!props.setup.image"
                :src="props.setup.avatars[0].thumbnail"
                :alt="props.setup.name"
                preset="avatarThumbnail"
                :placeholder="[30, 30, 75, 5]"
                class="h-20 my-1.5 ml-1.5 rounded-lg overflow-clip flex-shrink-0 object-cover"
            />

            <div
                v-else-if="props.setup.avatars[0].outdated"
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
                    {{ props.setup.name }}
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
                            !props.setup.avatars[0].outdated
                                ? useAvatarName(props.setup.avatars[0].name)
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
                    <HovercardUser v-if="!noUser" :user="props.setup.author">
                        <UiAvatar
                            :url="
                                props.setup.author.avatar
                                    ? useGetImage(props.setup.author.avatar, {
                                          prefix: 'avatar',
                                      })
                                    : ''
                            "
                            :alt="props.setup.author.name ?? ''"
                            aria-hidden="true"
                            :icon-size="12"
                            class="size-5"
                        />
                    </HovercardUser>
                </div>
            </div>
        </template>
    </ItemBase>
</template>
