<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        title: string;
        icon?: string;
        trailing?: string;
        trailingIcon?: string;
    }>(),
    {
        icon: "lucide:circle",
        trailing: "",
        trailingIcon: "lucide:arrow-right",
    }
);
</script>

<template>
    <div class="flex-col items-start gap-3 flex w-full">
        <div class="flex items-center justify-between w-full">
            <div class="items-center gap-1.5 inline-flex">
                <Icon
                    :name="props.icon"
                    :width="20"
                    :height="20"
                    class="text-neutral-500 dark:text-neutral-400"
                />
                <div class="text-black dark:text-white text-[15px] font-medium">
                    {{ props.title }}
                </div>
            </div>
            <button
                v-if="props.trailing"
                class="items-center gap-1 inline-flex"
            >
                <div class="text-black dark:text-neutral-400 text-sm">
                    {{ props.trailing }}
                </div>
                <Icon
                    :name="props.trailingIcon"
                    :width="18"
                    :height="18"
                    class="text-neutral-600 dark:text-neutral-400"
                />
            </button>
        </div>
        <slot />
    </div>
</template>
