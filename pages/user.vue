<script lang="ts" setup>
const route = useRoute();
const user = useSupabaseUser();
</script>

<template>
    <div class="w-full flex flex-col sm:flex-row gap-10 sm:gap-5">
        <aside
            v-if="user"
            v-show="
                user.id === route.params.id ||
                route.path === '/user/bookmark' ||
                route.path === '/user/setting'
            "
            class="w-full sm:w-60 grid grid-cols-2 sm:flex sm:flex-col gap-1 px-2"
        >
            <NuxtLink
                :to="{ name: 'user-id', params: { id: user.id } }"
                class="w-full"
            >
                <AButton
                    text="ユーザー情報"
                    icon="lucide:user-round"
                    :icon-size="19"
                    class="w-full"
                />
            </NuxtLink>
            <NuxtLink :to="{ name: 'user-bookmark' }" class="w-full">
                <AButton
                    text="ブックマーク"
                    icon="lucide:bookmark"
                    :icon-size="19"
                    class="w-full"
                />
            </NuxtLink>
            <UDivider
                :ui="{
                    border: {
                        base: 'border-neutral-300 dark:border-neutral-600 mx-3 my-2',
                    },
                }"
                class="hidden sm:block"
            />
            <NuxtLink :to="{ name: 'user-setting' }" class="w-full">
                <AButton
                    text="設定"
                    icon="lucide:settings"
                    :icon-size="19"
                    class="w-full"
                />
            </NuxtLink>
            <AButton
                text="ログアウト"
                icon="lucide:log-out"
                :icon-size="19"
                @click="useSignOut"
            />
        </aside>
        <div class="w-full flex flex-col">
            <NuxtPage />
        </div>
    </div>
</template>
