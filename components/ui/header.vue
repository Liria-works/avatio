<script setup lang="ts">
const route = useRoute();
const colorMode = useColorMode();
const user = useSupabaseUser();
const client = await useSBClient();

const name = ref<string | null>(null);
const avatar = ref<string | null>(null);

const badge: { value: { label: string; link: string } } = await $fetch(
    '/api/edgeConfig/badge_main'
);

const userRefresh = async () => {
    if (user.value) {
        const { data } = await client
            .from('users')
            .select('name, avatar')
            .eq('id', user.value.id)
            .maybeSingle();

        name.value = data?.name ?? null;
        if (data && data.avatar && data.avatar.length)
            avatar.value = useGetImage(data.avatar);
        else avatar.value = null;
    } else avatar.value = null;
};

watchEffect(async () => await userRefresh());

onMounted(async () => {
    if (user.value) await userRefresh();
});
</script>

<template>
    <div class="flex items-start justify-between w-full">
        <div
            class="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-shrink-0"
        >
            <NuxtLink to="/" class="pt-1">
                <ClientOnly>
                    <NuxtImg
                        v-if="colorMode.value === 'light'"
                        width="160"
                        src="/logo_2_light.svg"
                        alt="Avatio Logo"
                        class="select-none"
                    />
                    <NuxtImg
                        v-if="colorMode.value === 'dark'"
                        width="160"
                        src="/logo_2_dark.svg"
                        alt="Avatio Logo"
                        class="select-none"
                    />
                </ClientOnly>
            </NuxtLink>
            <NuxtLink
                v-if="badge.value"
                :to="badge.value.link"
                class="rounded-full"
            >
                <UBadge
                    :label="badge.value.label"
                    size="sm"
                    :ui="{ rounded: 'rounded-full' }"
                    class="px-3 hover:bg-neutral-400 hover:dark:bg-neutral-500"
                />
            </NuxtLink>
        </div>
        <div class="flex items-center gap-12 inset">
            <div class="items-center gap-2 flex">
                <div class="items-center gap-0.5 flex">
                    <UiButton
                        v-if="route.path !== '/login'"
                        to="/search"
                        tooltip="検索"
                        icon="lucide:search"
                        variant="flat"
                        class="hidden sm:block p-2.5 hover:bg-neutral-300 hover:dark:bg-neutral-600"
                    />

                    <ClientOnly>
                        <UiButton
                            :icon-size="20"
                            :icon="
                                colorMode.value === 'light'
                                    ? 'i-heroicons-sun-20-solid'
                                    : 'i-heroicons-moon-20-solid'
                            "
                            tooltip="テーマ"
                            variant="flat"
                            class="hidden sm:block p-2.5 hover:bg-neutral-300 hover:dark:bg-neutral-600"
                            @click="
                                colorMode.preference =
                                    colorMode.value === 'dark'
                                        ? 'light'
                                        : 'dark'
                            "
                        />
                        <template #fallback>
                            <div class="w-0 h-8" />
                        </template>
                    </ClientOnly>

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
                        :to="`/user/${user?.id}`"
                        class="hidden sm:flex rounded-full items-center outline outline-4 outline-transparent hover:outline-neutral-300 hover:dark:outline-neutral-600 transition-all ease-in-out duration-100"
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
                            class="flex items-center justify-center size-[32px] rounded-full flex-shrink-0 bg-neutral-200 dark:bg-neutral-500"
                        >
                            <Icon
                                name="lucide:user-round"
                                size="18"
                                class="text-neutral-600 dark:text-neutral-300"
                            />
                        </div>
                    </NuxtLink>
                </UTooltip>

                <UiButton
                    v-else-if="route.path !== '/login'"
                    to="/login"
                    label="ログイン"
                    variant="flat"
                    class="hidden sm:block px-4 py-3 rounded-lg text-neutral-100 bg-neutral-500 dark:bg-neutral-600 hover:bg-neutral-600 hover:dark:bg-neutral-500"
                />

                <PopupBase>
                    <template #trigger>
                        <UiButton
                            icon="lucide:menu"
                            variant="flat"
                            class="sm:hidden"
                        />
                    </template>
                    <template #panel>
                        <div class="flex flex-col items-center gap-1">
                            <UiButton
                                to="/search"
                                label="検索"
                                icon="lucide:search"
                                variant="flat"
                                class="p-2.5 hover:bg-neutral-300 hover:dark:bg-neutral-600"
                            />
                            <UiButton
                                :icon-size="20"
                                :icon="
                                    colorMode.value === 'light'
                                        ? 'i-heroicons-sun-20-solid'
                                        : 'i-heroicons-moon-20-solid'
                                "
                                label="テーマ"
                                variant="flat"
                                class="p-2.5 hover:bg-neutral-300 hover:dark:bg-neutral-600"
                                @click="
                                    colorMode.preference =
                                        colorMode.value === 'dark'
                                            ? 'light'
                                            : 'dark'
                                "
                            />
                            <NuxtLink
                                v-if="user"
                                :to="`/user/${user?.id}`"
                                class="hidden sm:flex rounded-full items-center outline outline-4 outline-transparent hover:outline-neutral-300 hover:dark:outline-neutral-600 transition-all ease-in-out duration-100"
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
                                    class="flex items-center justify-center size-[32px] rounded-full flex-shrink-0 bg-neutral-200 dark:bg-neutral-500"
                                >
                                    <Icon
                                        name="lucide:user-round"
                                        size="18"
                                        class="text-neutral-600 dark:text-neutral-300"
                                    />
                                </div>
                            </NuxtLink>

                            <UiButton
                                v-else-if="route.path !== '/login'"
                                to="/login"
                                label="ログイン"
                                variant="flat"
                                class="hidden sm:block px-4 py-3 rounded-lg text-neutral-100 bg-neutral-500 dark:bg-neutral-600 hover:bg-neutral-600 hover:dark:bg-neutral-500"
                            />
                        </div>
                    </template>
                </PopupBase>
            </div>
        </div>
    </div>
</template>
