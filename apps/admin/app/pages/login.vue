<script lang="ts" setup>
const user = useSupabaseUser();
if (user.value) navigateTo('/');
</script>

<template>
    <div class="h-full flex flex-col items-center justify-center gap-8">
        <Icon name="avatio:avatio" size="48" />
        <UButton
            to="https://avatio.me"
            label="please login on avatio.me"
            variant="soft"
        />
    </div>
</template>
