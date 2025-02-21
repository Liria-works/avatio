<script lang="ts" setup>
interface Props {
    setupName: string;
    setupDescription: string;
    setupAuthor: string;
    copyUrlButton?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
    copyUrlButton: true,
});

const { share, isSupported } = useShare();

const tweet = `http://x.com/intent/tweet?text=${encodeURIComponent(props.setupName + ' | ' + props.setupAuthor)}&url=${useBrowserLocation().value.href!}&hashtags=avatio`;
</script>

<template>
    <Popup>
        <template #trigger>
            <slot />
        </template>

        <template #content>
            <div class="flex flex-col gap-0.5 text-sm min-w-48">
                <ButtonCopyUrl
                    v-if="props.copyUrlButton"
                    :url="useBrowserLocation().value.href!"
                />

                <Button
                    :to="tweet"
                    new-tab
                    icon="simple-icons:x"
                    :icon-size="18"
                    label="ポスト"
                    class="w-full outline-0"
                />
                <Button
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
    </Popup>
</template>
