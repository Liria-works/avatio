<script lang="ts" setup>
import { twMerge } from 'tailwind-merge';

interface CoAuthor {
    id: string;
    name: string;
    avatar?: string | null;
    note: string;
}

interface Props {
    description: string | null;
    tags: string[];
    coAuthors: CoAuthor[];
    class?: string | string[];
}

const { description, tags, coAuthors, class: propClass } = defineProps<Props>();
</script>

<template>
    <div :class="twMerge('flex flex-col gap-5', propClass)">
        <div
            v-if="tags && tags.length"
            class="items-center gap-1.5 flex flex-wrap"
        >
            <Button
                v-for="tag in tags"
                :key="useId()"
                :label="tag"
                class="rounded-full"
                @click="navigateTo(`/search?tag=${tag}`)"
            />
        </div>

        <div
            v-if="description"
            class="self-stretch rounded-lg flex flex-col gap-1.5"
        >
            <h2 class="text-zinc-500 text-sm mt-1 leading-none">説明</h2>
            <p
                class="pl-1 text-sm/relaxed whitespace-pre-wrap break-keep [overflow-wrap:anywhere] text-zinc-900 dark:text-zinc-100"
            >
                {{ useSentence(description) }}
            </p>
        </div>

        <div
            v-if="coAuthors.length"
            class="self-stretch rounded-lg flex flex-col gap-3"
        >
            <h2 class="text-zinc-500 text-sm mt-1 leading-none">共同作者</h2>
            <ul class="flex flex-col gap-2 pl-1">
                <li
                    v-for="coAuthor in coAuthors"
                    :key="coAuthor.id"
                    class="p-2 rounded-lg flex flex-col gap-1.5 ring-1 ring-zinc-300 dark:ring-zinc-700"
                >
                    <NuxtLink
                        :to="`/@${coAuthor.id}`"
                        class="flex flex-row gap-3 items-center"
                    >
                        <UiAvatar
                            :url="
                                coAuthor.avatar
                                    ? useGetImage(coAuthor.avatar, {
                                          prefix: 'avatar',
                                      })
                                    : ''
                            "
                            :alt="coAuthor.name"
                        />
                        <p
                            class="text-black dark:text-white pb-0.5 text-left font-normal"
                        >
                            {{ coAuthor.name }}
                        </p>
                    </NuxtLink>
                    <p
                        v-if="coAuthor.note.length"
                        class="pl-1 text-sm text-zinc-600 dark:text-zinc-400"
                    >
                        {{ coAuthor.note }}
                    </p>
                </li>
            </ul>
        </div>
    </div>
</template>
