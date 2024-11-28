<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        size?: 'md' | 'lg';
        label: string;
        icon?: string;
        trailing?: string;
        trailingIcon?: string;
        infomation?: string;
    }>(),
    {
        size: 'md',
        icon: 'lucide:circle',
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
                :name="props.icon"
                :size="props.size === 'md' ? 20 : 24"
                class="text-neutral-500 dark:text-neutral-400"
            />
            <div
                :class="[
                    'text-black dark:text-white',
                    props.size === 'md'
                        ? 'text-[15px] font-medium'
                        : 'text-xl font-bold',
                ]"
            >
                {{ props.label }}
            </div>
            <UTooltip
                v-if="props.infomation"
                :prevent="props.infomation ? false : true"
                :text="props.infomation"
                :popper="{ placement: 'top' }"
                :ui="{
                    ring: 'ring-1 ring-gray-300 dark:ring-gray-600',
                }"
                class="rounded-full"
            >
                <Icon
                    name="lucide:info"
                    size="15"
                    class="ml-1 text-neutral-500 dark:text-neutral-400"
                />
            </UTooltip>
        </div>
        <button v-if="props.trailing" class="items-center gap-1 inline-flex">
            <div class="text-black dark:text-neutral-400 text-sm">
                {{ props.trailing }}
            </div>
            <Icon
                :name="props.trailingIcon"
                :size="18"
                class="text-neutral-600 dark:text-neutral-400"
            />
        </button>
    </div>
</template>
