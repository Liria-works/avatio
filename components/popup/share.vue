<script lang="ts" setup>
const props = defineProps<{
    currentUrl: string;
    setupName: string;
    setupDescription: string;
    setupAuthor: string;
}>();

const { share, isSupported } = useShare();

const tweet = `http://x.com/intent/tweet?text=${encodeURIComponent(props.setupName + ' | ' + props.setupAuthor)}&url=${props.currentUrl}&hashtags=avatio`;
</script>

<template>
    <PopupBase mode="click">
        <template #trigger>
            <UiButton
                icon="lucide:share-2"
                :icon-size="18"
                tooltip="シェア"
                class="p-2.5 hover:bg-neutral-300 hover:dark:bg-neutral-600"
            />
        </template>

        <template #panel="{ close }">
            <div class="flex flex-col gap-0.5 text-sm min-w-48">
                <UiButton
                    :to="tweet"
                    new-tab
                    icon="simple-icons:x"
                    :icon-size="18"
                    label="ポスト"
                    class="w-full outline-0"
                />
                <UiButton
                    icon="lucide:link"
                    :icon-size="18"
                    label="URLをコピー"
                    class="w-full outline-0"
                    @click="
                        useWriteClipboard(props.currentUrl);
                        close();
                    "
                />
                <UiButton
                    v-if="isSupported"
                    icon="lucide:share-2"
                    :icon-size="18"
                    label="その他"
                    class="w-full outline-0"
                    @click="
                        share({
                            title: props.setupName,
                            text: props.setupDescription,
                            url: currentUrl,
                        })
                    "
                />
            </div>
        </template>
    </PopupBase>
</template>
