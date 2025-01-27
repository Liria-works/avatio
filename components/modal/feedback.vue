<script lang="ts" setup>
const vis = defineModel<boolean>({
    default: false,
});
const client = await useSupabaseClient();

const feedback = ref<string>('');

const Submit = async () => {
    if (!feedback.value.length)
        return useAddToast('フィードバックを入力してください');

    const { error } = await client
        .from('feedback')
        .insert({ contents: feedback.value } as never);

    if (error) return useAddToast('フィードバックの送信に失敗');

    useAddToast('フィードバックを送信しました');
    vis.value = false;
};
</script>

<template>
    <ModalBase v-model="vis">
        <template #header>
            <div class="flex items-center gap-2 justify-between">
                <DialogTitle>
                    <UiTitle label="フィードバック" icon="lucide:lightbulb" />
                </DialogTitle>

                <HovercardFeedback>
                    <Icon
                        name="lucide:info"
                        class="flex-shrink-0 size-4 text-zinc-400 dark:text-zinc-300"
                    />
                </HovercardFeedback>
            </div>
        </template>

        <div class="flex flex-col gap-5">
            <div class="relative">
                <UiTextarea
                    autoresize
                    placeholder="なにかアイデアがあればお送りください！"
                />
                <Icon
                    name="simple-icons:markdown"
                    class="absolute right-2 bottom-1 size-6 flex-shrink-0 select-none bg-zinc-500"
                />
            </div>
        </div>

        <template #footer>
            <div class="gap-1.5 flex items-center justify-between">
                <ButtonBase
                    label="キャンセル"
                    variant="flat"
                    @click="vis = false"
                />
                <ButtonBase label="送信" @click="Submit" />
            </div>
        </template>
    </ModalBase>
</template>
