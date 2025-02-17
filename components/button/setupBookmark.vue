<script lang="ts" setup>
interface Props {
    id: number;
}
const { id } = defineProps<Props>();
const user = useSupabaseUser();

const bookmark = ref(false);
const modalLogin = ref(false);

const toggleBookmark = async () => {
    if (!user.value) return (modalLogin.value = true);

    if (bookmark.value) await useRemoveBookmark(id);
    else await useAddBookmark(id);

    bookmark.value = await useCheckBookmark(id);
};

onMounted(async () => {
    bookmark.value = await useCheckBookmark(id);
});

watchEffect(() => {
    if (user.value)
        (async () => {
            bookmark.value = await useCheckBookmark(id);
        })();
});
</script>

<template>
    <Button
        :tooltip="bookmark ? 'ブックマークから削除' : 'ブックマーク'"
        :icon="bookmark ? 'lucide:bookmark-x' : 'lucide:bookmark'"
        :aria-label="bookmark ? 'ブックマークから削除' : 'ブックマーク'"
        variant="flat"
        class="p-2.5 hover:bg-zinc-300 hover:dark:bg-zinc-600"
        :icon-class="
            bookmark
                ? 'text-red-500 dark:text-red-400'
                : 'text-zinc-600 dark:text-zinc-300'
        "
        @click="toggleBookmark"
    />
    <Modal v-model="modalLogin">
        <UiLogin />
    </Modal>
</template>
