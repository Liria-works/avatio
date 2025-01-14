<script setup lang="ts"></script>

<template>
    <header class="flex items-start justify-between w-full">
        <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
            <NuxtLink to="/" class="pt-1">
                <LogoLiria class="w-32 sm:w-48" aria-label="Avatio" />
            </NuxtLink>
            <BadgeHeader />
        </div>
        <UiHeaderMenu />
    </header>
</template>
