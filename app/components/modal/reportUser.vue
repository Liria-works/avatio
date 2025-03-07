<script lang="ts" setup>
const vis = defineModel<boolean>({ default: false });

const props = defineProps<{ id: string }>();

const choices = ref({
    spam: {
        label: 'スパム',
        description: 'スパムの投稿を含む',
        value: false,
    },
    hate: {
        label: '悪意のあるユーザー',
        description: 'ヘイト、差別、脅迫など悪意のある内容を投稿している。',
        value: false,
    },
    infringement: {
        label: '権利侵害',
        description: '他者の権利を侵している、または権利侵害を助長している。',
        value: false,
    },
    other: {
        label: 'その他',
        description: 'その他の理由で報告',
        value: false,
    },
});
const additional = ref<string>('');

const Submit = async () => {
    const client = useSupabaseClient();

    if (
        !choices.value.spam.value &&
        !choices.value.hate.value &&
        !choices.value.infringement.value &&
        !choices.value.other.value
    )
        return useToast().add('報告の理由を選択してください');

    if (choices.value.other && !additional.value.length)
        return useToast().add(
            '"その他"を選択した場合は、理由を入力してください'
        );

    const { error } = await client.from('report_user').insert({
        reportee: props.id,
        spam: choices.value.spam.value,
        hate: choices.value.hate.value,
        infringement: choices.value.infringement.value,
        other: choices.value.other.value,
        additional: additional.value,
    });
    if (error) {
        console.error(error);
        return useToast().add(
            '報告の送信に失敗しました',
            'もう一度お試しください'
        );
    }

    useToast().add('報告が送信されました', 'ご協力ありがとうございます');
    vis.value = false;
};
</script>

<template>
    <Modal v-model="vis">
        <template #header>
            <div
                class="w-full px-10 flex flex-row gap-2 items-center justify-center"
            >
                <Icon
                    name="lucide:flag"
                    size="20"
                    class="text-zinc-600 dark:text-zinc-400"
                />
                <span class="text-black dark:text-white font-medium">
                    ユーザーの報告
                </span>
            </div>
        </template>

        <div class="overflow-y-auto w-full flex flex-col items-center gap-2">
            <Toggle
                v-for="(choice, index) in choices"
                :key="'choice-' + index"
                class="group w-full p-5 flex flex-col gap-1.5 rounded-xl border border-zinc-400 dark:border-zinc-600 data-[state=on]:bg-zinc-300 data-[state=on]:dark:bg-zinc-700"
                @click="choice.value = !choice.value"
            >
                <div class="flex gap-2.5 items-center">
                    <div
                        class="rounded-md p-0.5 flex ring-1 ring-zinc-600 dark:ring-zinc-600 group-data-[state=on]:bg-zinc-600 group-data-[state=on]:dark:bg-zinc-300"
                    >
                        <Icon
                            name="lucide:check"
                            size="16"
                            class="text-zinc-100 dark:text-zinc-900 group-data-[state=off]:bg-transparent"
                        />
                    </div>
                    <span
                        class="pb-px font-medium leading-none text-zinc-900 dark:text-zinc-100"
                    >
                        {{ choice.label }}
                    </span>
                </div>

                <span
                    class="text-zinc-900 dark:text-zinc-100 text-sm text-left whitespace-pre-line"
                >
                    {{ choice.description }}
                </span>
            </Toggle>
            <p
                class="text-zinc-600 dark:text-zinc-300 font-medium w-full text-left mt-3"
            >
                報告の詳細や背景情報
            </p>
            <UiTextarea
                v-model="additional"
                autoresize
                placeholder="その他の理由を入力"
                class="w-full"
            />
        </div>

        <template #footer>
            <div class="gap-1.5 flex items-center justify-between">
                <Button
                    label="キャンセル"
                    variant="flat"
                    @click="vis = false"
                />
                <Button label="報告" @click="Submit" />
            </div>
        </template>
    </Modal>
</template>
