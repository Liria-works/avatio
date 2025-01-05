<script lang="ts" setup>
const vis = defineModel<boolean>({
    default: false,
});
const client = await useSBClient();

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

                <!-- <PopupFeedback /> -->

                <HoverCardRoot :open-delay="0" :close-delay="300">
                    <HoverCardTrigger as-child>
                        <Icon
                            name="lucide:info"
                            class="flex-shrink-0 size-4 text-zinc-400 dark:text-zinc-300"
                        />
                    </HoverCardTrigger>
                    <HoverCardPortal>
                        <HoverCardContent
                            class="rounded-lg bg-zinc-100 dark:bg-zinc-900 p-5 z-[200] shadow-lg shadow-black/50 border border-zinc-300 dark:border-zinc-700"
                            :side-offset="5"
                        >
                            <DialogDescription class="flex flex-col gap-4">
                                <h2 class="text-sm font-semibold">
                                    フィードバックについて
                                </h2>
                                <p class="text-xs">
                                    内容は第三者に対し公開されることはありません。<br />
                                    送信したユーザーは、運営により確認可能です。
                                </p>
                            </DialogDescription>

                            <HoverCardArrow
                                class="fill-zinc-300 dark:fill-zinc-700"
                                :width="8"
                            />
                        </HoverCardContent>
                    </HoverCardPortal>
                </HoverCardRoot>
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
            <div class="gap-1.5 flex items-center justify-end">
                <UiButton label="送信" @click="Submit" />
                <UiButton label="キャンセル" @click="vis = false" />
            </div>
        </template>
    </ModalBase>
</template>
