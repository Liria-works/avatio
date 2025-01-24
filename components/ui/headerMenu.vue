<script lang="ts" setup>
const route = useRoute();
const user = useSupabaseUser();
const client = await useSBClient();

const name = ref<string | null>(null);
const avatar = ref<string | null>(null);

const userRefresh = async () => {
    if (!user.value) return (avatar.value = null);

    try {
        const { data } = await client
            .from('users')
            .select('name, avatar')
            .eq('id', user.value.id)
            .maybeSingle();

        name.value = data?.name ?? null;
        avatar.value = data?.avatar?.length
            ? useGetImage(data.avatar, { prefix: 'avatar' })
            : null;
    } catch {
        name.value = null;
        avatar.value = null;
    }
};

watchEffect(async () => await userRefresh());

onMounted(async () => {
    if (user.value) await userRefresh();
});
</script>

<template>
    <div class="items-center gap-2 flex">
        <div class="items-center gap-0.5 flex">
            <ButtonBase
                v-if="user && !['/login', '/setup/edit'].includes(route.path)"
                to="/setup/edit"
                class="p-3 md:pr-6 md:pl-5 md:mr-2 outline-0 md:outline-1 md:rounded-full whitespace-nowrap hover:bg-zinc-700 hover:text-zinc-200 hover:dark:bg-zinc-300 hover:dark:text-zinc-800"
            >
                <Icon name="lucide:plus" :size="18" />
                <span class="hidden md:block">セットアップを投稿</span>
            </ButtonBase>

            <ButtonBase
                v-if="route.path !== '/login'"
                to="/search"
                tooltip="検索"
                aria-label="検索"
                icon="lucide:search"
                variant="flat"
                class="hidden sm:block p-2.5 hover:bg-zinc-300 hover:dark:bg-zinc-600"
            />

            <ButtonTheme class="hidden sm:block" />
        </div>

        <template v-if="route.path !== '/login'">
            <UiTooltip v-if="user" :text="name ?? ''">
                <NuxtLink
                    tabindex="0"
                    :to="`/@${user?.id}`"
                    class="hidden sm:flex select-none rounded-full items-center outline outline-4 outline-transparent hover:outline-zinc-300 hover:dark:outline-zinc-600 transition-all ease-in-out duration-100"
                >
                    <UiAvatar :url="avatar ?? ''" :alt="name ?? ''" />
                </NuxtLink>
            </UiTooltip>

            <ButtonBase
                v-else
                to="/login"
                label="ログイン"
                variant="flat"
                class="hidden sm:block px-4 py-3 rounded-lg text-zinc-100 bg-zinc-500 dark:bg-zinc-600 hover:bg-zinc-600 hover:dark:bg-zinc-500"
            />
        </template>

        <PopupBase>
            <template #trigger>
                <ButtonBase
                    icon="lucide:menu"
                    variant="flat"
                    class="sm:hidden"
                />
            </template>
            <template #panel>
                <div class="flex flex-col items-center gap-1">
                    <ButtonBase
                        to="/search"
                        label="検索"
                        icon="lucide:search"
                        variant="flat"
                        class="p-2.5 hover:bg-zinc-300 hover:dark:bg-zinc-600"
                    />

                    <ButtonTheme :label="true" />

                    <ButtonBase
                        v-if="user"
                        :to="`/@${user?.id}`"
                        variant="flat"
                        class="p-2.5 hover:bg-zinc-300 hover:dark:bg-zinc-600"
                    >
                        <UiAvatar :url="avatar ?? ''" :alt="name ?? ''" />
                        <span>{{ name }}</span>
                    </ButtonBase>

                    <ButtonBase
                        v-else-if="route.path !== '/login'"
                        to="/login"
                        label="ログイン"
                        variant="flat"
                        class="px-4 py-3 rounded-lg text-zinc-100 bg-zinc-500 dark:bg-zinc-600 hover:bg-zinc-600 hover:dark:bg-zinc-500"
                    />
                </div>
            </template>
        </PopupBase>
    </div>
</template>
