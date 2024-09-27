<script setup lang="ts">
const user = useSupabaseUser();
</script>

<template>
    <div class="w-full flex flex-col gap-10">
        <BannerHome v-if="!user" />

        <LayoutMySetups v-if="user" />

        <LayoutDiscovery />
    </div>
</template>
