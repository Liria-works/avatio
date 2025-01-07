<template>
    <NuxtLink
        to="/login"
        :class="[
            'group relative w-full min-h-64 p-12 gap-4 flex flex-col rounded-xl overflow-hidden',
            'outline outline-2 outline-zinc-300 dark:outline-zinc-900 ring-4 ring-inset ring-zinc-50 dark:ring-zinc-800',
            'bg-gradient-to-br from-zinc-50 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900',
        ]"
    >
        <div class="z-10 flex flex-col gap-4">
            <p
                class="font-bold font-[Montserrat] text-5xl text-zinc-800 dark:text-zinc-100"
            >
                Welcome to <span class="font-black">Avatio</span>
            </p>
            <p class="font-medium text-zinc-600 dark:text-zinc-300">
                あなたのアバターを共有しよう
            </p>
        </div>
        <div
            :class="[
                'absolute inset-0 bg-gradient-to-br from-transparent to-zinc-400 dark:from-transparent dark:to-zinc-600 bg-blend-screen',
                'opacity-0 group-hover:opacity-100',
                'transition-all duration-200 ease-in-out',
            ]"
        />
        <div
            :class="[
                'absolute bottom-0 right-0 mx-10 my-8 flex items-center gap-2',
                'opacity-30 group-hover:opacity-100',
                'transition-all duration-200 ease-in-out',
            ]"
        >
            <span class="text-xl font-bold leading-none">ログイン</span>
            <Icon name="lucide:arrow-right" :size="24" />
        </div>
    </NuxtLink>
</template>
