<script setup lang="ts">
interface Props {
    data: DocumentData;
    type?: 'release' | 'info';
}
const props = defineProps<Props>();

const createdAt = new Date(props.data.created_at).toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZoneName: 'short',
});

const updatedAt = new Date(props.data.updated_at).toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZoneName: 'short',
});
</script>

<template>
    <article class="w-full my-3 flex flex-col gap-10">
        <div class="markdown flex flex-col gap-4">
            <div class="flex items-center gap-1">
                <template v-if="props.type === 'release'">
                    <ButtonBase
                        to="/release"
                        icon="lucide:arrow-left"
                        label="お知らせ一覧へ"
                        variant="flat"
                        class="text-zinc-500 dark:text-zinc-400"
                    />
                    <ButtonBase
                        to="/"
                        icon="lucide:house"
                        tooltip="ホーム"
                        variant="flat"
                        class="text-zinc-500 dark:text-zinc-400"
                    />
                </template>
                <template v-else>
                    <ButtonBase
                        to="/"
                        icon="lucide:house"
                        label="ホーム"
                        variant="flat"
                        class="text-zinc-500 dark:text-zinc-400"
                    />
                </template>
            </div>

            <NuxtImg
                v-if="props.data.thumbnail && props.data.thumbnail.length"
                :src="
                    useGetImage(props.data.thumbnail, { prefix: 'permanent' })
                "
                class="mb-2 rounded-lg"
            />

            <h1 class="text-4xl font-[900]">
                {{ props.data.title }}
            </h1>

            <span v-if="createdAt < updatedAt" class="text-sm text-zinc-500">
                {{ updatedAt }}
                に最終更新
            </span>
            <span v-else class="text-sm text-zinc-500">
                {{ createdAt }}
                に公開
            </span>

            <p
                v-if="props.data.description && props.data.description.length"
                class="text-zinc-400"
            >
                {{ props.data.description }}
            </p>
        </div>

        <!-- eslint-disable vue/no-v-html -->
        <div
            v-if="props.data.html && props.data.html.length"
            v-html="props.data.html"
            :class="[
                'max-w-none',
                'prose prose-zinc dark:prose-invert',
                '[&_p]:prose-blockquote:not-italic [&_p]:prose-blockquote:before:content-[none] [&_p]:prose-blockquote:after:content-[none] [&_p]:prose-blockquote:text-zinc-500 [&_p]:prose-blockquote:dark:text-zinc-400',
                'prose-img:rounded-md first:prose-img:mt-0 last:prose-img:mb-0',
            ]"
        ></div>
    </article>
</template>
