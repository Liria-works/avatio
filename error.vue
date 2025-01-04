<script setup lang="ts">
const error = useError();
</script>

<template>
    <NuxtLayout>
        <h1
            class="flex text-9xl font-extrabold font-['Montserrat'] text-zinc-500 dark:text-zinc-400"
        >
            {{ error && error.statusCode }}
        </h1>
        <h2 class="text-xl font-bold text-zinc-500 dark:text-zinc-400">
            {{ error && error.message }}
        </h2>
        <NuxtLink to="/">ホーム</NuxtLink>
    </NuxtLayout>
</template>
