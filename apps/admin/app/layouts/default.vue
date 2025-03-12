<script lang="ts" setup></script>

<template>
    <div class="flex flex-col items-center gap-4 min-h-screen">
        <header class="w-full my-4 flex items-center">
            <Icon name="avatio:avatio" size="24" />
            Admin
        </header>
        <UContainer>
            <slot />
        </UContainer>
    </div>
</template>
