<script lang="ts" setup>
interface Props {
    user: Author;
}
const props = defineProps<Props>();
</script>

<template>
    <HovercardBase side="top" class="px-4 py-2.5">
        <template #trigger>
            <slot />
        </template>
        <template #content>
            <div class="flex items-center gap-3">
                <UiAvatar
                    :url="
                        props.user.avatar
                            ? useGetImage(props.user.avatar, {
                                  prefix: 'avatar',
                              })
                            : ''
                    "
                    :alt="props.user.name"
                    :icon-size="18"
                    class="size-10"
                />
                <span
                    class="text-sm font-semibold leading-none text-zinc-700 dark:text-zinc-300"
                >
                    {{ props.user.name }}
                </span>
            </div>
        </template>
    </HovercardBase>
</template>
