<script lang="ts" setup>
const props = defineProps<{ open: boolean }>();
const emit = defineEmits(["update:open"]);

const isOpen = ref(props.open);

watch(
    () => props.open,
    (newVal) => {
        isOpen.value = newVal;
    }
);

watch(isOpen, (newVal) => {
    emit("update:open", newVal);
});
</script>

<template>
    <UModal
        v-model="isOpen"
        :ui="{
            background: 'bg-white dark:bg-neutral-700',
            ring: 'ring-0',
            rounded: 'rounded-xl',
        }"
    >
        <UCard
            :ui="{
                ring: '',
                divide: 'divide-y divide-gray-100 dark:divide-gray-800',
            }"
        >
            <div class="flex flex-col gap-5">
                未実装 : サンプルアバター掲載機能
            </div>

            <template #footer>
                <div class="flex flex-col items-start gap-1">
                    <UButton disabled variant="link" :padded="false">
                        リンクが間違っていますか？
                    </UButton>
                    <UButton disabled variant="link" :padded="false">
                        サンプルアバター掲載の停止依頼はこちら
                    </UButton>
                </div>
            </template>
        </UCard>
    </UModal>
</template>
