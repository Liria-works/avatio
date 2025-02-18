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
    <div
        class="flex items-center ring-2 ring-zinc-300 dark:ring-zinc-700 rounded-lg overflow-clip"
    >
        <div class="draggable cursor-move w-10 h-full p-1.5">
            <div
                class="size-full rounded-lg flex items-center justify-center hover:bg-zinc-800 transition duration-150"
            >
                <Icon
                    name="lucide:grip-vertical"
                    :size="22"
                    class="text-zinc-400"
                />
            </div>
        </div>

        <div class="w-full py-2 pr-2 flex flex-col gap-2">
            <div class="w-full flex gap-2 items-start">
                <NuxtLink
                    :to="booth_url + props.item.id"
                    target="_blank"
                    :data-size="props.size"
                    class="shrink-0 select-none"
                >
                    <NuxtImg
                        :src="props.item.thumbnail"
                        :alt="props.item.name"
                        :data-size="props.size"
                        :data-nsfw="props.item.nsfw"
                        class="size-20 rounded-lg data-[size=lg]:size-32 data-[nsfw=true]:blur-md"
                    />
                </NuxtLink>

                <div class="self-center w-full flex flex-col gap-3 items-start">
                    <div class="gap-2 flex items-center">
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
                                :src="props.item.shop.thumbnail ?? ''"
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
                                class="shrink-0 size-3 text-zinc-700 dark:text-zinc-300"
                            />
                        </NuxtLink>
                    </div>
                </div>

                <div
                    class="self-stretch flex flex-col gap-1 items-center justify-between"
                >
                    <Popup class="p-1">
                        <template #trigger>
                            <Button variant="flat" class="p-2">
                                <Icon
                                    name="lucide:menu"
                                    size="18"
                                    class="text-zinc-300"
                                />
                            </Button>
                        </template>

                        <template #content>
                            <div class="flex flex-col gap-0.5 text-sm min-w-32">
                                <Button
                                    variant="flat"
                                    @click="unsupported = !unsupported"
                                >
                                    <Icon
                                        name="lucide:user-x"
                                        size="18"
                                        class="text-zinc-400"
                                    />
                                    <span>アバター非対応</span>
                                </Button>
                                <Button variant="flat" @click="emit('remove')">
                                    <Icon
                                        name="lucide:x"
                                        size="18"
                                        class="text-red-400"
                                    />
                                    <span class="text-red-400">削除</span>
                                </Button>
                            </div>
                        </template>
                    </Popup>

                    <UiTooltip v-if="unsupported" text="アバター非対応">
                        <Icon
                            name="lucide:user-x"
                            size="16"
                            class="text-zinc-300"
                        />
                    </UiTooltip>
                </div>
            </div>

            <div class="w-full flex flex-col gap-2">
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
                        class="self-start shrink-0 mt-[0.2rem] text-zinc-400 dark:text-zinc-400"
                    />
                    <UiTextarea
                        v-model="note"
                        autoresize
                        placeholder="ノートを追加"
                        :rows="1"
                        unstyled
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
        </div>
    </div>
</template>
