<script setup lang="ts">
const colorMode = useColorMode();
const modal_feedback = ref(false);
</script>

<template>
    <footer class="flex flex-col gap-10">
        <UDivider
            :ui="{
                border: { base: 'border-neutral-300 dark:border-neutral-600' },
            }"
        >
            <LogoLiria
                :color="colorMode.value === 'dark' ? '#f0f0f0' : '#484848'"
                :filled="true"
            />
        </UDivider>
        <div class="flex flex-col w-full gap-6 pb-10 items-center">
            <div
                class="flex-col sm:flex-row flex items-center justify-center gap-4 text-neutral-700 dark:text-white"
            >
                <div class="flex items-center gap-4">
                    <NuxtLink to="/releases">
                        <AButton
                            text="お知らせ"
                            icon="lucide:megaphone"
                            :icon-size="22"
                        />
                    </NuxtLink>

                    <AButton
                        text="フィードバック"
                        icon="lucide:lightbulb"
                        :icon-size="22"
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
                </div>

                <div class="flex items-center gap-4">
                    <NuxtLink to="https://x.com/liria_work" target="_blank">
                        <AButton icon="simple-icons:x" :icon-size="20" />
                    </NuxtLink>
                    <NuxtLink
                        to="https://github.com/Liria-works/avatio"
                        target="_blank"
                    >
                        <AButton icon="simple-icons:github" :icon-size="22" />
                    </NuxtLink>

                    <NuxtLink
                        to="https://liria.work"
                        target="_blank"
                        class="cursor-pointer flex gap-2 items-center justify-center rounded-full px-4 py-2 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                    >
                        <LogoLiria color="#a3a3a3" :filled="true" />
                        <span
                            class="pr-0.5 pt-0.5 font-[Montserrat] font-semibold"
                            >Liria</span
                        >
                    </NuxtLink>
                </div>
            </div>
            <div
                class="items-center justify-center gap-4 flex text-neutral-700 dark:text-white"
            >
                <UButton variant="link">Avatioについて</UButton>
                <UButton to="/faq" variant="link">FAQ</UButton>

                <UButton to="/terms" variant="link">利用規約</UButton>

                <UButton to="/privacy-policy" variant="link"
                    >プライバシーポリシー</UButton
                >
            </div>
            <span class="text-neutral-500 text-sm">Copyright © 2024 Liria</span>
        </div>
    </footer>
</template>
