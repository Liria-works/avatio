<!-- eslint-disable vue/no-dupe-keys -->
<script lang="ts" setup>
const note = defineModel<string>('note', {
    required: true,
    default: '',
});
const unsupported = defineModel<boolean>('unsupported', {
    default: false,
});

const emit = defineEmits(['remove']);

interface Props {
    size?: 'md' | 'lg';
    item: Item;
}
const props = withDefaults(defineProps<Props>(), {
    size: 'md',
});

const booth_url = 'https://booth.pm/ja/items/';
</script>

<template>
    <ItemBase>
        <template #thumbnail>
            <div
                :class="[
                    'draggable flex-shrink-0 flex items-center gap-1.5',
                    props.size === 'lg' ? 'p-4' : 'p-1.5 pr-4',
                ]"
            >
                <Icon
                    name="lucide:grip-vertical"
                    :size="18"
                    class="bg-zinc-400 cursor-move"
                />
                <NuxtLink
                    :to="booth_url + props.item.id"
                    target="_blank"
                    :class="[
                        'rounded-lg object-cover select-none overflow-hidden',
                        props.size === 'lg' ? 'size-32' : 'size-20',
                    ]"
                >
                    <NuxtImg
                        :src="props.item.thumbnail"
                        :alt="props.item.name"
                        :class="props.item.nsfw ? 'blur-md' : ''"
                    />
                </NuxtLink>
            </div>
        </template>
        <template #main>
            <div class="draggable w-full flex gap-5 pr-4 justify-between">
                <div
                    :class="`w-fit flex flex-col gap-3 items-start justify-center ${props.size === 'lg' ? 'h-32' : 'h-20'}`"
                >
                    <div class="w-fit gap-2 flex items-center">
                        <NuxtLink
                            :to="booth_url + props.item.id"
                            target="_blank"
                            class="w-fit gap-2"
                        >
                            <p
                                class="w-fit text-sm font-medium leading-normal break-before-all line-clamp-2 text-black dark:text-white"
                            >
                                {{ useSentence(props.item.name) }}
                            </p>
                        </NuxtLink>

                        <UiTooltip v-if="props.item.nsfw" text="NSFW">
                            <Icon
                                name="lucide:heart"
                                size="18"
                                class="text-pink-400"
                            />
                        </UiTooltip>
                    </div>

                    <div class="flex items-center gap-3">
                        <NuxtLink
                            :to="booth_url + props.item.id"
                            target="_blank"
                            class="text-sm font-semibold leading-none whitespace-nowrap text-zinc-700 dark:text-zinc-300"
                        >
                            {{ props.item.price }}
                        </NuxtLink>

                        <NuxtLink
                            :to="`https://${props.item.shop.id}.booth.pm/`"
                            target="_blank"
                            class="flex items-center gap-1.5 w-fit"
                        >
                            <NuxtImg
                                :src="props.item.shop.thumbnail"
                                :alt="props.item.shop.name"
                                class="size-5 rounded-md select-none border border-zinc-300"
                            />
                            <span
                                class="text-xs font-semibold leading-none line-clamp-1 break-all text-zinc-700 dark:text-zinc-300 xs"
                            >
                                {{ props.item.shop.name }}
                            </span>
                            <Icon
                                v-if="props.item.shop.verified"
                                name="lucide:check"
                                size="16"
                                class="flex-shrink-0 size-3 text-zinc-700 dark:text-zinc-300"
                            />
                        </NuxtLink>
                    </div>
                </div>
                <div
                    class="flex-shrink-0 w-fit h-full pt-2 gap-4 flex flex-col items-end justify-between"
                >
                    <ButtonBase
                        icon="lucide:trash"
                        :icon-size="16"
                        tooltip="アイテム削除"
                        class="p-3"
                        @click="emit('remove')"
                    />

                    <UCheckbox
                        v-model="unsupported"
                        name="unsupported"
                        :ui="{ label: 'text-xs' }"
                        label="アバター非対応"
                    />
                </div>
            </div>
        </template>
        <template #under>
            <div
                :class="`w-full flex flex-col items-end gap-2 ${props.size === 'lg' ? 'px-4 pb-3' : 'px-1.5 pt-1 pb-2'}`"
            >
                <div
                    :class="[
                        'w-full px-3 py-2 gap-2 flex items-center rounded-lg bg-zinc-200 dark:bg-zinc-800 ring-inset ring-1 ring-zinc-300 dark:ring-zinc-700',
                        {
                            'border border-red-400 dark:border-red-400':
                                note.length > 140,
                        },
                    ]"
                >
                    <Icon
                        name="lucide:pen-line"
                        :width="15"
                        :height="15"
                        class="self-start flex-shrink-0 mt-[0.2rem] text-zinc-400 dark:text-zinc-400"
                    />
                    <UTextarea
                        v-model="note"
                        autoresize
                        placeholder="ノートを追加"
                        :padded="false"
                        variant="none"
                        size="sm"
                        :rows="1"
                        :ui="{ rounded: 'rounded-none' }"
                        class="w-full"
                    />
                </div>
                <p
                    v-if="note.length > 140"
                    class="text-sm text-red-400 dark:text-red-400"
                >
                    {{ note.length }} / 140
                </p>
            </div>
        </template>
    </ItemBase>
</template>
