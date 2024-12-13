<script setup lang="ts">
onMounted(() => {
    useOGP({
        title: 'ログイン',
    });
});
</script>

<template>
    <div class="w-full flex flex-col items-center gap-5 my-10">
        <UiLogin />
    </div>
</template>
