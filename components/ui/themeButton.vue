<script lang="ts" setup>
const colorMode = useColorMode();
</script>

<template>
    <UiButton
        tooltip="テーマ"
        aria-label="テーマ"
        variant="flat"
        class="hidden sm:block p-2.5 hover:bg-zinc-300 hover:dark:bg-zinc-600"
        @click="
            colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
        "
    >
        <ClientOnly>
            <Icon
                v-if="colorMode.value === 'light'"
                name="lucide:sun"
                size="20"
                class="text-zinc-800 dark:text-zinc-200"
            />
            <Icon
                v-else
                name="lucide:moon"
                size="20"
                class="text-zinc-800 dark:text-zinc-200"
            />
            <template #fallback>
                <Icon
                    name="lucide:palette"
                    size="20"
                    class="text-zinc-800 dark:text-zinc-200"
                />
            </template>
        </ClientOnly>
    </UiButton>
</template>
