<script lang="ts" setup>
interface Props {
    id: number;
}
const { id } = defineProps<Props>();

const user = useSupabaseUser();

const modalLogin = ref(false);
const modalReport = ref(false);
</script>

<template>
    <Button
        label="セットアップを報告"
        icon="lucide:flag"
        :icon-size="16"
        variant="flat"
        class="w-fit px-3 py-2 mt-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-300 hover:dark:bg-zinc-700"
        icon-class="text-red-400 dark:text-red-400"
        @click="
            if (user) modalReport = true;
            else modalLogin = true;
        "
    />

    <ModalReportSetup v-model="modalReport" :id="id" />
    <Modal v-model="modalLogin">
        <UiLogin />
    </Modal>
</template>
