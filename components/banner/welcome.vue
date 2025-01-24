<script lang="ts" setup>
import { createStorage } from 'unstorage';
import localStorageDriver from 'unstorage/drivers/localstorage';

const storage = createStorage({
    driver: localStorageDriver({}),
});

const user = useSupabaseUser();
const visible = ref(false);

if (!(await storage.has('welcomeBanner'))) visible.value = true;

const save = async () => await storage.set('welcomeBanner', true);
</script>

<template>
    <div
        v-if="!user && visible"
        class="rounded-lg pl-4 pr-2 py-3 flex gap-2 items-center justify-between ring-1 ring-zinc-300 dark:ring-zinc-700"
    >
        <div class="flex flex-col md:flex-row gap-x-4 gap-y-2 items-start">
            <p class="text-lg font-bold leading-none whitespace-nowrap">
                Welcome to Avatio!
            </p>
            <p
                class="md:pt-0.5 text-xs break-keep text-zinc-700 dark:text-zinc-300"
            >
                {{
                    useSentence('ログインしてセットアップを投稿してみましょう')
                }}
            </p>
        </div>
        <div class="flex gap-1 items-center">
            <ButtonBase to="/login" label="ログイン" class="rounded-full" />
            <ButtonBase
                icon="lucide:x"
                variant="flat"
                class="flex-shrink-0 rounded-full p-2"
                @click="
                    visible = false;
                    save();
                "
            />
        </div>
    </div>
</template>
