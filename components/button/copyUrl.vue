<script lang="ts" setup>
interface Props {
    url: string;
}
const props = defineProps<Props>();
const copied = ref(false);

const writeClipboard = () => {
    useWriteClipboard(props.url);
    copied.value = true;
    setTimeout(() => {
        copied.value = false;
    }, 2000);
};
</script>

<template>
    <ButtonBase
        :icon="copied ? 'lucide:check' : 'lucide:link'"
        :icon-size="18"
        :label="copied ? 'コピーしました' : 'URLをコピー'"
        variant="flat"
        class="w-full outline-0"
        @click="writeClipboard"
    />
</template>
