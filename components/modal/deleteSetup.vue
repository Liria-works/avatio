<script lang="ts" setup>
const props = defineProps<{
    id: number;
}>();

const vis = defineModel<boolean>({
    default: false,
});
</script>

<template>
    <Modal v-model="vis">
        <template #header>
            <UiTitle label="セットアップ削除" icon="lucide:trash" />
        </template>

        <span
            class="w-full text-md font-normal text-zinc-800 dark:text-zinc-100 text-center"
        >
            セットアップを削除します。<br />
            この操作は取り消せません。よろしいですか？
        </span>

        <template #footer>
            <div class="flex gap-2 items-center justify-end">
                <Button
                    label="削除"
                    class="text-red-500 dark:text-red-400 hover:text-white hover:dark:text-white hover:bg-red-500 hover:dark:bg-red-800 hover:outline-red-400 hover:dark:outline-red-700"
                    @click="
                        useDeleteSetup(props.id);
                        vis = false;
                    "
                />
                <Button label="キャンセル" @click="vis = false" />
            </div>
        </template>
    </Modal>
</template>
