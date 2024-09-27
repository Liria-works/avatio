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

// import { tv } from "tailwind-variants";

// const emit = defineEmits(["remove", "update:note", "update:unsupported"]);

// const props = withDefaults(
//     defineProps<{
//         size?: "md" | "lg";
//         note?: string | null;
//         unsupported?: boolean;
//         id: number;
//     }>(),
//     {
//         size: "md",
//         note: null,
//         unsupported: false,
//     }
// );

// const booth_url = "https://booth.pm/ja/items/";

// const note = ref<string>(props.note ? props.note : "");
// const unsupported = ref<boolean>(props.unsupported);

// const itemData = ref<BoothItem | null>(null);
// const loading = ref(true);

// watch(note, (value) => {
//     emit("update:note", value);
// });

// watch(unsupported, (value) => {
//     emit("update:unsupported", value);
// });

// onMounted(async () => {
//     itemData.value = await useFetchBooth({ id: props.id, url: null });
//     loading.value = false;
// });

// const modal = tv({
//     slots: {
//         thumbnail: "rounded-lg object-cover",
//         thumbnailFrame: "flex-shrink-0",
//         infoFrame: "w-fit flex flex-col gap-3 items-start justify-center",
//         name: "w-fit text-black dark:text-white font-medium break-keep",
//     },
//     variants: {
//         size: {
//             lg: {
//                 thumbnail: "size-32",
//                 thumbnailFrame: "p-4",
//                 infoFrame: "h-32",
//                 name: "line-clamp-2",
//             },
//             md: {
//                 thumbnail: "size-20",
//                 thumbnailFrame: "p-1.5 pr-4",
//                 infoFrame: "h-20",
//                 name: "line-clamp-1",
//             },
//         },
//         nsfw: {
//             true: {
//                 thumbnail: "blur-md",
//             },
//         },
//     },
// });
// const { thumbnail, thumbnailFrame, infoFrame, name } = modal({
//     size: props.size,
//     nsfw: itemData.value?.nsfw,
// });
</script>

<template>
    <!-- <ItemBase v-if="itemData">
        <template #thumbnail>
            <div :class="thumbnailFrame()">
                <NuxtImg :src="itemData.thumbnail" :alt="itemData.name" :class="thumbnail()" />
            </div>
        </template>
        <template #main>
            <div class="w-full flex gap-5 pr-4 justify-between">
                <div :class="infoFrame()">
                    <div class="w-fit flex items-center gap-2">
                        <NuxtLink :to="booth_url + props.id" target="_blank" class="w-fit gap-2">
                            <p :class="name()">
                                {{ useSentence(itemData.name) }}
                            </p>
                        </NuxtLink>

                        <UiTooltip v-if="itemData.nsfw" text="NSFW">
                            <Icon name="heroicons:heart-16-solid" size="18" class="text-pink-400" />
                        </UiTooltip>
                    </div>

                    <NuxtLink :to="`https://${itemData.shopId}.booth.pm/`" target="_blank"
                        class="flex items-center gap-1.5 w-fit">
                        <NuxtImg :src="itemData.shopThumbnail" :alt="itemData.shop" class="size-5 rounded-md" />
                        <span class="text-neutral-700 dark:text-neutral-300 text-sm font-medium line-clamp-1 break-all">
                            {{ itemData.shop }}
                        </span>
                        <Icon v-if="itemData.shopVerified" name="lucide:check" size="16"
                            class="flex-shrink-0 text-neutral-700 dark:text-neutral-300 size-3" />
                    </NuxtLink>
                </div>
                <div class="w-fit flex flex-col-reverse sm:flex-row items-end sm:items-center gap-3 flex-shrink-0">
                    <UCheckbox v-if="itemData.category !== 208" v-model="unsupported" label="アバター非対応" :ui="{
                        label: 'text-nowrap font-normal text-sm select-none',
                    }" />

                    <UiButton @click="$emit('remove')" icon="lucide:trash" :icon-size="16" tooltip="アイテム削除" />
                </div>
            </div>
        </template>
        <template #under>
            <div class="w-full flex px-1.5 pb-2 pt-1">
                <div class="w-full px-3 py-2 gap-2 flex items-center rounded-lg bg-neutral-200 dark:bg-neutral-600">
                    <Icon name="lucide:pen-line" size="14"
                        class="self-start flex-shrink-0 mt-0.5 text-neutral-400 dark:text-neutral-400" />
                    <UTextarea v-model="note" autoresize placeholder="ノートを追加" :padded="false" variant="none" size="sm"
                        :rows="1" class="w-full" />
                </div>
            </div>
        </template>
    </ItemBase> -->

    <ItemBase>
        <template #thumbnail>
            <div
                :class="`flex-shrink-0 ${props.size === 'lg' ? 'p-4' : 'p-1.5 pr-4'}`"
            >
                <div class="overflow-clip rounded-lg">
                    <NuxtLink :to="booth_url + props.id" target="_blank">
                        <NuxtImg
                            :src="props.thumbnail"
                            :alt="props.name"
                            :class="`rounded-lg object-cover select-none ${props.size === 'lg' ? 'size-32' : 'size-20'} ${props.nsfw ? 'blur-md' : ''}`"
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
                                class="w-fit text-sm font-medium break-before-all line-clamp-2 text-black dark:text-white"
                            >
                                {{ useSentence(props.name) }}
                            </p>
                        </NuxtLink>

                        <Tooltip v-if="props.nsfw" text="NSFW">
                            <Icon
                                name="heroicons:heart-16-solid"
                                size="18"
                                class="text-pink-400"
                            />
                        </Tooltip>
                    </div>

                    <div flex items-center gap-3>
                        <NuxtLink
                            :to="booth_url + props.id"
                            target="_blank"
                            class="text-sm font-semibold whitespace-nowrap text-neutral-700 dark:text-neutral-300"
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
                                class="font-semibold line-clamp-1 break-all text-neutral-700 dark:text-neutral-300 xs"
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
                    class="w-fit h-full pt-2 gap-2 flex flex-col items-end justify-between"
                >
                    <UiButton
                        icon="lucide:trash"
                        :icon-size="16"
                        tooltip="アイテム削除"
                        padding="p-3"
                        @click="$emit('remove')"
                    />

                    <!-- <label
                        v-if="!props.avatar"
                        flex
                        items-center
                        gap-2
                        pr-1
                        cursor-pointer
                    >
                        <CheckboxRoot
                            v-model:checked="unsupported"
                            size-4.5
                            rounded-md
                            overflow-clip
                            class="border border-1 border-neutral-500"
                        >
                            <CheckboxIndicator
                                flex
                                items-center
                                justify-center
                                size-full
                                bg="neutral-500 dark:neutral-400"
                            >
                                <Icon
                                    name="lucide:check"
                                    self-center
                                    size-3
                                    text="neutral-100 dark:neutral-800"
                                />
                            </CheckboxIndicator>
                        </CheckboxRoot>
                        <span
                            class="text-xs select-none whitespace-nowrap text-neutral-700 dark:text-neutral-300"
                            >アバター非対応</span
                        >
                    </label> -->
                </div>
            </div>
        </template>
        <template #under>
            <div
                class="w-full flex flex-col items-end gap-2"
                :class="`${props.size === 'lg' ? 'px-4 pb-3' : 'px-1.5 pt-1 pb-2'}`"
            >
                <div
                    class="w-full px-3 py-2 gap-2 flex items-center rounded-lg"
                    bg="neutral-200 dark:neutral-600"
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
                        class="w-full"
                    />
                </div>
            </div>
        </template>
    </ItemBase>
</template>
