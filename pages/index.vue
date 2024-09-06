<script setup lang="ts">
const user = useSupabaseUser();

const setups = ref<Setup[]>([]);
const loading = ref(true);

const mySetups = ref<Setup[]>([]);

const storeSetupIndex = useSetupIndex();
const { GetSetupIndex } = storeSetupIndex;
const { setupsIndex } = storeToRefs(storeSetupIndex);

const handleWheel: EventListener = (event) => {
    const container = event.currentTarget as HTMLElement;
    container.scrollLeft += (event as WheelEvent).deltaY;
    event.preventDefault(); // デフォルトの縦スクロールを無効化
};

onMounted(async () => {
    const scrollContainer = document.querySelector(".scroll-container");
    scrollContainer?.addEventListener("wheel", handleWheel);

    if (!setupsIndex.value.length) {
        await GetSetupIndex();
    }
    setups.value = setupsIndex.value;

    if (user.value) {
        const client = await useSBClient();
        const { data } = await client
            .from("setups")
            .select("id, description, name, author, avatar, image, created_at")
            .eq("author", user.value.id)
            .order("updated_at", { ascending: false })
            .range(0, 20);
        mySetups.value = data as Setup[];
    }

    loading.value = false;
});

onUnmounted(() => {
    const scrollContainer = document.querySelector(".scroll-container");
    scrollContainer?.removeEventListener("wheel", handleWheel);
});
</script>

<template>
    <div class="w-full flex flex-col gap-8">
        <div
            v-if="!user"
            class="w-full h-64 p-12 flex rounded-xl bg-neutral-300 dark:bg-neutral-600"
        >
            <div class="flex flex-col justify-between">
                <div class="flex flex-col gap-4">
                    <p class="font-bold font-[Montserrat] text-4xl">
                        Welcome to Avatio
                    </p>
                    <p
                        class="font-medium text-neutral-600 dark:text-neutral-300"
                    >
                        あなたのアバターを共有しよう
                    </p>
                </div>
                <UButton
                    to="/setup/edit"
                    icon="lucide:sparkles"
                    size="lg"
                    color="primary"
                    variant="solid"
                    label="今すぐログイン"
                    :trailing="false"
                    :ui="{
                        rounded: 'rounded-xl',
                        font: 'whitespace-nowrap',
                    }"
                    class="pr-4 w-fit"
                />
            </div>
        </div>
        <div
            v-show="user && mySetups.length"
            class="w-full flex flex-col gap-4"
        >
            <div class="w-full flex items-start justify-between">
                <ATitle
                    title="あなたのセットアップ"
                    icon="lucide:user-round"
                    class="pt-2"
                />
                <UButton
                    to="/setup/edit"
                    icon="i-heroicons-plus"
                    size="xl"
                    color="primary"
                    variant="solid"
                    label="セットアップを投稿"
                    :trailing="false"
                    :ui="{
                        rounded: 'rounded-full',
                        font: 'whitespace-nowrap',
                    }"
                    class="pr-6 pl-5"
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
                        :avatar="i.avatar"
                        :author="i.author"
                        :created-at="i.created_at"
                        :image="i.image"
                        class="hover:bg-neutral-200 dark:hover:bg-neutral-700"
                    />
                </NuxtLink>
            </div>
        </div>

        <UButton
            v-if="user && !mySetups.length"
            to="/setup/edit"
            icon="i-heroicons-plus"
            size="xl"
            color="primary"
            variant="solid"
            label="セットアップを投稿"
            :trailing="false"
            :ui="{
                rounded: 'rounded-full',
                font: 'whitespace-nowrap',
            }"
            block
            class="pr-4"
        />

        <div class="items-start gap-8 flex w-full">
            <div class="flex flex-col items-center gap-8 w-full">
                <ACategory
                    title="みんなのセットアップ"
                    icon="lucide:sparkles"
                    class="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                    <div class="col-span-2" />
                    <USkeleton
                        v-for="i in 8"
                        :key="'skeleton-b-' + i"
                        v-show="loading"
                        class="h-16 w-full"
                        :ui="{
                            background: 'bg-gray-100 dark:bg-gray-700',
                            rounded: 'rounded-xl',
                        }"
                    />

                    <div
                        v-show="!loading"
                        v-if="!setups"
                        class="w-full flex flex-col col-span-3 my-5 text-neutral-300 text-center"
                    >
                        <p>セットアップが見つかりませんでした😢</p>
                    </div>

                    <NuxtLink
                        v-for="i in setups"
                        :to="{ name: 'setup-id', params: { id: i.id } }"
                        :class="['w-full', { 'row-span-3': i.image }]"
                    >
                        <ItemSetup
                            :name="i.name"
                            :avatar="i.avatar"
                            :author="i.author"
                            :created-at="i.created_at"
                            :image="i.image"
                            class="hover:bg-neutral-200 dark:hover:bg-neutral-700"
                        />
                    </NuxtLink>
                </ACategory>
            </div>
        </div>
    </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
}
</style>
