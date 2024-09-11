<script setup lang="ts">
import { createClient } from "@vercel/edge-config";

const modal_feedback = ref(false);

let isMaintenance: boolean | undefined = false;

try {
    const runtimeConfig = useRuntimeConfig();
    const edgeConfig = createClient(runtimeConfig.public.edgeConfig);

    isMaintenance = await edgeConfig.get("isMaintenance");
    console.log("isMaintenance", isMaintenance);
} catch (e) {
    console.error(e);
}
</script>

<template>
    <div v-if="!isMaintenance" class="size-full">
        <UContainer
            class="flex flex-col gap-10"
            :ui="{ padding: 'px-8 pt-6 sm:px-20 lg:px-20' }"
        >
            <AHeader />
            <NuxtPage />
            <AFooter />
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
    </div>
</template>

<style>
body {
    background-color: #f0f0f0;
}

.dark body {
    background-color: #262626;
}
</style>
