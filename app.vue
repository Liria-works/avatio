<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt';
</script>

<template>
    <Analytics />
    <NuxtRouteAnnouncer />
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
    <UiToaster />
</template>
