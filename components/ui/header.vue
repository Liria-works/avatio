<script setup lang="ts">
import type { User } from "@supabase/supabase-js";

const colorMode = useColorMode();
const user = ref<User | null>(null);

const storeMyAvatar = useMyAvatar();
const { GetMyAvatar } = storeMyAvatar;
const { myAvatar } = storeToRefs(storeMyAvatar);

const modalSearch = ref(false);

onMounted(async () => {
    user.value = useSupabaseUser().value;
    await GetMyAvatar();
});
</script>

<template>
    <div class="flex items-start justify-between w-full">
        <div
            class="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-shrink-0"
        >
            <NuxtLink to="/">
                <ClientOnly>
                    <NuxtImg
                        v-if="colorMode.value === 'light'"
                        width="160"
                        src="/logo_2_light.svg"
                        alt="Avatio Logo"
                    />
                    <NuxtImg
                        v-if="colorMode.value === 'dark'"
                        width="160"
                        src="/logo_2_dark.svg"
                        alt="Avatio Logo"
                    />
                </ClientOnly>
            </NuxtLink>
            <NuxtLink to="/private_alpha" class="rounded-full">
                <UBadge
                    label="Private Alpha"
                    size="sm"
                    :ui="{ rounded: 'rounded-full' }"
                    class="px-3"
                />
            </NuxtLink>
        </div>
        <div class="flex items-center gap-12 inset">
            <div class="items-center gap-2 flex">
                <div class="items-center gap-0.5 flex">
                    <UiButton
                        to="/search"
                        tooltip="検索"
                        icon="lucide:search"
                        ui="outline-0 p-2.5 hover:bg-neutral-300 hover:dark:bg-neutral-600"
                    />

                    <UModal
                        v-model="modalSearch"
                        :ui="{
                            background: 'bg-white dark:bg-neutral-100',
                            ring: 'ring-0',
                            rounded: 'rounded-xl',
                            inner: 'fixed inset-auto top-10 left-0 right-0 overflow-y-auto',
                        }"
                    >
                        <ModalSearch @close="modalSearch = false" />
                    </UModal>

                    <ClientOnly>
                        <UiButton
                            :icon-size="20"
                            :icon="
                                colorMode.value === 'light'
                                    ? 'i-heroicons-sun-20-solid'
                                    : 'i-heroicons-moon-20-solid'
                            "
                            tooltip="テーマ"
                            ui="outline-0 p-2.5 hover:bg-neutral-300 hover:dark:bg-neutral-600"
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

                <div class="flex items-center">
                    <NuxtLink
                        v-if="user"
                        :to="`/user/${user?.id}`"
                        class="rounded-full flex items-center outline outline-4 outline-transparent hover:outline-neutral-600 transition-all ease-in-out duration-100"
                    >
                        <UAvatar
                            v-if="myAvatar"
                            :src="myAvatar"
                            alt="Avatar"
                            size="sm"
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

                    <NuxtLink v-else to="/login">
                        <UiButton
                            label="ログイン"
                            ui="outline-0 px-4 py-3 rounded-lg text-neutral-100 bg-neutral-500 dark:bg-neutral-500 hover:bg-neutral-600 hover:dark:bg-neutral-600"
                        />
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>
