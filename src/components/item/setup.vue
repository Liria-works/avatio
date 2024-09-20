<script lang="ts" setup>
import Tooltip from "../tooltip.vue";
import Avatar from "../avatar.vue";
import ItemBase from "./base.vue";
import { elapseDate } from "../../lib/date";
import { avatarName } from "../../lib/text";

const props = withDefaults(
    defineProps<{
        name: string;
        avatar_name: string;
        avatar_thumbnail: string;
        author_id: string;
        author_name: string;
        author_avatar: string | null;
        createdAt: string;
        image: string | null;
        noHero?: boolean;
    }>(),
    {
        image: null,
        noHero: false,
    }
);

const date = new Date(props.createdAt);
const dateLocale = date.toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
});
</script>

<template>
    <ItemBase>
        <template #hero>
            <div v-if="props.image && !noHero" class="px-1.5 pt-1.5 pb-0.5">
                <div class="max-h-80 rounded-lg overflow-hidden">
                    <img :src="'https://imbxeblwlopxrgexztsx.supabase.co/storage/v1/object/public/images/' + props.image"
                        class="size-full rounded-lg object-cover" />
                </div>
            </div>
        </template>
        <template #thumbnail>
            <div v-if="props.image && noHero" class="py-1.5 pl-1.5 flex-shrink-0 max-w-20">
                <img :src="props.image" :alt="props.name" class="h-14 rounded-lg overflow-clip object-cover" />
            </div>

            <div v-if="!props.image" class="py-1.5 pl-1.5 flex-shrink-0">
                <img :src="props.avatar_thumbnail" :alt="props.name" class="h-14 rounded-lg overflow-clip" />
            </div>
        </template>
        <template #main>
            <div class="w-full h-16 flex justify-between">
                <div class="w-full flex flex-col justify-center gap-0.5 py-2 pr-2 pl-3">
                    <p class="text-sm font-medium text-neutral-700 dark:text-neutral-200 break-all line-clamp-1">
                        {{ props.name }}
                    </p>
                    <div class="flex justify-between items-center gap-2">
                        <p class="text-xs text-neutral-500 dark:text-neutral-400 break-all line-clamp-1">
                            {{ avatarName(props.avatar_name) }}
                        </p>
                        <div class="flex items-center gap-2">
                            <Tooltip :text="dateLocale">
                                <p class="text-xs text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                                    {{ elapseDate(date) }}
                                </p>
                            </Tooltip>
                            <Avatar :id="props.author_id" :name="props.author_name" />
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </ItemBase>
</template>
