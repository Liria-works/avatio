<script lang="ts" setup>
const bookmarks = ref<{ post: Setup }[]>([]);

onMounted(async () => {
    bookmarks.value = await useListBookmarks();
});
</script>

<template>
    <div class="flex flex-col gap-3 items-center">
        <UiCategory title="ブックマーク" icon="lucide:bookmark">
            <div v-if="!bookmarks.length" class="w-full text-center my-7">
                ブックマークがありません
            </div>

            <NuxtLink
                v-for="i in bookmarks"
                :key="'user-setup-' + i.post.id"
                :to="{ name: 'setup-id', params: { id: i.post.id } }"
                class="w-full"
            >
                <ItemSetupDetail
                    :name="i.post.name"
                    :description="i.post.description"
                    :avatar-name="i.post.avatar.name"
                    :avatar-thumbnail="i.post.avatar.thumbnail"
                    :author-id="i.post.author.id"
                    :author-name="i.post.author.name"
                    :author-avatar="i.post.author.avatar"
                    :created-at="i.post.created_at"
                    :image="i.post.image"
                    class="hover:bg-neutral-200 dark:hover:bg-neutral-700"
                />
            </NuxtLink>
        </UiCategory>
    </div>
</template>
