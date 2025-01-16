<script lang="ts" setup>
interface Props {
    initial: string;
}
const props = defineProps<Props>();
const username = ref<string>(props.initial);
</script>

<template>
    <UiCard :divider="false" footer-class="flex gap-4 items-center justify-end">
        <template #header>
            <UiTitle label="ユーザー名" icon="lucide:pencil" is="h2" />
        </template>

        <UiTextinput v-model="username" placeholder="ユーザー名" />

        <template #footer>
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
            <ButtonBase label="保存" @click="useSaveUsername(username)" />
        </template>
    </UiCard>
</template>
