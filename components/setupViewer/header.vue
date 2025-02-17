<script lang="ts" setup>
import { twMerge } from 'tailwind-merge';

interface Props {
    id: number;
    title: string;
    description: string | null;
    author: Author;
    createdAt: string;
    class?: string | string[];
}
const {
    id,
    title,
    description,
    author,
    createdAt,
    class: propClass,
} = defineProps<Props>();

const user = useSupabaseUser();
const modalDelete = ref(false);
</script>

<template>
    <div :class="twMerge('flex flex-col gap-3', propClass)">
        <h1
            class="w-full text-left text-2xl font-bold line-clamp-2 break-keep [overflow-wrap:anywhere;] text-black dark:text-white"
        >
            {{ useSentence(title) }}
        </h1>

        <div class="w-full gap-3 flex flex-wrap items-center">
            <div class="grow flex flex-wrap items-center gap-x-5 gap-y-2">
                <NuxtLink
                    :to="`/@${author.id}`"
                    class="flex flex-row gap-3 items-center"
                >
                    <UiAvatar
                        :url="
                            author.avatar
                                ? useGetImage(author.avatar, {
                                      prefix: 'avatar',
                                  })
                                : ''
                        "
                        :alt="author.name"
                    />
                    <p
                        class="text-black dark:text-white pb-0.5 text-left font-normal"
                    >
                        {{ author.name }}
                    </p>
                </NuxtLink>

                <div class="flex items-center gap-2">
                    <p
                        class="text-sm text-zinc-500 dark:text-zinc-400 whitespace-nowrap leading-none"
                    >
                        {{ useLocaledDate(new Date(createdAt)) }}
                        に公開
                    </p>
                </div>
            </div>

            <div class="flex items-center gap-1">
                <ButtonSetupBookmark :id="id" />

                <Button
                    v-if="user?.id === author.id"
                    tooltip="削除"
                    aria-label="削除"
                    icon="lucide:trash"
                    :icon-size="18"
                    variant="flat"
                    class="p-2.5 hover:bg-zinc-300 hover:dark:bg-zinc-600"
                    icon-class="text-red-400 dark:text-red-300"
                    @click="modalDelete = true"
                />

                <PopupShare
                    :setup-name="title"
                    :setup-description="description ?? ''"
                    :setup-author="author.name"
                >
                    <Button
                        icon="lucide:share-2"
                        :icon-size="18"
                        tooltip="シェア"
                        aria-label="シェア"
                        aria-expanded="false"
                        variant="flat"
                        class="p-2.5 hover:bg-zinc-300 hover:dark:bg-zinc-600"
                    />
                </PopupShare>
            </div>
        </div>
    </div>
    <ModalDeleteSetup v-model="modalDelete" :id="id" />
</template>
