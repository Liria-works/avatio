<script lang="ts" setup>
const props = withDefaults(
    defineProps<{
        user: Author;
        size?: 'md' | 'sm';
    }>(),
    {
        size: 'md',
    }
);
</script>

<template>
    <div v-if="size === 'md'" class="flex items-center justify-between">
        <NuxtLink
            :to="{ name: 'user-id', params: { id: props.user.id } }"
            class="flex flex-row gap-3 items-center"
        >
            <UAvatar
                v-if="props.user.avatar && props.user.avatar.length"
                :src="useGetImage(props.user.avatar)"
                :alt="props.user.name"
            />
            <div
                v-else
                class="flex items-center justify-center size-[25px] rounded-full flex-shrink-0 bg-neutral-200 dark:bg-neutral-500"
            >
                <Icon
                    name="lucide:user-round"
                    size="14"
                    class="text-neutral-600 dark:text-neutral-300"
                />
            </div>
            <p class="text-black dark:text-white pb-0.5 text-left font-normal">
                {{ props.user.name }}
            </p>
        </NuxtLink>
    </div>

    <UiTooltip v-else-if="size === 'sm'" :text="props.user.name">
        <NuxtLink
            :to="{ name: 'user-id', params: { id: props.user.id } }"
            class="flex flex-row gap-2 items-center"
        >
            <UAvatar
                v-if="props.user.avatar && props.user.avatar.length"
                size="xs"
                :src="useGetImage(props.user.avatar)"
                :alt="props.user.name"
            />
            <div
                v-else
                class="flex items-center justify-center size-[25px] rounded-full flex-shrink-0 bg-neutral-200 dark:bg-neutral-500"
            >
                <Icon
                    name="lucide:user-round"
                    size="14"
                    class="text-neutral-600 dark:text-neutral-300"
                />
            </div>
        </NuxtLink>
    </UiTooltip>
</template>
