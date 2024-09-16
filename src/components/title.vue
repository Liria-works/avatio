<script setup lang="ts">
import { Icon } from "@iconify/vue";

const props = withDefaults(
    defineProps<{
        label: string;
        icon?: string;

        infomation?: string;
    }>(),
    {
        icon: "",
        infomation: "",
    }
);
</script>

<template>
    <div class="flex items-center gap-2">
        <Icon :icon="props.icon" :width="20" :height="20" class="text-neutral-500 dark:text-neutral-400" />
        <div class="font-bold text-neutral-900 dark:text-neutral-100">
            {{ props.label }}
        </div>
    </div>
</template>
