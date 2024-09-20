<script setup lang="ts">
import { Icon } from "@iconify/vue";

import Tooltip from "./tooltip.vue";

const props = withDefaults(
    defineProps<{
        image?: string | null;
        id: string;
        name: string;
    }>(),
    {
        image: null,
    }
);
</script>

<template>
    <Tooltip :text="props.name">
        <div size-6 rounded-full flex-shrink-0 overflow-clip>
            <img v-if="props.image" :src="props.image" :alt="props.name" size-full />
            <div v-else size-full flex items-center justify-center bg="neutral-600 dark:neutral-500">
                <Icon icon="lucide:user-round" :width="14" :height="14" text="neutral-100 dark:neutral-300" />
            </div>
        </div>
    </Tooltip>
</template>