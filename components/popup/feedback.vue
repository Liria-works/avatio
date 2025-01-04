<script setup lang="ts"></script>

<template>
    <PopupBase>
        <template #trigger>
            <Icon
                name="lucide:info"
                class="flex-shrink-0 size-4 text-zinc-400 dark:text-zinc-300"
            />
        </template>

        <template #panel>
            <h2 class="text-sm font-semibold">フィードバックについて</h2>
            <p class="text-xs">
                内容は第三者に対し公開されることはありません。<br />
                送信したユーザーは、運営により確認可能です。
            </p>
        </template>
    </PopupBase>
</template>
