<script lang="ts" setup>
const vis = defineModel<boolean>({
    default: false,
});

const props = defineProps<{
    id: number;
}>();

const choices = ref({
    spam: {
        label: 'スパム、個人情報、不適切な内容',
        descreption:
            '荒らし目的で類似の投稿を複数回行っている、投稿内容に自身および他者の個人情報を含んでいる、その他不適切な内容を含んでいる',
        value: false,
    },
    hate: {
        label: '差別、暴力、誹謗中傷',
        descreption:
            '人種、性別、宗教、性的指向、障害、疾病、年齢、その他の属性に基づく差別的な表現、暴力的な表現などが含まれている',
        value: false,
    },
    infringement: {
        label: '他者への権利侵害',
        descreption:
            '自身および第三者の著作権、商標権、肖像権、またはその他の権利侵害が予想される',
        value: false,
    },
    nsfwImage: {
        label: '過激な画像',
        descreption:
            '過度な露出、暴力表現などを含む画像を添付している\nNSFWタグが付いている投稿であっても、過激な画像を添付することは禁止されています',
        value: false,
    },
    other: {
        label: 'その他',
        descreption: 'その他の理由で報告',
        value: false,
    },
});
const additional = ref<string>('');

const Submit = async () => {
    const client = await useSBClient();

    if (
        !choices.value.spam.value &&
        !choices.value.hate.value &&
        !choices.value.infringement.value &&
        !choices.value.nsfwImage.value &&
        !choices.value.other.value
    )
        return useAddToast('報告の理由を選択してください');

    if (choices.value.other.value && !additional.value.length)
        return useAddToast('"その他"を選択した場合は、理由を入力してください');

    const { error } = await client.from('report_setup').insert({
        setup_id: props.id,
        spam: choices.value.spam.value,
        hate: choices.value.hate.value,
        infringement: choices.value.infringement.value,
        nsfw_image: choices.value.nsfwImage.value,
        other: choices.value.other.value,
        additional: additional.value,
    });
    if (error) {
        console.error(error);
        return useAddToast(
            '報告の送信に失敗しました',
            'もう一度お試しください'
        );
    }

    useAddToast('報告が送信されました', 'ご協力ありがとうございます');
    vis.value = false;
};
</script>

<template>
    <ModalBase v-model="vis">
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
                    セットアップの報告
                </span>
            </div>
        </template>

        <div
            class="w-full flex flex-col items-center gap-2 text-md font-normal text-zinc-300"
        >
            <Toggle
                v-for="choice in choices"
                :key="useId()"
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
                            class="bg-zinc-100 dark:bg-zinc-900 group-data-[state=off]:bg-transparent"
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
                    {{ choice.descreption }}
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
                <UiButton
                    label="キャンセル"
                    variant="flat"
                    @click="vis = false"
                />
                <UiButton label="報告" @click="Submit" />
            </div>
        </template>
    </ModalBase>
</template>
