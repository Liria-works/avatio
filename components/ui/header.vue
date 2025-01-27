<script setup lang="ts"></script>

<template>
    <header class="flex items-center gap-3 justify-between w-full">
        <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
            <NuxtLink to="/" class="pt-1">
                <LogoLiria class="w-32 sm:w-48 -mt-1" aria-label="Avatio" />
            </NuxtLink>
            <BadgeHeader class="hidden sm:block" />
        </div>
        <UiHeaderMenu />
    </header>
</template>
