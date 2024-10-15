<script setup lang="ts">
const user = useSupabaseUser();

const mySetups = ref<SetupSimple[]>([]);
const loading = ref(true);

const handleWheel: EventListener = (event) => {
    const container = event.currentTarget as HTMLElement;
    container.scrollLeft += (event as WheelEvent).deltaY;
    event.preventDefault(); // デフォルトの縦スクロールを無効化
};

onMounted(async () => {
    const scrollContainer = document.querySelector(".scroll-container");
    scrollContainer?.addEventListener("wheel", handleWheel);

    const client = await useSBClient();

    if (user.value) {
        const { data: mySetupsData } = await client
            .from("setups")
            .select(
                "id, created_at, updated_at, author(id, name, avatar), name, image, avatar(name, thumbnail)"
            )
            .eq("author", user.value.id)
            .order("updated_at", { ascending: false })
            .range(0, 20);

        if (mySetupsData)
            mySetups.value = mySetupsData as unknown as SetupSimple[];
    }

    loading.value = false;
});

onUnmounted(() => {
    const scrollContainer = document.querySelector(".scroll-container");
    scrollContainer?.removeEventListener("wheel", handleWheel);
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
                class="pt-2"
            />
            <UiButton
                to="/setup/edit"
                icon="i-heroicons-plus"
                label="セットアップを投稿"
                ui="pr-6 pl-5 rounded-full whitespace-nowrap"
            />
        </div>

        <div
            class="w-full h-20 flex gap-4 overflow-x-auto no-scrollbar scroll-container"
        >
            <NuxtLink
                v-for="i in mySetups"
                :to="{ name: 'setup-id', params: { id: i.id } }"
                class="min-w-64"
            >
                <ItemSetup
                    no-hero
                    :name="i.name"
                    :avatar-name="i.avatar.name"
                    :avatar-thumbnail="i.avatar.thumbnail"
                    :author-id="i.author.id"
                    :author-name="i.author.name"
                    :author-avatar="i.author.avatar"
                    :created-at="i.created_at"
                    :image="i.image"
                    class="hover:bg-neutral-200 dark:hover:bg-neutral-700"
                />
            </NuxtLink>
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
            ui="pr-4 rounded-full whitespace-nowrap"
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
