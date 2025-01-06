<script lang="ts" setup>
const props = defineProps<{
    setupName: string;
    setupDescription: string;
    setupAuthor: string;
}>();

const { share, isSupported } = useShare();

const tweet = `http://x.com/intent/tweet?text=${encodeURIComponent(props.setupName + ' | ' + props.setupAuthor)}&url=${useBrowserLocation().value.href!}&hashtags=avatio`;
</script>

<template>
    <PopupBase>
        <template #trigger>
            <UiButton
                icon="lucide:share-2"
                :icon-size="18"
                tooltip="シェア"
                class="p-2.5 hover:bg-zinc-300 hover:dark:bg-zinc-600"
            />
        </template>

        <template #panel>
            <div class="flex flex-col gap-0.5 text-sm min-w-48">
                <UiButton
                    :tabindex="0"
                    :to="tweet"
                    new-tab
                    icon="simple-icons:x"
                    :icon-size="18"
                    label="ポスト"
                    class="w-full outline-0"
                />
                <UiButton
                    :tabindex="1"
                    icon="lucide:link"
                    :icon-size="18"
                    label="URLをコピー"
                    class="w-full outline-0"
                    @click="useWriteClipboard(useBrowserLocation().value.href!)"
                />
                <UiButton
                    :tabindex="2"
                    v-if="isSupported"
                    icon="lucide:share-2"
                    :icon-size="18"
                    label="その他"
                    class="w-full outline-0"
                    @click="
                        share({
                            title: props.setupName,
                            text: props.setupDescription,
                            url: useBrowserLocation().value.href!,
                        })
                    "
                />
            </div>
        </template>
    </PopupBase>
</template>
