<script setup lang="ts">
import type { User } from "@supabase/supabase-js";
const user = ref<User | null>(null);

onMounted(() => {
    user.value = useSupabaseUser().value;
});
</script>

<template>
    <div class="w-full flex flex-col gap-10">
        <BannerHome v-if="!user" />

        <LayoutMySetups v-if="user" />

        <LayoutDiscovery />
    </div>
</template>
