<template>
    <div
        class="w-full min-h-64 p-12 gap-4 flex flex-col justify-between rounded-xl outline outline-2 outline-zinc-300 dark:outline-zinc-900 ring-4 ring-inset ring-zinc-50 dark:ring-zinc-800 bg-gradient-to-br from-zinc-50 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900"
    >
        <div class="flex flex-col gap-4">
            <p
                class="font-bold font-[Montserrat] text-5xl text-zinc-800 dark:text-zinc-100"
            >
                Welcome to <span class="font-black">Avatio</span>
            </p>
            <p class="font-medium text-zinc-600 dark:text-zinc-300">
                あなたのアバターを共有しよう
            </p>
        </div>
        <UiButton
            to="/login"
            icon="lucide:sparkles"
            label="今すぐログイン"
            class="hover:text-zinc-100 dark:hover:text-zinc-900 dark:bg-zinc-300/20 hover:bg-zinc-700 dark:hover:bg-zinc-300"
        />
    </div>
</template>
