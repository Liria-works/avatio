<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps({
    error: Object as () => NuxtError,
});
</script>

<template>
    <UContainer
        class="flex flex-col items-center gap-10 pt-10"
        :ui="{ padding: 'px-8 sm:px-10 lg:px-16' }"
    >
        <AHeader />

        <h1
            class="flex text-9xl font-extrabold font-['Montserrat'] text-neutral-500 dark:text-neutral-400"
        >
            {{ error ? error.statusCode : "" }}
        </h1>
        <div class="text-xl font-bold text-neutral-500 dark:text-neutral-400">
            {{
                error.statusCode === 404
                    ? "ページが見つかりませんでした。"
                    : "エラーが発生しました。"
            }}
        </div>
        <NuxtLink to="/">ホーム</NuxtLink>

        <AFooter />
    </UContainer>
</template>
