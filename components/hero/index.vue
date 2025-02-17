<script lang="ts" setup></script>

<template>
    <div
        class="relative self-center w-full max-w-xl mt-12 mb-6 py-12 flex flex-col items-center gap-6"
    >
        <HeroDotBackground class="absolute inset-0 w-full h-full" />
        <LogoLiria by-liria aria-label="Avatio by Liria" class="w-64 sm:w-96" />
        <p
            class="text-sm sm:text-md font-medium text-zinc-600 dark:text-zinc-400"
        >
            あなたのアバター改変を共有しよう
        </p>
        <Button
            to="/setup/edit"
            class="p-3 md:pr-6 md:pl-5 md:mr-2 outline-0 md:outline-1 md:rounded-full whitespace-nowrap hover:bg-zinc-700 hover:text-zinc-200 hover:dark:bg-zinc-300 hover:dark:text-zinc-800"
        >
            <!-- <Icon name="lucide:plus" :size="18" /> -->
            <span class="hidden md:block">ログイン</span>
        </Button>
    </div>
</template>
