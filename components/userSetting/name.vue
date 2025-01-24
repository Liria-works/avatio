<script lang="ts" setup>
const username = defineModel<string>({
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
            <UiTitle label="ユーザー名" icon="lucide:pencil" is="h2" />
            <p
                :class="[
                    'text-sm font-medium whitespace-nowrap',
                    !username.length || username.length > 16
                        ? 'text-red-400 dark:text-red-400'
                        : 'text-zinc-700 dark:text-zinc-400',
                ]"
            >
                {{ username ? username.length : 0 }} / 16
            </p>
        </template>

        <UiTextinput v-model="username" placeholder="ユーザー名" />
    </UiCard>
</template>
