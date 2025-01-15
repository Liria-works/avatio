<script lang="ts" setup>
const route = useRoute();
const user = useSupabaseUser();
</script>

<template>
    <div class="w-full flex flex-col sm:flex-row gap-10 sm:gap-5">
        <div
            v-if="user"
            v-show="
                user.id === route.params.id ||
                route.path === '/user/bookmark' ||
                route.path === '/user/setting'
            "
            class="w-full sm:w-60 grid grid-cols-2 sm:flex sm:flex-col gap-1 px-2"
        >
            <ButtonBase
                :to="{ name: 'user-id', params: { id: user.id } }"
                label="ユーザー情報"
                icon="lucide:user-round"
                :icon-size="19"
                class="outline-0 w-full justify-start"
            />
            <ButtonBase
                :to="{ name: 'user-bookmark' }"
                label="ブックマーク"
                icon="lucide:bookmark"
                :icon-size="19"
                class="outline-0 w-full justify-start"
            />

            <UiDivider class="hidden sm:block mx-3 my-2" />

            <ButtonBase
                :to="{ name: 'user-setting' }"
                label="設定"
                icon="lucide:settings"
                :icon-size="19"
                class="outline-0 w-full justify-start"
            />

            <ButtonBase
                label="ログアウト"
                icon="lucide:log-out"
                :icon-size="19"
                class="outline-0 w-full justify-start"
                @click="useSignOut"
            />
        </div>
        <div class="w-full flex flex-col">
            <NuxtPage />
        </div>
    </div>
</template>
