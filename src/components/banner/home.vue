<script setup lang="ts">
import Button from "../../components/button.vue";
</script>

<template>
    <div class="w-full flex flex-col gap-10">
        <div class="w-full h-64 p-12 flex rounded-xl bg-neutral-300 dark:bg-neutral-600">
            <div class="flex flex-col justify-between">
                <div class="flex flex-col gap-4">
                    <p class="font-bold font-[Montserrat] text-4xl">
                        Welcome to Avatio
                    </p>
                    <p class="font-medium text-neutral-600 dark:text-neutral-300">
                        あなたのアバターを共有しよう
                    </p>
                </div>
                <Button client:load to="/setup/edit" icon="lucide:sparkles" label="今すぐログイン" />
            </div>
        </div>
    </div>
</template>