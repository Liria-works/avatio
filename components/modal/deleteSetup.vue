<script lang="ts" setup>
const props = defineProps<{
    id: number;
    image: string | null;
}>();

const vis = defineModel<boolean>({
    default: false,
});

const emit = defineEmits(['close']);
</script>

<template>
    <ModalBase v-model="vis">
        <template #header>
            <UiTitle label="セットアップ削除" icon="lucide:trash" />
        </template>

        <span
            class="w-full text-md font-normal text-neutral-800 dark:text-neutral-100 text-center"
        >
            セットアップを削除します。<br />
            この操作は取り消せません。よろしいですか？
        </span>

        <template #footer>
            <div class="flex gap-2 items-center justify-end">
                <UiButton
                    label="削除"
                    class="text-red-500 dark:text-red-400 hover:text-white hover:dark:text-white hover:bg-red-500 hover:dark:bg-red-800 hover:outline-red-400 hover:dark:outline-red-700"
                    @click="
                        useDeleteSetup(props.id, props.image);
                        emit('close');
                    "
                />
                <UiButton label="キャンセル" @click="emit('close')" />
            </div>
        </template>
    </ModalBase>
</template>
