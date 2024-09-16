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
            <template #header>
                <div
                    class="w-full px-10 flex flex-row gap-2 items-center justify-center"
                >
                    <Icon
                        name="lucide:send"
                        size="20"
                        class="text-neutral-600 dark:text-neutral-400"
                    />
                    <span class="text-black dark:text-white font-medium">
                        アバター詳細の提案
                    </span>
                </div>
            </template>

            <div class="flex flex-col items-center gap-5">
                <p class="font-medium text-neutral-500">提案がまだありません</p>
            </div>

            <template #footer>
                <ATooltip text="準備中" class="w-full">
                    <UButton
                        disabled
                        block
                        label="提案を作成"
                        variant="outline"
                        color="primary"
                    />
                </ATooltip>
            </template>
        </UCard>
    </UModal>
</template>
