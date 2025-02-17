<script lang="ts" setup></script>

<template>
    <Hovercard>
        <template #trigger>
            <slot />
        </template>
        <template #content>
            <DialogDescription class="flex flex-col gap-4">
                <h2 class="text-sm font-semibold">フィードバックについて</h2>
                <p class="text-xs">
                    内容は第三者に対し公開されることはありません。<br />
                    送信したユーザーは、運営により確認可能です。
                </p>
            </DialogDescription>
        </template>
    </Hovercard>
</template>
