<script setup lang="ts"></script>

<template>
    <header class="flex items-start justify-between w-full">
        <div
            class="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-shrink-0"
        >
            <NuxtLink to="/" class="pt-1">
                <LogoLiria class="w-48" />
            </NuxtLink>
            <BadgeHeader />
        </div>
        <UiHeaderMenu />
    </header>
</template>
