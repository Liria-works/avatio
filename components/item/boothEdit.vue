<!-- eslint-disable vue/no-dupe-keys -->
<script lang="ts" setup>
const emit = defineEmits(["remove", "update:note", "update:unsupported"]);

const props = withDefaults(
    defineProps<{
        size?: "md" | "lg";
        note?: string | null;
        unsupported?: boolean;
        id: number;
        name: string;
        thumbnail: string;
        price: string;
        shop: string;
        shopId: string;
        shopThumbnail: string;
        shopVerified: boolean;
        nsfw: boolean;
        updatedAt: string;
    }>(),
    {
        size: "md",
        note: null,
        unsupported: false,
    }
);

const booth_url = "https://booth.pm/ja/items/";

const note = ref<string>(props.note ? props.note : "");
const unsupported = ref<boolean>(props.unsupported);

watch(note, (value) => {
    emit("update:note", value);
});

watch(unsupported, (value) => {
    emit("update:unsupported", value);
});
</script>

<template>
    <ItemBase>
        <template #thumbnail>
            <div
                :class="`flex-shrink-0 ${props.size === 'lg' ? 'p-4' : 'p-1.5 pr-4'}`"
            >
                <div
                    :class="[
                        'rounded-lg object-cover select-none overflow-hidden',
                        props.size === 'lg' ? 'size-32' : 'size-20',
                    ]"
                >
                    <NuxtLink :to="booth_url + props.id" target="_blank">
                        <NuxtImg
                            :src="props.thumbnail"
                            :alt="props.name"
                            :class="props.nsfw ? 'blur-md' : ''"
                        />
                    </NuxtLink>
                </div>
            </div>
        </template>
        <template #main>
            <div class="w-full flex gap-5 pr-4 justify-between">
                <div
                    :class="`w-fit flex flex-col gap-3 items-start justify-center ${props.size === 'lg' ? 'h-32' : 'h-20'}`"
                >
                    <div class="w-fit gap-2 flex items-center">
                        <NuxtLink
                            :to="booth_url + props.id"
                            target="_blank"
                            class="w-fit gap-2"
                        >
                            <p
                                class="w-fit text-sm font-medium leading-normal break-before-all line-clamp-2 text-black dark:text-white"
                            >
                                {{ useSentence(props.name) }}
                            </p>
                        </NuxtLink>

                        <UiTooltip v-if="props.nsfw" text="NSFW">
                            <Icon
                                name="heroicons:heart-16-solid"
                                size="18"
                                class="text-pink-400"
                            />
                        </UiTooltip>
                    </div>

                    <div class="flex items-center gap-3">
                        <NuxtLink
                            :to="booth_url + props.id"
                            target="_blank"
                            class="text-sm font-semibold leading-none whitespace-nowrap text-neutral-700 dark:text-neutral-300"
                        >
                            {{ props.price }}
                        </NuxtLink>

                        <NuxtLink
                            :to="`https://${props.shopId}.booth.pm/`"
                            target="_blank"
                            class="flex items-center gap-1.5 w-fit"
                        >
                            <NuxtImg
                                :src="props.shopThumbnail"
                                :alt="props.shop"
                                class="size-5 rounded-md select-none border border-1 border-neutral-300"
                            />
                            <span
                                class="text-xs font-semibold leading-none line-clamp-1 break-all text-neutral-700 dark:text-neutral-300 xs"
                            >
                                {{ props.shop }}
                            </span>
                            <Icon
                                v-if="props.shopVerified"
                                name="lucide:check"
                                size="16"
                                class="flex-shrink-0 size-3 text-neutral-700 dark:text-neutral-300"
                            />
                        </NuxtLink>
                    </div>
                </div>
                <div
                    class="flex-shrink-0 w-fit h-full pt-2 gap-4 flex flex-col items-end justify-between"
                >
                    <UiButton
                        icon="lucide:trash"
                        :icon-size="16"
                        tooltip="アイテム削除"
                        ui="p-3"
                        @click="$emit('remove')"
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
                        'w-full px-3 py-2 gap-2 flex items-center rounded-lg bg-neutral-200 dark:bg-neutral-600',
                        {
                            'border border-1 border-red-400 dark:border-red-400':
                                note.length > 140,
                        },
                    ]"
                >
                    <Icon
                        name="lucide:pen-line"
                        :width="15"
                        :height="15"
                        class="self-start flex-shrink-0 mt-[0.2rem] text-neutral-400 dark:text-neutral-400"
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
