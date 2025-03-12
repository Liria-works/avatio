<script lang="ts" setup>
definePageMeta({
    layout: 'blank',
});
</script>

<template>
    <div class="w-full my-24 flex flex-col gap-6 items-center">
        <LogoAvatio class="w-64 mb-24" aria-label="Avatio" />
        <h1
            class="flex text-7xl font-extrabold font-['Montserrat'] text-zinc-500 dark:text-zinc-400"
        >
            503
        </h1>
        <p class="text-xl font-bold text-zinc-500 dark:text-zinc-400">
            メンテナンス中
        </p>
        <p
            class="text-sm text-center font-bold text-zinc-500 dark:text-zinc-400"
        >
            ご迷惑をおかけしますが、時間をおいて再度お試しください
        </p>
    </div>
</template>
