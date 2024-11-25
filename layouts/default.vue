<script lang="ts" setup>
useHead({
    bodyAttrs: {
        class: 'bg-[#f0f0f0] dark:bg-[#262626] text-black dark:text-white font-[Murecho] transition duration-50 delay-0 ease-in-out',
    },
    title: 'Avatio',
    link: [
        {
            rel: 'icon',
            type: 'image/png',
            href: '/favicon.ico',
        },
    ],
    meta: [{ name: 'lang', content: 'ja' }],
});

const modal_feedback = ref(false);
</script>

<template>
    <UContainer
        class="flex flex-col gap-10"
        :ui="{ padding: 'pt-4 px-6 md:px-20 lg:px-40' }"
    >
        <UiHeader />
        <slot />
        <UiFooter />

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
    </UContainer>
</template>
