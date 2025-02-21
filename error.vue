<script setup lang="ts">
import type { NuxtError } from 'nuxt/app';

const props = defineProps({
    error: Object as () => NuxtError,
});
</script>

<template>
    <NuxtLayout>
        <div class="flex flex-col gap-4 items-center">
            <h1
                class="flex text-9xl font-extrabold font-['Montserrat'] text-zinc-500 dark:text-zinc-400"
            >
                {{ props.error?.statusCode || 500 }}
            </h1>
            <p class="text-xl font-bold text-zinc-500 dark:text-zinc-400">
                {{ props.error?.message || 'Unknown Error' }}
            </p>
            <Button
                to="/"
                label="ホーム"
                icon="lucide:arrow-left"
                variant="flat"
            />
        </div>
    </NuxtLayout>
</template>
