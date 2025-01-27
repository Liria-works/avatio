<script lang="ts" setup>
const isMaintenance = ref<boolean>(false);

onMounted(async () => {
    const res = await $fetch('/api/edgeConfig');
    if (res.value) isMaintenance.value = res.value.is_maintenance as boolean;
});
</script>

<template>
    <div v-if="isMaintenance" class="leading-none">Maintenance now</div>
</template>
