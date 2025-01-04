<script lang="ts" setup></script>

<template>
    <div
        class="w-full flex flex-col border border-1 border-zinc-300 dark:border-zinc-600 rounded-lg overflow-clip"
    >
        <div class="empty:hidden w-full">
            <slot name="hero" />
        </div>
        <div class="w-full flex items-center">
            <slot name="thumbnail" />
            <slot name="main" />
        </div>
        <div class="empty:hidden w-full flex">
            <slot name="under" />
        </div>
    </div>
</template>
