<script lang="ts" setup>
const props = withDefaults(
    defineProps<{
        id: number;
        createdAt: string;
        name: string;
        description: string | null;
        image: string | null;
        author: Author;
        items: Item[];
        setupItems?: boolean;
    }>(),
    {
        image: null,
        setupItems: false,
    }
);

const date = new Date(props.createdAt);
const dateLocale = date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
});

const avatar = props.items.filter((i) => i.category === 208)[0];
const nonAvatarItems = props.items.filter((i) => i.category !== 208);
</script>

<template>
    <ItemBase
        :to="{ name: 'setup-id', params: { id: props.id } }"
        class="hover:bg-zinc-200 dark:hover:bg-zinc-700 transition duration-50 delay-0 ease-in-out"
    >
        <template #thumbnail>
            <div class="p-2 flex-shrink-0">
                <NuxtImg
                    v-if="props.image"
                    :src="useGetImage(props.image, { prefix: 'setup' })"
                    :alt="props.name"
                    class="size-28 md:w-auto md:max-w-40 object-cover rounded-lg overflow-clip text-xs"
                />
                <NuxtImg
                    v-else-if="!avatar.outdated"
                    :src="avatar.thumbnail"
                    :alt="avatar.name"
                    class="size-28 md:w-auto md:max-w-40 object-cover rounded-lg overflow-clip text-xs"
                />
                <div
                    v-else
                    class="size-28 rounded-lg flex flex-shrink-0 items-center justify-center text-zinc-400 bg-zinc-300 dark:bg-zinc-600"
                >
                    ?
                </div>
            </div>
        </template>
        <template #main>
            <div class="w-full flex flex-col gap-3 justify-between px-4 py-5">
                <div class="flex flex-col gap-1">
                    <p
                        class="text-lg font-medium text-zinc-700 dark:text-zinc-200 break-all line-clamp-1"
                    >
                        {{ props.name }}
                    </p>
                    <p
                        class="text-sm text-zinc-500 dark:text-zinc-400 break-keep line-clamp-1"
                    >
                        {{
                            !avatar.outdated
                                ? useSentence(useAvatarName(avatar.name))
                                : '不明なベースアバター'
                        }}
                    </p>
                </div>
                <div class="gap-4 flex justify-between items-center">
                    <p
                        class="text-sm text-zinc-600 dark:text-zinc-400 break-all line-clamp-1"
                    >
                        {{ props.description ? props.description : '' }}
                    </p>
                    <div class="flex items-center gap-2">
                        <UiTooltip :text="dateLocale">
                            <p
                                class="text-sm text-zinc-600 dark:text-zinc-400 whitespace-nowrap"
                            >
                                {{ useDateElapsed(date) }}
                            </p>
                        </UiTooltip>
                        <UiTooltip :text="props.author.name">
                            <NuxtLink
                                :to="{
                                    name: 'user-id',
                                    params: { id: props.author.id },
                                }"
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
                                    :icon-size="14"
                                    class="size-6"
                                />
                            </NuxtLink>
                        </UiTooltip>
                    </div>
                </div>
            </div>
        </template>

        <template #under v-if="props.setupItems && nonAvatarItems.length">
            <div class="max-w-44 p-2 pt-0 gap-2 flex">
                <ItemTiny
                    v-for="i in nonAvatarItems"
                    :key="useId()"
                    :label="i.name"
                    :thumbnail="i.thumbnail"
                    class="whitespace-nowrap"
                />
            </div>
        </template>
    </ItemBase>
</template>
