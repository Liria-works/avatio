<script lang="ts" setup>
const vis = defineModel<boolean>({
    default: false,
});
const emit = defineEmits(['close']);
const client = await useSBClient();

const feedback = ref<string>('');
const submited = ref(false);

const Submit = async () => {
    if (!feedback.value.length)
        return useAddToast('フィードバックを入力してください');

    const { error } = await client
        .from('feedback')
        .insert({ contents: feedback.value } as never);

    if (error) return useAddToast('フィードバックの送信に失敗');

    submited.value = true;
    useAddToast('フィードバックを送信しました');
};
</script>

<template>
    <ModalBase v-model="vis">
        <template #header>
            <div class="flex items-center gap-2 justify-between">
                <UiTitle label="フィードバック" icon="lucide:lightbulb" />
                <PopupFeedback />
            </div>
        </template>

        <div v-if="!submited" class="flex flex-col gap-5">
            <div class="relative">
                <UTextarea
                    autoresize
                    placeholder="なにかアイデアがあればお送りください！"
                    :ui="{
                        color: {
                            white: {
                                outline:
                                    'transition duration-50 delay-0 ease-in-out focus:ring-neutral-500 dark:focus:ring-neutral-500 hover:ring-2 dark:hover:ring-neutral-500',
                            },
                        },
                    }"
                />
                <Icon
                    name="simple-icons:markdown"
                    class="absolute right-2 bottom-1 size-6 flex-shrink-0 select-none bg-neutral-500"
                />
            </div>
        </div>

        <div v-if="submited" class="w-full flex flex-col items-center">
            <p class="text-neutral-400">
                フィードバックを送信しました。<br />
                ご協力ありがとうございます！
            </p>
        </div>

        <template #footer v-if="!submited">
            <div class="gap-1.5 flex items-center justify-end">
                <UiButton label="送信" @click="Submit" />
                <UiButton label="キャンセル" @click="emit('close')" />
            </div>
        </template>
    </ModalBase>
</template>
