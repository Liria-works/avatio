<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        is?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
        size?: 'md' | 'lg';
        label: string;
        icon?: string;
        trailing?: string;
        trailingIcon?: string;
    }>(),
    {
        is: 'h1',
        size: 'md',
        icon: '',
        trailing: '',
        trailingIcon: 'lucide:arrow-right',
        infomation: '',
    }
);
</script>

<template>
    <div class="flex items-center justify-between">
        <div class="items-center gap-1.5 inline-flex">
            <Icon
                v-if="props.icon.length"
                :name="props.icon"
                :size="props.size === 'md' ? 20 : 24"
                class="flex-shrink-0 text-zinc-500 dark:text-zinc-400"
            />
            <component
                :is="props.is"
                :class="[
                    'text-black dark:text-white whitespace-nowrap',
                    props.size === 'md'
                        ? 'text-[15px] font-medium'
                        : 'text-xl font-bold',
                ]"
            >
                {{ props.label }}
            </component>
        </div>
        <button v-if="props.trailing" class="items-center gap-1 inline-flex">
            <div class="text-black dark:text-zinc-400 text-sm">
                {{ props.trailing }}
            </div>
            <Icon
                :name="props.trailingIcon"
                :size="18"
                class="text-zinc-600 dark:text-zinc-400"
            />
        </button>
    </div>
</template>
