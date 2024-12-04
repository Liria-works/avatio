<script setup lang="ts">
const types = ['PNG', 'JPEG', 'WebP', 'AVIF', 'TIFF'];
</script>

<template>
    <PopupBase>
        <template #trigger>
            <div class="flex items-center gap-1">
                <Icon
                    name="lucide:info"
                    class="text-indigo-400 dark:text-indigo-300"
                />
                <span
                    class="text-xs font-medium text-neutral-600 dark:text-neutral-300"
                >
                    画像の添付について
                </span>
            </div>
        </template>

        <template #panel>
            <div class="flex flex-col gap-1.5">
                <p
                    class="text-sm font-bold text-neutral-600 dark:text-neutral-200"
                >
                    対応形式
                </p>
                <div class="flex flex-wrap gap-1 items-center">
                    <UBadge
                        v-for="i in types"
                        :label="i"
                        :ui="{ rounded: 'rounded-xl' }"
                    />
                </div>
            </div>
            <div class="flex flex-col gap-1.5">
                <p
                    class="text-sm/relaxed text-neutral-600 dark:text-neutral-400"
                >
                    アップロードされた画像は、自動的に下記の仕様でJPEG圧縮されます。<br />
                    非営利運営に必要な処置になりますのでご了承ください。
                </p>
                <p
                    class="text-sm/relaxed text-neutral-600 dark:text-neutral-400"
                >
                    最大長辺解像度 1920px<br />最大ファイルサイズ 1.5MB
                </p>
            </div>
        </template>
    </PopupBase>
</template>
