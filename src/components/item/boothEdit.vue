<!-- eslint-disable vue/no-dupe-keys -->
<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import { Icon } from "@iconify/vue";
import { CheckboxIndicator, CheckboxRoot } from 'radix-vue'
import { sentence } from "../../lib/text";

import Button from "../button.vue";
import Tooltip from "../tooltip.vue";
import ItemBase from "./base.vue";

const emit = defineEmits(["remove", "update:note", "update:unsupported"]);

const props = withDefaults(
    defineProps<{
        size?: "md" | "lg";
        avatar?: boolean;
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
        updated_at: string;
    }>(),
    {
        size: "md",
        avatar: false,
        note: null,
        unsupported: false,
    }
);

const booth_url = "https://booth.pm/ja/items/";

const note = ref<string>(props.note ? props.note : "");
const unsupported = ref<boolean>(props.unsupported);

// const itemData = ref<BoothItem | null>(null);
const loading = ref(true);

watch(note, (value) => {
    emit("update:note", value);
});

watch(unsupported, (value) => {
    emit("update:unsupported", value);
});

// onMounted(async () => {
//     props.value = await useFetchBooth({ id: props.id, url: null });
//     loading.value = false;
// });
</script>

<template>
    <ItemBase>
        <template #thumbnail>
            <div flex-shrink-0 :p="props.size === 'lg' ? '4' : '1.5 r-4'">
                <div overflow-clip rounded-lg>
                    <a :href="booth_url + props.id" target="_blank">
                        <img :src="props.thumbnail" :alt="props.name" rounded-lg object-cover select-none
                            :size="props.size === 'lg' ? '32' : '20'" :blur="props.nsfw ? 'md' : ''" />
                    </a>
                </div>
            </div>
        </template>
        <template #main>
            <div w-full flex gap-5 pr-4 justify-between>
                <div w-fit flex flex-col gap-3 items-start justify-center :h="props.size === 'lg' ? '32' : '20'">
                    <div w-fit gap-2 flex items-center>
                        <a :href="booth_url + props.id" target="_blank" w-fit gap-2>
                            <p w-fit text-sm font-medium break-keep text="black dark:white"
                                :class="`${props.size === 'lg' ? 'line-clamp-2' : 'line-clamp-1'}`">
                                {{ sentence(props.name) }}
                            </p>
                        </a>

                        <Tooltip v-if="props.nsfw" text="NSFW">
                            <Icon icon="heroicons:heart-16-solid" size="18" text-pink-400 />
                        </Tooltip>
                    </div>

                    <div flex items-center gap-3>

                        <a :href="booth_url + props.id" target="_blank" text-sm font-semibold
                            class="text-neutral-700 dark:text-neutral-300">
                            {{ props.price }}
                        </a>

                        <a :href="`https://${props.shopId}.booth.pm/`" target="_blank" flex items-center gap-1.5 w-fit>
                            <img :src="props.shopThumbnail" :alt="props.shop" size-5 rounded-md select-none
                                class="border border-1 border-neutral-300" />
                            <span font-semibold line-clamp-1 break-all text="neutral-700 dark:neutral-300 xs">
                                {{ props.shop }}
                            </span>
                            <Icon v-if="props.shopVerified" icon="lucide:check" size="16" flex-shrink-0 size-3
                                text="neutral-700 dark:neutral-300" />
                        </a>
                    </div>
                </div>
                <div w-fit h-full pt-2 gap-2 flex flex-col items-end justify-between>

                    <Button icon="lucide:trash" :icon-size="16" tooltip="アイテム削除" padding="p-3"
                        @click="$emit('remove')" />

                    <label v-if="!props.avatar" flex items-center gap-2 pr-1 cursor-pointer>
                        <CheckboxRoot v-model:checked="unsupported" size-4.5 rounded-md overflow-clip
                            class="border border-1 border-neutral-500">
                            <CheckboxIndicator flex items-center justify-center size-full
                                bg="neutral-500 dark:neutral-400">
                                <Icon icon="lucide:check" self-center size-3 text="neutral-100 dark:neutral-800" />
                            </CheckboxIndicator>
                        </CheckboxRoot>
                        <span text-xs text="neutral-700 dark:neutral-300" select-none>アバター非対応</span>
                    </label>
                </div>
            </div>
        </template>
        <template #under>
            <div w-full flex flex-col items-end gap-2
                :class="`${props.size === 'lg' ? 'px-4 pb-3' : 'px-1.5 pt-1 pb-2'}`">

                <div w-full px-3 py-2 gap-2 flex items-center rounded-lg bg="neutral-200 dark:neutral-600">
                    <Icon icon="lucide:pen-line" :width="15" :height="15" self-start flex-shrink-0 mt="[0.2rem]"
                        text="neutral-400 dark:neutral-400" />
                    <textarea v-model="note" placeholder="ノートを追加" :rows="1" w-full bg-transparent resize-none
                        outline-none text-sm />
                </div>
            </div>
        </template>
    </ItemBase>
</template>
