<script lang="ts" setup>
const bio = defineModel<string>({
    default: '',
});
</script>

<template>
    <UiCard
        :divider="false"
        class="pb-4"
        header-class="flex gap-4 items-center justify-between"
    >
        <template #header>
            <UiTitle label="bio" icon="lucide:text" is="h2" />
            <p
                :class="[
                    'text-sm font-medium whitespace-nowrap',
                    bio && bio.length > 141
                        ? 'text-red-400 dark:text-red-400'
                        : 'text-zinc-700 dark:text-zinc-400',
                ]"
            >
                {{ bio ? bio.length : 0 }} / 140
            </p>
        </template>
        <UiTextarea
            v-model="bio"
            placeholder="簡単な自己紹介をしてみましょう"
            class="w-full p-3"
        />
    </UiCard>
</template>
