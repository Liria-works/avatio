<script setup lang="ts">
import type { ApiResponse, DocumentData } from '#types';

const route = useRoute();

if (!route.params.slug)
    throw showError({ statusCode: 404, message: 'Page Not Found' });

const { data, error } = await $fetch<ApiResponse<DocumentData>>('/api/info', {
    method: 'GET',
    query: { type: 'release', slug: route.params.slug },
});

if (error) throw showError({ statusCode: 404, message: error.message });

useOGP({ title: data!.title, image: data!.thumbnail });
</script>

<template>
    <UiArticle :data="data!" />
</template>
