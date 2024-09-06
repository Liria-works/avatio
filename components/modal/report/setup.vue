<script lang="ts" setup>
const client = await useSBClient();

const props = defineProps<{
    id: number;
}>();

const emit = defineEmits(["close"]);

const choices = [
    {
        value: "spam",
        label: "スパム、個人情報、不適切な内容",
        descreption:
            "荒らし目的で類似の投稿を複数回行っている、投稿内容に自身および他者の個人情報を含んでいる、その他不適切な内容を含んでいる",
    },
    {
        value: "hate",
        label: "差別、暴力、誹謗中傷",
        descreption:
            "人種、性別、宗教、性的指向、障害、疾病、年齢、その他の属性に基づく差別的な表現、暴力的な表現などが含まれている",
    },
    {
        value: "infringement",
        label: "他者への権利侵害",
        descreption:
            "自身および第三者の著作権、商標権、肖像権、またはその他の権利侵害が予想される",
    },
    {
        value: "nsfw_image",
        label: "過激な画像",
        descreption:
            "過度な露出、暴力表現などを含む画像を添付している\nNSFWタグが付いている投稿であっても、過激な画像を添付することは禁止されています",
    },
    {
        value: "other",
        label: "その他",
        descreption: "その他の理由で報告",
    },
];
// const additional = ref<string>("");

interface Report {
    [key: string]: boolean | string | number | null; // Add index signature
    setup_id: number;
    spam: boolean;
    hate: boolean;
    infringement: boolean;
    nsfw_image: boolean;
    other: boolean;
    additional: string | null;
}

const report = ref<Report>({
    setup_id: props.id,
    spam: false,
    hate: false,
    infringement: false,
    nsfw_image: false,
    other: false,
    additional: null,
});

const Submit = async () => {
    // console.log(report.value);

    if (
        !report.value.spam &&
        !report.value.hate &&
        !report.value.infringement &&
        !report.value.nsfw_image &&
        !report.value.other
    ) {
        useAddToast("報告の理由を選択してください");
        return;
    }

    if (report.value.additional === "") report.value.additional = null;

    if (report.value.other && !report.value.additional) {
        useAddToast('"その他"を選択した場合は、理由を入力してください');
        return;
    }

    const { error } = await client
        .from("report_setup")
        .insert(report.value as never);
    if (error) {
        console.error(error);
        useAddToast("報告の送信に失敗しました", "もう一度お試しください");
        return;
    }

    useAddToast("報告が送信されました", "ご協力ありがとうございます！");
    emit("close");
};
</script>

<template>
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
                    name="lucide:flag"
                    size="20"
                    class="text-neutral-600 dark:text-neutral-400"
                />
                <span class="text-black dark:text-white font-medium">
                    セットアップの報告
                </span>
            </div>
        </template>

        <div
            class="w-full flex flex-col items-center gap-2 text-md font-normal text-neutral-300"
        >
            <button
                v-for="choice in choices"
                :key="choice.value"
                :class="{
                    'w-full p-5 gap-4 flex items-center rounded-xl border border-1 border-neutral-500 dark:border-neutral-500':
                        !report[choice.value],
                    'w-full p-5 gap-4 flex items-center rounded-xl border border-1 border-neutral-500 dark:border-neutral-500 bg-black/10 dark:bg-white/10':
                        report[choice.value],
                }"
                @click="report[choice.value] = !report[choice.value]"
            >
                <UCheckbox v-model="report[choice.value]" />
                <div class="flex flex-col gap-1 items-start">
                    <p
                        class="font-medium text-neutral-600 dark:text-neutral-300"
                    >
                        {{ choice.label }}
                    </p>
                    <div
                        class="text-neutral-600 dark:text-neutral-400 text-sm text-left"
                    >
                        <p
                            v-for="line in choice.descreption.split('\n')"
                            :key="line"
                        >
                            {{ line }}
                        </p>
                    </div>
                </div>
            </button>
            <p
                class="text-neutral-600 dark:text-neutral-300 font-medium w-full text-left mt-3"
            >
                報告の詳細や背景情報
            </p>
            <UTextarea
                v-model="report.additional"
                autoresize
                placeholder="その他の理由を入力"
                :ui="{ rounded: 'rounded-xl' }"
                class="w-full"
            />
        </div>

        <template #footer>
            <UButton
                block
                label="セットアップを報告"
                variant="outline"
                color="red"
                :ui="{ rounded: 'rounded-xl' }"
                @click="Submit"
            />
        </template>
    </UCard>
</template>
