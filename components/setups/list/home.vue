<script lang="ts" setup>
const setups = ref<SetupClient[]>([]);
const setupsPerPage: number = 50;
const page = ref(0);
const loading = ref(true);

const get = async () => {
    loading.value = true;

    const { data } = await $fetch<ApiResponse<SetupClient[]>>(
        '/api/setups/latest',
        {
            method: 'GET',
            query: {
                page: page.value,
                perPage: setupsPerPage,
            },
        }
    );
    if (!data) return (loading.value = false);

    setups.value = [...setups.value, ...data];
    page.value++;

    loading.value = false;
};

await get();
</script>

<template>
    <div class="flex flex-col gap-3">
        <SetupsListBase :setups="setups" />
        <ButtonLoadMore
            v-if="setups.length"
            :loading="loading"
            class="w-full"
            @click="get"
        />
    </div>
</template>
