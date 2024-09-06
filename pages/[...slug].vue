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
            <div v-html="sanitizeHtml(main)" class="markdown"></div>
        </article>

        <div v-if="error" class="flex flex-col items-center gap-10 pt-10">
            <h2
                class="flex text-9xl font-extrabold font-['Montserrat'] text-neutral-500 dark:text-neutral-400"
            >
                404
            </h2>
            <div
                class="text-xl font-bold text-neutral-500 dark:text-neutral-400"
            >
                ページが見つかりませんでした。
            </div>
        </div>
    </main>
</template>

<style>
.markdown h1 {
    font-family: "Noto Sans Japanese", sans-serif;
}

.markdown h2 {
    font-size: 1.5em;
    font-family: "Noto Sans Japanese", sans-serif;
    font-weight: 600;
    color: #333;
    margin-top: 3rem;
    margin-bottom: 1rem;
}

.dark .markdown h2 {
    color: #eee;
}

.markdown h3 {
    font-size: 1.17em;
    margin: 0.83em 0;
}

.markdown p {
    color: #383838;
    margin-top: 1em;
    margin-bottom: 1em;
    margin-left: 0.2em;
}

.dark .markdown p {
    color: #cecece;
}

.markdown ul {
    list-style-type: disc;
    color: #383838;
    margin-left: 2em;
    margin-top: 1em;
    margin-bottom: 1em;
}

.dark .markdown ul {
    color: #cecece;
}

.markdown li {
    color: #383838;
}

.dark .markdown li {
    color: #cecece;
}
</style>
