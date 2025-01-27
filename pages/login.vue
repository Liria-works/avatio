<script setup lang="ts">
const user = useSupabaseUser();
if (user.value) navigateTo('/');

onMounted(() => {
    useOGP({
        title: 'ログイン',
    });
});
</script>

<template>
    <div class="w-full flex flex-col items-center gap-5 my-10">
        <UiLogin />
        <ButtonBase
            to="/"
            label="ホームに戻る"
            icon="lucide:arrow-left"
            variant="flat"
        />
    </div>
</template>
