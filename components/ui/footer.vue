<script setup lang="ts">
const colorMode = useColorMode();
const modal_feedback = ref(false);

const buttonLink =
    'outline-0 p-1 text-xs font-semibold text-neutral-600 hover:text-neutral-400 dark:text-neutral-400 hover:dark:text-neutral-500 hover:bg-transparent hover:dark:bg-transparent';
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
                        class="outline-0 p-2 hover:bg-neutral-300 hover:dark:bg-neutral-700"
                    />

                    <UiButton
                        to="https://github.com/Liria-works/avatio"
                        new-tab
                        icon="simple-icons:github"
                        class="outline-0 p-2 hover:bg-neutral-300 hover:dark:bg-neutral-700"
                    />

                    <UiButton
                        to="https://liria.work"
                        class="outline-0 p-2 hover:bg-neutral-300 hover:dark:bg-neutral-700"
                    >
                        <LogoLiria
                            :color="
                                colorMode.value === 'dark' ? '#ccc' : '#484848'
                            "
                            :size="18"
                        />
                        <span
                            class="pr-0.5 pt-0.5 font-[Montserrat] font-semibold text-neutral-700 dark:text-neutral-300"
                        >
                            Liria
                        </span>
                    </UiButton>
                </div>

                <div class="flex items-center gap-4">
                    <UiButton
                        to="/release"
                        label="お知らせ"
                        :class="buttonLink"
                    />

                    <UiButton
                        label="フィードバック"
                        :class="buttonLink"
                        @click="modal_feedback = true"
                    />
                </div>
            </div>
            <div class="items-center justify-center gap-4 flex">
                <UiButton
                    disabled
                    tooltip="準備中"
                    label="Avatioについて"
                    :class="buttonLink"
                />

                <UiButton to="/faq" label="FAQ" :class="buttonLink" />

                <UiButton to="/terms" label="利用規約" :class="buttonLink" />

                <UiButton
                    to="/privacy-policy"
                    label="プライバシーポリシー"
                    :class="buttonLink"
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
