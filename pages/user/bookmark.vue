<script lang="ts" setup>
const bookmarks = ref<Setup[]>([]);

onMounted(async () => {
    bookmarks.value = await useBookmarks();
});
</script>

<template>
    <div class="flex flex-col gap-5">
        <UiTitle label="ブックマーク" icon="lucide:bookmark" size="lg" />

        <div v-if="!bookmarks.length" class="w-full text-center my-7">
            ブックマークがありません
        </div>

        <div class="flex flex-col gap-3">
            <NuxtLink
                v-for="i in bookmarks"
                :key="'user-setup-' + i.id"
                :to="{ name: 'setup-id', params: { id: i.id } }"
                class="w-full"
            >
                <ItemSetupDetail
                    :id="i.id"
                    :created-at="i.created_at"
                    :name="i.name"
                    :description="i.description"
                    :image="i.image"
                    :author="i.author"
                    :items="i.items.map((i) => i.data)"
                />
            </NuxtLink>
        </div>
    </div>
</template>
