<template>
    <div
        class="w-full min-h-64 p-12 gap-4 flex flex-col justify-between rounded-xl outline outline-2 outline-neutral-300 dark:outline-neutral-600 ring-4 ring-inset ring-neutral-50 dark:ring-neutral-800 bg-neutral-200 dark:bg-neutral-700"
    >
        <div class="flex flex-col gap-4">
            <p
                class="font-bold font-[Montserrat] text-5xl text-neutral-800 dark:text-neutral-100"
            >
                Welcome to <span class="font-black">Avatio</span>
            </p>
            <p class="font-medium text-neutral-600 dark:text-neutral-300">
                あなたのアバターを共有しよう
            </p>
        </div>
        <UiButton
            to="/login"
            icon="lucide:sparkles"
            label="今すぐログイン"
            class="hover:text-neutral-100 dark:hover:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-400"
        />
    </div>
</template>
