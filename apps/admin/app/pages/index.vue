<script setup lang="ts">
const user = useSupabaseUser();

const signOut = async () => {
    const supabase = useSupabaseClient();
    await supabase.auth.signOut();
    navigateTo('/login');
};
</script>

<template>
    <div class="flex flex-col items-center justify-center gap-4">
        <h1 class="font-bold text-2xl text-(--ui-primary)">Nuxt UI v3</h1>

        <div class="flex items-center gap-2">
            <UButton
                label="User"
                icon="lucide:user-round"
                @click="console.log(user)"
            />

            <UButton
                label="logout"
                variant="outline"
                icon="lucide:log-out"
                @click="signOut"
            />
        </div>
    </div>
</template>
