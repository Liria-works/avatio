<script lang="ts" setup>
const route = useRoute();
const user = useSupabaseUser();
const client = await useSBClient();

const name = ref<string | null>(null);
const avatar = ref<string | null>(null);

const userRefresh = async () => {
    if (!user.value) {
        avatar.value = null;
        return;
    }

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
            <UiButton
                v-if="route.path !== '/login'"
                to="/setup/edit"
                class="p-3 md:pr-6 md:pl-5 md:mr-2 rounded-full whitespace-nowrap hover:bg-zinc-700 hover:text-zinc-200 hover:dark:bg-zinc-300 hover:dark:text-zinc-800"
            >
                <Icon name="lucide:plus" :size="18" />
                <span class="hidden md:block">セットアップを投稿</span>
            </UiButton>

            <UiButton
                v-if="route.path !== '/login'"
                to="/search"
                tooltip="検索"
                aria-label="検索"
                icon="lucide:search"
                variant="flat"
                class="hidden sm:block p-2.5 hover:bg-zinc-300 hover:dark:bg-zinc-600"
            />

            <UiThemeButton />

            <!-- <UPopover :ui="{
                rounded: 'rounded-xl',
                ring: 'ring-1 ring-gray-300 dark:ring-gray-600',
            }" class="flex">
                <UiButton :icon-size="20" icon="lucide:languages" tooltip="Languages" />

                <template #panel>
                    <div class="p-8">多言語未対応</div>
                </template>
            </UPopover> -->
        </div>

        <UTooltip v-if="user" :text="name ?? ''">
            <NuxtLink
                tabindex="0"
                :to="`/user/${user?.id}`"
                class="hidden sm:flex select-none rounded-full items-center outline outline-4 outline-transparent hover:outline-zinc-300 hover:dark:outline-zinc-600 transition-all ease-in-out duration-100"
            >
                <UiAvatar :url="avatar ?? ''" :alt="name ?? ''" />
            </NuxtLink>
        </UTooltip>

        <UiButton
            v-else-if="route.path !== '/login'"
            to="/login"
            label="ログイン"
            variant="flat"
            class="hidden sm:block px-4 py-3 rounded-lg text-zinc-100 bg-zinc-500 dark:bg-zinc-600 hover:bg-zinc-600 hover:dark:bg-zinc-500"
        />

        <PopupBase>
            <template #trigger>
                <UiButton icon="lucide:menu" variant="flat" class="sm:hidden" />
            </template>
            <template #panel>
                <div class="flex flex-col items-center gap-1">
                    <UiButton
                        to="/search"
                        label="検索"
                        icon="lucide:search"
                        variant="flat"
                        class="p-2.5 hover:bg-zinc-300 hover:dark:bg-zinc-600"
                    />
                    <UiThemeButton />
                    <NuxtLink
                        v-if="user"
                        tabindex="0"
                        :to="`/user/${user?.id}`"
                        class="hidden sm:flex rounded-full items-center outline outline-4 outline-transparent hover:outline-zinc-300 hover:dark:outline-zinc-600 transition-all ease-in-out duration-100"
                    >
                        <UAvatar
                            v-if="avatar"
                            :src="avatar"
                            alt="Avatar"
                            size="sm"
                            class="select-none"
                        />
                        <div
                            v-else
                            class="flex items-center justify-center size-[32px] rounded-full flex-shrink-0 bg-zinc-200 dark:bg-zinc-500"
                        >
                            <Icon
                                name="lucide:user-round"
                                size="18"
                                class="text-zinc-600 dark:text-zinc-300"
                            />
                        </div>
                    </NuxtLink>

                    <UiButton
                        v-else-if="route.path !== '/login'"
                        to="/login"
                        label="ログイン"
                        variant="flat"
                        class="hidden sm:block px-4 py-3 rounded-lg text-zinc-100 bg-zinc-500 dark:bg-zinc-600 hover:bg-zinc-600 hover:dark:bg-zinc-500"
                    />
                </div>
            </template>
        </PopupBase>
    </div>
</template>
