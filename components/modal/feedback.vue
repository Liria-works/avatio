<script lang="ts" setup>
const vis = defineModel<boolean>({ default: false });
const client = useSupabaseClient();

const feedback = ref<string>('');

const Submit = async () => {
    if (!feedback.value.length)
        return useToast().add('フィードバックを入力してください');

    const { error } = await client
        .from('feedback')
        .insert({ contents: feedback.value });

    if (error) return useToast().add('フィードバックの送信に失敗');

    useToast().add('フィードバックを送信しました');
    vis.value = false;
};
</script>

<template>
    <Modal v-model="vis">
        <template #header>
            <div class="flex items-center gap-2 justify-between">
                <DialogTitle>
                    <UiTitle label="フィードバック" icon="lucide:lightbulb" />
                </DialogTitle>

                <HovercardFeedback>
                    <Icon
                        name="lucide:info"
                        class="shrink-0 size-4 text-zinc-400 dark:text-zinc-300"
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
                    class="absolute right-2 bottom-1 size-6 shrink-0 select-none bg-zinc-500"
                />
            </div>
        </div>

        <template #footer>
            <div class="gap-1.5 flex items-center justify-between">
                <Button
                    label="キャンセル"
                    variant="flat"
                    @click="vis = false"
                />
                <Button label="送信" @click="Submit" />
            </div>
        </template>
    </Modal>
</template>
