<script lang="ts" setup>
interface Props {
    link?: boolean;
    setupItems?: boolean;
    setup: Setup;
}
const props = withDefaults(defineProps<Props>(), {
    link: true,
    image: null,
    setupItems: false,
});

const emit = defineEmits(['click']);

const date = new Date(props.setup.created_at);
const dateLocale = date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
});

const avatar = props.setup.items.filter((i) => i.data.category === 208)[0].data;
const nonAvatarItems = props.setup.items
    .filter((i) => i.data.category !== 208)
    .map((i) => i.data);
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
        <template #thumbnail>
            <div class="p-2 flex-shrink-0">
                <NuxtImg
                    v-if="props.setup.images.length"
                    :src="
                        useGetImage(props.setup.images[0].name, {
                            prefix: 'setup',
                        })
                    "
                    :alt="props.setup.name"
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
                <div class="flex flex-col items-start gap-1">
                    <p
                        class="text-lg font-medium text-zinc-700 dark:text-zinc-200 break-all line-clamp-1"
                    >
                        {{ props.setup.name }}
                    </p>

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
                                !avatar.outdated
                                    ? useAvatarName(avatar.name)
                                    : '不明なベースアバター'
                            }}
                        </span>
                    </div>
                </div>
                <div class="gap-4 flex justify-between items-center">
                    <p
                        class="text-sm text-zinc-600 dark:text-zinc-400 break-all line-clamp-1"
                    >
                        {{
                            props.setup.description
                                ? props.setup.description
                                : ''
                        }}
                    </p>
                    <div class="flex items-center gap-2">
                        <UiTooltip :text="dateLocale">
                            <p
                                class="text-sm text-zinc-600 dark:text-zinc-400 whitespace-nowrap"
                            >
                                {{ useDateElapsed(date) }}
                            </p>
                        </UiTooltip>
                        <HovercardUser :user="props.setup.author">
                            <UiAvatar
                                :url="
                                    props.setup.author.avatar
                                        ? useGetImage(
                                              props.setup.author.avatar,
                                              {
                                                  prefix: 'avatar',
                                              }
                                          )
                                        : ''
                                "
                                :alt="props.setup.author.name ?? ''"
                                :icon-size="14"
                                class="size-6"
                            />
                        </HovercardUser>
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
