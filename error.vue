<script setup lang="ts">
const error = useError();

clearError();
</script>

<template>
    <UContainer
        class="flex flex-col items-center gap-10 pt-10"
        :ui="{ padding: 'px-8 sm:px-10 lg:px-16' }"
    >
        <UiHeader />

        <h1
            class="flex text-9xl font-extrabold font-['Montserrat'] text-neutral-500 dark:text-neutral-400"
        >
            {{ error && error.statusCode }}
        </h1>
        <div class="text-xl font-bold text-neutral-500 dark:text-neutral-400">
            {{ error && error.message }}
        </div>
        <NuxtLink to="/">ホーム</NuxtLink>

        <UiFooter />
    </UContainer>
</template>
