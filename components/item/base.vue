<script lang="ts" setup></script>

<template>
    <div
        class="w-full flex flex-col border border-1 border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-750 rounded-lg overflow-clip"
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
