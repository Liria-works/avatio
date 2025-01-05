<script setup lang="ts">
const user = useSupabaseUser();
const client = await useSBClient();

const mySetups = ref<SetupSimple[]>([]);

if (user.value) {
    const { data: mySetupsData } = await client
        .from('setups')
        .select(
            `
            id,
            created_at,
            name,
            author(id, name, avatar),
            image,
            items:setup_items(
                data:item_id(
                    id, outdated, category, name, thumbnail, nsfw
                )
            )
            `
        )
        .eq('setup_items.item_id.category', '208')
        .eq('author', user.value.id)
        .order('updated_at', { ascending: false })
        .range(0, 20)
        .returns<SetupSimple[]>();

    if (mySetupsData)
        mySetups.value = mySetupsData.map((setup) => {
            return {
                ...setup,
                avatars: setup.items.filter((i) => i.data).map((i) => i.data),
            };
        });
}

const handleWheel: EventListener = (event) => {
    const container = event.currentTarget as HTMLElement;
    container.scrollLeft += (event as WheelEvent).deltaY;
    event.preventDefault(); // デフォルトの縦スクロールを無効化
};

onMounted(async () => {
    const scrollContainer = document.querySelector('.scroll-container');
    scrollContainer?.addEventListener('wheel', handleWheel);
});

onUnmounted(() => {
    const scrollContainer = document.querySelector('.scroll-container');
    scrollContainer?.removeEventListener('wheel', handleWheel);
});
</script>

<template>
    <div
        v-if="user"
        v-show="mySetups.length"
        class="w-full flex flex-col gap-4"
    >
        <div class="w-full flex items-start justify-between">
            <UiTitle
                label="あなたのセットアップ"
                icon="lucide:user-round"
                size="lg"
                class="pt-2"
            />
            <!-- <UiButton
                to="/setup/edit"
                icon="i-heroicons-plus"
                label="セットアップを投稿"
                class="pr-6 pl-5 rounded-full whitespace-nowrap"
            /> -->
        </div>

        <div
            class="w-full flex gap-4 overflow-x-auto no-scrollbar scroll-container"
        >
            <ItemSetup
                v-for="i in mySetups"
                :key="useId()"
                no-hero
                no-user
                :id="i.id"
                :name="i.name"
                :avatar-name="i.avatars[0].name"
                :avatar-thumbnail="i.avatars[0].thumbnail"
                :avatar-outdated="i.avatars[0].outdated"
                :author-id="i.author.id"
                :author-name="i.author.name"
                :author-avatar="i.author.avatar"
                :created-at="i.created_at"
                :image="i.image"
                class="min-w-64"
            />
        </div>
    </div>

    <div
        v-if="user && !mySetups.length"
        class="w-full py-5 gap-4 flex flex-col items-center"
    >
        <p>最初のセットアップを作成してみましょう</p>
        <UiButton
            to="/setup/edit"
            icon="i-heroicons-plus"
            label="セットアップを投稿"
            class="pr-4 rounded-full whitespace-nowrap"
        />
    </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    /* IE and Edge */
    scrollbar-width: none;
    /* Firefox */
}
</style>
