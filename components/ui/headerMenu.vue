<script lang="ts" setup>
const route = useRoute();
const user = useSupabaseUser();
const client = useSupabaseClient();

const userRefresh = async () => {
    if (!user.value) return (userProfile.value.avatar = null);

    try {
        const { data } = await client
            .from('users')
            .select('name, avatar')
            .eq('id', user.value.id)
            .maybeSingle();

        userProfile.value.name = data?.name ?? null;
        userProfile.value.avatar = data?.avatar?.length
            ? useGetImage(data.avatar, { prefix: 'avatar' })
            : null;
    } catch {
        userProfile.value.name = null;
        userProfile.value.avatar = null;
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
            <ClientOnly>
                <UiTooltip v-if="user" :text="userProfile.name ?? ''">
                    <NuxtLink
                        id="user"
                        tabindex="0"
                        :to="`/@${user?.id}`"
                        class="hidden sm:flex select-none rounded-full items-center outline-4 outline-transparent hover:outline-zinc-300 hover:dark:outline-zinc-600 transition-all ease-in-out duration-100"
                    >
                        <UiAvatar
                            :url="userProfile.avatar ?? ''"
                            :alt="userProfile.name ?? ''"
                        />
                    </NuxtLink>
                </UiTooltip>

                <ButtonBase
                    v-else
                    id="login"
                    to="/login"
                    label="ログイン"
                    variant="flat"
                    class="hidden sm:block px-4 py-3 rounded-lg text-zinc-100 bg-zinc-500 dark:bg-zinc-600 hover:bg-zinc-600 hover:dark:bg-zinc-500"
                />
            </ClientOnly>
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

                    <template v-if="route.path !== '/login'">
                        <ClientOnly>
                            <ButtonBase
                                v-if="user"
                                :to="`/@${user?.id}`"
                                variant="flat"
                                class="p-2.5 hover:bg-zinc-300 hover:dark:bg-zinc-600"
                            >
                                <UiAvatar
                                    :url="userProfile.avatar ?? ''"
                                    :alt="userProfile.name ?? ''"
                                />
                                <span>{{ userProfile.name }}</span>
                            </ButtonBase>

                            <ButtonBase
                                v-else-if="route.path !== '/login'"
                                to="/login"
                                label="ログイン"
                                variant="flat"
                                class="px-4 py-3 rounded-lg text-zinc-100 bg-zinc-500 dark:bg-zinc-600 hover:bg-zinc-600 hover:dark:bg-zinc-500"
                            />
                        </ClientOnly>
                    </template>
                </div>
            </template>
        </PopupBase>
    </div>
</template>
