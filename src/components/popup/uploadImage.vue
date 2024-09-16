<template>
    <UPopover
        mode="hover"
        :ui="{
            rounded: 'rounded-xl',
            ring: 'ring-1 ring-gray-300 dark:ring-gray-600',
        }"
        class="w-full"
    >
        <button class="flex items-center gap-1 w-full">
            <Icon
                name="lucide:info"
                class="text-indigo-400 dark:text-indigo-300"
            />
            <span
                class="text-xs font-medium text-neutral-600 dark:text-neutral-300"
            >
                画像の添付について
            </span>
        </button>

        <template #panel>
            <div
                class="p-3 gap-4 flex flex-col bg-neutral-300 dark:bg-neutral-900"
            >
                <div class="flex flex-col gap-1.5">
                    <p
                        class="text-sm font-bold text-neutral-600 dark:text-neutral-200"
                    >
                        対応形式
                    </p>
                    <div class="flex flex-wrap gap-1 items-center">
                        <UBadge label="PNG" :ui="{ rounded: 'rounded-xl' }" />
                        <UBadge label="JPEG" :ui="{ rounded: 'rounded-xl' }" />
                        <UBadge label="TIFF" :ui="{ rounded: 'rounded-xl' }" />
                    </div>
                    <p
                        class="text-sm/relaxed text-neutral-600 dark:text-neutral-400"
                    >
                        対応形式の制限は、外部ライブラリの仕様によるものです。
                    </p>
                    <p
                        class="text-xs/relaxed font-medium text-neutral-500 dark:text-neutral-400"
                    >
                        圧縮処理のアプローチにアイデアをお持ちの方は、<br />
                        ぜひGitHubにIssueを作成してください。
                    </p>
                </div>
                <div class="flex flex-col gap-1.5">
                    <p
                        class="text-sm font-bold text-neutral-600 dark:text-neutral-200"
                    >
                        自動圧縮
                    </p>
                    <p
                        class="text-sm/relaxed text-neutral-600 dark:text-neutral-400"
                    >
                        アップロードされた画像は、自動的に下記の仕様でJPEG圧縮されます。<br />
                        長辺解像度 1024px 以下、ファイルサイズ 80KB 以下<br />
                        非営利運営に必要な処置になりますのでご了承ください。
                    </p>
                </div>
            </div>
        </template>
    </UPopover>
</template>
