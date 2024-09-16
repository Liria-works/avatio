<script setup lang="ts">
import { Icon } from "@iconify/vue";

import Tooltip from "./tooltip.vue";

const props = withDefaults(
    defineProps<{
        image?: string | null;
        user: string;
    }>(),
    {
        image: null,
        user: "",
    }
);
</script>

<template>
    <Tooltip :text="props.user">
        <div class="size-6 rounded-full flex-shrink-0 overflow-clip">
            <img v-if="props.image" :src="props.image" :alt="props.user" class="size-full" />
            <div v-else bg="neutral-600 dark:neutral-500" class="size-full flex items-center justify-center">
                <Icon icon="lucide:user-round" :width="14" :height="14" text="neutral-100 dark:neutral-300" />
            </div>
        </div>
    </Tooltip>
</template>