<script lang="ts" setup>
interface Props {
    data: DocumentData;
    index: number;
}
const { data, index } = defineProps<Props>();

const detail = ref(false);

const category: Record<string, string> = {
    news: 'ニュース',
    update: 'アップデート',
    event: 'イベント',
    blog: 'ブログ',
};
</script>

<template>
    <div class="relative grid grid-flow-row sm:grid-cols-2 gap-5">
        <div
            :data-index="index"
            class="absolute left-[13px] h-full w-0.5 bg-zinc-700 data-[index=0]:top-6"
        />

        <div class="relative flex">
            <div class="sticky top-0 left-0 h-fit pt-6 pb-12 gap-4 flex">
                <div
                    class="size-7 shrink-0 rounded-full flex items-center justify-center bg-zinc-900"
                >
                    <div class="size-3 rounded-full bg-zinc-300" />
                </div>

                <div class="h-fit flex flex-col gap-3">
                    <h2
                        class="text-2xl font-bold break-keep [overflow-wrap:anywhere;]"
                    >
                        {{ useSentence(data.title) }}
                    </h2>
                    <div class="flex items-center gap-2">
                        <span class="text-sm text-zinc-400 whitespace-nowrap">
                            {{ useLocaledDate(new Date(data.created_at)) }}
                        </span>
                        <UiBadge v-if="data.category" class="text-xs">
                            {{ category[data.category] }}
                        </UiBadge>
                    </div>
                    <p
                        v-if="data.description?.length"
                        class="text-sm text-zinc-400 break-keep [overflow-wrap:anywhere;]"
                    >
                        {{ useSentence(data.description) }}
                    </p>
                </div>
            </div>
        </div>

        <div class="pb-12 pl-12 sm:pl-0 gap-4 flex flex-col">
            <NuxtImg
                v-if="data.thumbnail?.length"
                :src="useGetImage(data.thumbnail, { prefix: 'release' })"
                fit="cover"
                class="rounded-lg"
            />

            <Button v-if="!detail" @click="detail = true">
                <Icon name="lucide:text" />
                <span>詳細を見る</span>
            </Button>

            <UiMarkdown
                v-if="detail && data.content"
                :content="data.content"
                class="prose-sm"
            />
        </div>
    </div>
</template>
