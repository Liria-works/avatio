<script setup lang="ts">
import sanitizeHtml from 'sanitize-html';
import { marked } from 'marked';

const props = defineProps<{
    title: string;
    createdAt: string;
    updatedAt: string;
    content: string;
}>();

const error = ref<boolean>(false);

const main = await marked.parse(props.content, { breaks: true });
</script>

<template>
    <article v-if="!error" class="w-full my-3 flex flex-col gap-10">
        <div class="markdown flex flex-col gap-4">
            <h1 class="text-4xl font-[900]">
                {{ props.title }}
            </h1>
            <span class="text-neutral-500">
                {{
                    new Date(props.createdAt).toLocaleString('ja-JP', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        timeZoneName: 'short',
                    })
                }}
            </span>
        </div>
        <!-- eslint-disable vue/no-v-html -->
        <div
            v-html="sanitizeHtml(main)"
            class="prose prose-neutral prose-invert max-w-none"
        ></div>
    </article>
</template>
