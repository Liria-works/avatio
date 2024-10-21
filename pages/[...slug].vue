<script setup lang="ts">
import sanitizeHtml from "sanitize-html";
import { marked } from "marked";
const route = useRoute();

const content = ref();
const main = ref();
const error = ref<boolean>(false);

const loading = ref(true);

onMounted(async () => {
    const client = await useSBClient();
    const { data } = await client
        .from("articles")
        .select("*")
        .eq("slug", route.params.slug.toString())
        .single();

    if (!data) error.value = true;

    content.value = data;
    main.value = marked.parse(content.value.content, { breaks: true });

    loading.value = false;
});
</script>

<template>
    <main class="flex flex-col gap-4">
        <article v-if="!error && !loading" class="my-3 flex flex-col gap-10">
            <div class="markdown flex flex-col gap-4">
                <h1 class="text-4xl font-[900]">
                    {{ content?.title }}
                </h1>
                <span class="text-neutral-500">
                    {{
                        new Date(content?.created_at).toLocaleString("ja-JP", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            timeZoneName: "short",
                        })
                    }}
                </span>
            </div>
            <!-- eslint-disable vue/no-v-html -->
            <div v-html="sanitizeHtml(main)" class="prose prose-neutral dark:prose-invert"></div>
        </article>

        <div v-if="error" class="flex flex-col items-center gap-10 pt-10">
            <h2 class="flex text-9xl font-extrabold font-['Montserrat'] text-neutral-500 dark:text-neutral-400">
                404
            </h2>
            <div class="text-xl font-bold text-neutral-500 dark:text-neutral-400">
                ページが見つかりませんでした。
            </div>
        </div>
    </main>
</template>
