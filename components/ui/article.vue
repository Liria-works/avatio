<script setup lang="ts">
import { marked } from 'marked';

const props = defineProps<{
    data: DocumentData;
    type?: 'release' | 'info';
}>();

const main = await marked.parse(props.data.content, { breaks: true });

const createdAt = new Date(props.data.created_at);
const updatedAt = new Date(props.data.updated_at);
</script>

<template>
    <article class="w-full my-3 flex flex-col gap-10">
        <div class="flex flex-col gap-4">
            <div class="-ml-4 flex items-center gap-1">
                <template v-if="props.type === 'release'">
                    <Button
                        to="/release"
                        icon="lucide:arrow-left"
                        label="お知らせ一覧へ"
                        variant="flat"
                        class="text-zinc-500 dark:text-zinc-400"
                    />
                    <Button
                        to="/"
                        icon="lucide:house"
                        tooltip="ホーム"
                        variant="flat"
                        class="text-zinc-500 dark:text-zinc-400"
                    />
                </template>
                <template v-else>
                    <Button
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
                {{
                    updatedAt.toLocaleString('ja-JP', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        timeZoneName: 'short',
                    })
                }}
                に最終更新
            </span>
            <span v-else class="text-sm text-zinc-500">
                {{
                    createdAt.toLocaleString('ja-JP', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        timeZoneName: 'short',
                    })
                }}
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
            v-html="main"
            :class="[
                'max-w-none',
                'prose prose-zinc dark:prose-invert',
                'prose-blockquote:[&_p]:not-italic prose-blockquote:[&_p]:before:content-[none] prose-blockquote:[&_p]:after:content-[none] prose-blockquote:text-zinc-500 prose-blockquote:dark:text-zinc-400',
                'prose-img:rounded-md prose-img:first:mt-0 prose-img:last:mb-0',
            ]"
        ></div>
    </article>
</template>
