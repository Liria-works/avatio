<script lang="ts" setup>
const route = useRoute();

const paddingExclude = ['/', '/setup/edit'];

useHead({
    bodyAttrs: {
        class: 'bg-zinc-50 dark:bg-zinc-900 text-black dark:text-white font-[Murecho] transition duration-50 delay-0 ease-in-out',
    },
    title: 'Avatio',
    link: [
        {
            rel: 'icon',
            type: 'image/png',
            href: '/favicon.ico',
        },
    ],
    meta: [{ name: 'lang', content: 'ja' }],
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleError = (error: any) => {
    console.error('Layout error:', error);
};
</script>

<template>
    <NuxtErrorBoundary @error="handleError">
        <UContainer
            class="flex flex-col gap-12 items-center"
            :ui="{ padding: 'pt-6 px-6 ' }"
        >
            <UiHeader />
            <div
                :class="[
                    'w-full',
                    paddingExclude.includes(route.path)
                        ? 'px-4'
                        : 'md:px-20 lg:px-32',
                ]"
            >
                <slot />
            </div>
            <UiFooter />

            <UNotifications />
        </UContainer>
    </NuxtErrorBoundary>
</template>
