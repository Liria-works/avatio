<script setup lang="ts">
// import { createClient } from "@vercel/edge-config";

useSeoMeta({
    title: "Avatio",
    ogTitle: "Avatio",
    description: "アバターセットアップ共有サービス",
    ogDescription: "アバターセットアップ共有サービス",
    ogImage: "https://example.com/image.png", // todo
    twitterCard: "summary_large_image",
});

const modal_feedback = ref(false);

// let isMaintenance: boolean | undefined = false;

// try {
//     // const runtimeConfig = useRuntimeConfig();
//     // const edgeConfig = createClient(runtimeConfig.public.edgeConfig);
//     // isMaintenance = await edgeConfig.get("isMaintenance");
//     // console.log("isMaintenance", isMaintenance);
// } catch (e) {
//     console.error(e);
// }
</script>

<template>
    <UContainer
        class="flex flex-col gap-10"
        :ui="{ padding: 'pt-4 px-6 md:px-20 lg:px-40' }"
    >
        <UiHeader />
        <NuxtPage />
        <UiFooter />
    </UContainer>
    <UButton
        size="xl"
        icon="lucide:lightbulb"
        label="フィードバック"
        :ui="{ rounded: 'rounded-full' }"
        class="fixed bottom-6 right-6 pr-[18px]"
        @click="modal_feedback = true"
    />
    <UModal
        v-model="modal_feedback"
        :ui="{
            background: 'bg-white dark:bg-neutral-800',
            ring: 'ring-0',
            rounded: 'rounded-xl',
            overlay: { background: 'backdrop-blur-sm' },
        }"
    >
        <ModalFeedback />
    </UModal>
    <UNotifications />
</template>

<style>
body {
    background-color: #f0f0f0;
    font-family: "Murecho";
}

.dark body {
    background-color: #262626;
}
</style>
