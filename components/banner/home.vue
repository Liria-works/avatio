<template>
    <div class="w-full flex flex-col gap-10">
        <div
            class="w-full h-64 p-12 flex rounded-xl bg-neutral-300 dark:bg-neutral-600"
        >
            <div class="flex flex-col justify-between">
                <div class="flex flex-col gap-4">
                    <p
                        class="font-bold font-[Montserrat] text-4xl text-neutral-900 dark:text-neutral-100"
                    >
                        Welcome to Avatio
                    </p>
                    <p
                        class="font-medium text-neutral-600 dark:text-neutral-300"
                    >
                        あなたのアバターを共有しよう
                    </p>
                </div>
                <UiButton
                    to="/login"
                    icon="lucide:sparkles"
                    label="今すぐログイン"
                />
            </div>
        </div>
    </div>
</template>
