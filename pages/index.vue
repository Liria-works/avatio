<script setup lang="ts">
import type { SetupSimple } from "@UI/composables/setup";
import MasonryWall from "@yeger/vue-masonry-wall";

const user = useSupabaseUser();

const setups = ref<SetupSimple[]>([]);
const loading = ref(true);

const mySetups = ref<SetupSimple[]>([]);

// const storeSetupIndex = useSetupIndex();
// const { GetSetupIndex } = storeSetupIndex;
// const { setupsIndex } = storeToRefs(storeSetupIndex);

const handleWheel: EventListener = (event) => {
    const container = event.currentTarget as HTMLElement;
    container.scrollLeft += (event as WheelEvent).deltaY;
    event.preventDefault(); // デフォルトの縦スクロールを無効化
};

onMounted(async () => {
    const scrollContainer = document.querySelector(".scroll-container");
    scrollContainer?.addEventListener("wheel", handleWheel);

    const client = await useSBClient();

    const { data } = await client
        .from("setups")
        .select(
            "id, created_at, updated_at, author(id, name, avatar), name, image, avatar(name, thumbnail)",
        )
        .range(0, 20)
        .order("created_at", { ascending: false });

    if (data) setups.value = data as unknown as SetupSimple[];

    if (user.value) {
        const { data } = await client
            .from("setups")
            .select(
                "id, created_at, updated_at, author(id, name, avatar), name, image, avatar(name, thumbnail)"
            )
            .eq("author", user.value.id)
            .order("updated_at", { ascending: false })
            .range(0, 20);

        if (data) mySetups.value = data as unknown as SetupSimple[];
    }

    loading.value = false;
});

onUnmounted(() => {
    const scrollContainer = document.querySelector(".scroll-container");
    scrollContainer?.removeEventListener("wheel", handleWheel);
});
</script>

<template>
    <div class="w-full flex flex-col gap-10">
        <div v-if="!user" class="w-full h-64 p-12 flex rounded-xl bg-neutral-300 dark:bg-neutral-600">
            <div class="flex flex-col justify-between">
                <div class="flex flex-col gap-4">
                    <p class="font-bold font-[Montserrat] text-4xl">
                        Welcome to Avatio
                    </p>
                    <p class="font-medium text-neutral-600 dark:text-neutral-300">
                        あなたのアバターを共有しよう
                    </p>
                </div>
                <UButton to="/setup/edit" icon="lucide:sparkles" size="lg" color="primary" variant="solid"
                    label="今すぐログイン" :trailing="false" :ui="{
                        rounded: 'rounded-xl',
                        font: 'whitespace-nowrap',
                    }" class="pr-4 w-fit" />
            </div>
        </div>
        <div v-show="user && mySetups.length" class="w-full flex flex-col gap-4">
            <div class="w-full flex items-start justify-between">
                <UiTitle label="あなたのセットアップ" icon="lucide:user-round" class="pt-2" />
                <UButton to="/setup/edit" icon="i-heroicons-plus" size="xl" color="primary" variant="solid"
                    label="セットアップを投稿" :trailing="false" :ui="{
                        rounded: 'rounded-full',
                        font: 'whitespace-nowrap',
                    }" class="pr-6 pl-5" />
            </div>

            <div class="w-full h-20 flex gap-4 overflow-x-auto no-scrollbar scroll-container">
                <NuxtLink v-for="i in mySetups" :to="{ name: 'setup-id', params: { id: i.id } }" class="min-w-64">
                    <ItemSetup no-hero :name="i.name" :avatar-name="i.avatar.name"
                        :avatar-thumbnail="i.avatar.thumbnail" :author-id="i.author.id" :author-name="i.author.name"
                        :author-avatar="i.author.avatar" :created-at="i.created_at" :image="i.image"
                        class="hover:bg-neutral-200 dark:hover:bg-neutral-700" />
                </NuxtLink>
            </div>
        </div>

        <UButton v-if="user && !mySetups.length" to="/setup/edit" icon="i-heroicons-plus" size="xl" color="primary"
            variant="solid" label="セットアップを投稿" :trailing="false" :ui="{
                rounded: 'rounded-full',
                font: 'whitespace-nowrap',
            }" block class="pr-4" />

        <div v-show="!loading" class="flex flex-col items-center gap-6 w-full">
            <UiTitle label="みんなのセットアップ" icon="lucide:sparkles" />
            <MasonryWall v-if="setups" :items="setups" :column-width="200" :gap="20" :ssr-columns="3" :min-columns="2"
                :max-columns="3">
                <template #default="{ item }">
                    <NuxtLink :to="{ name: 'setup-id', params: { id: item.id } }">
                        <ItemSetup :name="item.name" :avatar-name="item.avatar.name"
                            :avatar-thumbnail="item.avatar.thumbnail" :author-id="item.author.id"
                            :author-name="item.author.name" :author-avatar="item.author.avatar"
                            :created-at="item.created_at" :image="item.image"
                            class="hover:bg-neutral-200 dark:hover:bg-neutral-700" />
                    </NuxtLink>
                </template>
            </MasonryWall>

            <div v-if="!setups" class="w-full flex flex-col col-span-3 my-5 text-neutral-300 text-center">
                <p>セットアップが見つかりませんでした😢</p>
            </div>
        </div>
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
