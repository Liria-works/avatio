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
            <UiButton
                :to="{ name: 'user-id', params: { id: user.id } }"
                label="ユーザー情報"
                icon="lucide:user-round"
                :icon-size="19"
                ui="outline-0 w-full justify-start"
                class="w-full"
            />
            <UiButton
                :to="{ name: 'user-bookmark' }"
                label="ブックマーク"
                icon="lucide:bookmark"
                :icon-size="19"
                ui="outline-0 w-full justify-start"
                class="w-full"
            />

            <UDivider
                :ui="{
                    border: {
                        base: 'border-neutral-300 dark:border-neutral-600 mx-3 my-2',
                    },
                }"
                class="hidden sm:block"
            />

            <UiButton
                :to="{ name: 'user-setting' }"
                label="設定"
                icon="lucide:settings"
                :icon-size="19"
                ui="outline-0 w-full justify-start"
                class="w-full"
            />

            <UiButton
                label="ログアウト"
                icon="lucide:log-out"
                :icon-size="19"
                ui="outline-0 w-full justify-start"
                class="w-full"
                @click="useSignOut"
            />
        </aside>
        <div class="w-full flex flex-col">
            <NuxtPage />
        </div>
    </div>
</template>
