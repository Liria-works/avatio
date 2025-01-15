<script lang="ts" setup>
interface Props {
    initial: string;
}
const props = defineProps<Props>();
const bio = ref<string>(props.initial);
</script>

<template>
    <UiCard :divider="false" footer-class="flex gap-4 items-center justify-end">
        <template #header>
            <UiTitle label="bio" icon="lucide:text" is="h2" />
        </template>
        <UiTextarea
            v-model="bio"
            placeholder="簡単な自己紹介をしてみましょう"
            class="w-full p-3"
        />
        <template #footer>
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
            <ButtonBase label="保存" @click="useSaveBio(bio)" />
        </template>
    </UiCard>
</template>
