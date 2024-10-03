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
        <div
            class="flex flex-wrap w-full gap-6 pb-10 items-center justify-center"
        >
            <div
                class="flex-col sm:flex-row flex items-center justify-center gap-4 text-neutral-700 dark:text-white"
            >
                <div class="flex items-center gap-2">
                    <UiButton
                        to="https://x.com/liria_work"
                        new-tab
                        icon="simple-icons:x"
                        :outline="false"
                        padding="p-2"
                        color-bg="hover:bg-neutral-300 hover:dark:bg-neutral-700"
                    />

                    <UiButton
                        to="https://github.com/Liria-works/avatio"
                        new-tab
                        icon="simple-icons:github"
                        :outline="false"
                        padding="p-2"
                        color-bg="hover:bg-neutral-300 hover:dark:bg-neutral-700"
                    />

                    <NuxtLink
                        to="https://liria.work"
                        target="_blank"
                        class="cursor-pointer flex gap-2 items-center justify-center rounded-lg p-1 px-2 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                    >
                        <LogoLiria color="#ccc" :size="18" />
                        <span
                            class="pr-0.5 pt-0.5 font-[Montserrat] font-semibold text-neutral-300"
                        >
                            Liria
                        </span>
                    </NuxtLink>
                </div>

                <div class="flex items-center gap-4">
                    <UiButton
                        to="/releases"
                        label="お知らせ"
                        :outline="false"
                        padding="p-1"
                        text="text-xs font-semibold"
                        color-text="text-neutral-400 hover:text-neutral-500"
                        color-bg=""
                    />

                    <UiButton
                        label="フィードバック"
                        :outline="false"
                        padding="p-1"
                        text="text-xs font-semibold"
                        color-text="text-neutral-400 hover:text-neutral-500"
                        color-bg=""
                        @click="modal_feedback = true"
                    />
                </div>
            </div>
            <div
                class="items-center justify-center gap-4 flex text-neutral-700 dark:text-white"
            >
                <UiButton
                    tooltip="準備中"
                    label="Avatioについて"
                    :outline="false"
                    padding="p-1"
                    text="text-xs font-semibold"
                    color-text="text-neutral-400 hover:text-neutral-500"
                    color-bg=""
                />

                <UiButton
                    to="/faq"
                    label="FAQ"
                    :outline="false"
                    padding="p-1"
                    text="text-xs font-semibold"
                    color-text="text-neutral-400 hover:text-neutral-500"
                    color-bg=""
                />

                <UiButton
                    to="/terms"
                    tooltip="準備中"
                    label="利用規約"
                    :outline="false"
                    padding="p-1"
                    text="text-xs font-semibold"
                    color-text="text-neutral-400 hover:text-neutral-500"
                    color-bg=""
                />

                <UiButton
                    to="/privacy-policy"
                    tooltip="準備中"
                    label="プライバシーポリシー"
                    :outline="false"
                    padding="p-1"
                    text="text-xs font-semibold"
                    color-text="text-neutral-400 hover:text-neutral-500"
                    color-bg=""
                />
            </div>
            <p class="text-neutral-500 text-sm">Copyright © 2024 Liria</p>
        </div>

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
    </footer>
</template>
