<script lang="ts" setup>
interface Feedback {
    feature: string;
    design: string;
    performance: string;
    accessiblity: string;
    bug: string;
    other: string;
}

interface FeedbackVisibility {
    feature: boolean;
    design: boolean;
    performance: boolean;
    accessiblity: boolean;
    bug: boolean;
    other: boolean;
}

const feedback = ref<Feedback>({
    feature: '',
    design: '',
    performance: '',
    accessiblity: '',
    bug: '',
    other: '',
});

const feedbackVisibility = ref<FeedbackVisibility>({
    feature: false,
    design: false,
    performance: false,
    accessiblity: false,
    bug: false,
    other: false,
});

const submited = ref(false);

const RemoveEmptyValues = (obj: Record<string, string>) => {
    for (const [key, value] of Object.entries(obj)) {
        if (value === '') {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete obj[key];
        }
    }
};

const client = await useSBClient();

const Submit = async () => {
    RemoveEmptyValues(feedback.value);

    console.log(feedback.value);

    if (Object.keys(feedback.value).length === 0)
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
                    name="lucide:lightbulb"
                    size="20"
                    class="text-neutral-600 dark:text-neutral-400"
                />
                <span class="text-black dark:text-white font-medium">
                    フィードバック
                </span>
            </div>
        </template>

        <div v-if="!submited" class="flex flex-col gap-5">
            <UPopover
                :popper="{ placement: 'top' }"
                :ui="{
                    background: 'bg-white dark:bg-neutral-600',
                    ring: 'ring-0',
                    rounded: 'rounded-lg',
                }"
            >
                <UButton
                    block
                    label="カテゴリを追加"
                    variant="outline"
                    color="primary"
                />

                <template #panel="{ close }">
                    <div
                        class="flex flex-col gap-2 p-3 bg-neutral-800 min-w-64"
                    >
                        <UButton
                            v-if="!feedbackVisibility.feature"
                            @click="
                                feedbackVisibility.feature = true;
                                close();
                            "
                            variant="outline"
                            label="機能"
                            icon="lucide:settings"
                            block
                            :ui="{ rounded: 'rounded-xl' }"
                        />
                        <UButton
                            v-if="!feedbackVisibility.design"
                            @click="
                                feedbackVisibility.design = true;
                                close();
                            "
                            variant="outline"
                            label="デザイン"
                            icon="lucide:brush"
                            block
                            :ui="{ rounded: 'rounded-xl' }"
                        />
                        <UButton
                            v-if="!feedbackVisibility.performance"
                            @click="
                                feedbackVisibility.performance = true;
                                close();
                            "
                            variant="outline"
                            label="パフォーマンス"
                            icon="lucide:gauge"
                            block
                            :ui="{ rounded: 'rounded-xl' }"
                        />
                        <UButton
                            v-if="!feedbackVisibility.accessiblity"
                            @click="
                                feedbackVisibility.accessiblity = true;
                                close();
                            "
                            variant="outline"
                            label="アクセシビリティ"
                            icon="lucide:accessibility"
                            block
                            :ui="{ rounded: 'rounded-xl' }"
                        />
                        <UButton
                            v-if="!feedbackVisibility.bug"
                            @click="
                                feedbackVisibility.bug = true;
                                close();
                            "
                            variant="outline"
                            label="バグ"
                            icon="lucide:bug"
                            block
                            :ui="{ rounded: 'rounded-xl' }"
                        />
                        <UButton
                            v-if="!feedbackVisibility.other"
                            @click="
                                feedbackVisibility.other = true;
                                close();
                            "
                            variant="outline"
                            label="その他"
                            icon="lucide:message-circle"
                            block
                            :ui="{ rounded: 'rounded-xl' }"
                        />
                    </div>
                </template>
            </UPopover>

            <div v-if="feedbackVisibility.feature" class="flex flex-col gap-2">
                <UiTitle icon="lucide:settings" label="機能" />
                <UTextarea
                    v-model="feedback.feature"
                    placeholder="欲しい機能、改善の提案、この機能便利！など"
                    class="w-full"
                />
            </div>

            <div v-if="feedbackVisibility.design" class="flex flex-col gap-2">
                <UiTitle icon="lucide:brush" label="デザイン" />
                <UTextarea
                    v-model="feedback.design"
                    placeholder="見づらい部分や修正の提案など"
                    class="w-full"
                />
            </div>

            <div
                v-if="feedbackVisibility.performance"
                class="flex flex-col gap-2"
            >
                <UiTitle icon="lucide:gauge" label="パフォーマンス" />
                <UTextarea
                    v-model="feedback.performance"
                    placeholder="フレームレート、読み込み時間、ネットワーク通信量など（ご利用環境について詳しくお書きください）"
                    class="w-full"
                />
            </div>

            <div
                v-if="feedbackVisibility.accessiblity"
                class="flex flex-col gap-2"
            >
                <UiTitle icon="lucide:accessibility" label="アクセシビリティ" />
                <UTextarea
                    v-model="feedback.accessiblity"
                    placeholder="どのユーザーおよび利用環境でも、使いやすくかつ同等の体験が得られるかどうか"
                    class="w-full"
                />
            </div>

            <div v-if="feedbackVisibility.bug" class="flex flex-col gap-2">
                <UiTitle icon="lucide:bug" label="バグ" />
                <UTextarea
                    v-model="feedback.bug"
                    placeholder="発見したバグや不具合（バグかどうかわからないものも可）"
                    class="w-full"
                />
            </div>

            <div v-if="feedbackVisibility.other" class="flex flex-col gap-2">
                <UiTitle icon="lucide:message-circle" label="その他" />
                <UTextarea
                    v-model="feedback.other"
                    placeholder="その他なんでもお書きください"
                    class="w-full"
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
            <UButton
                block
                label="送信"
                variant="outline"
                color="primary"
                @click="Submit"
            />
        </template>
    </UCard>
</template>
