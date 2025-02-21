<script lang="ts" setup>
import { twMerge } from 'tailwind-merge';

const emit = defineEmits(['publish']);

const title = defineModel<string>('title', { default: '' });
const description = defineModel<string>('description', { default: '' });
const tags = defineModel<string[]>('tags', { default: [] });
const coAuthors = defineModel<
    {
        id: string;
        name: string;
        avatar: string;
        note: string;
    }[]
>('coAuthors', { default: [] });
const image = defineModel<File | null>('image', { default: null });
const publishing = defineModel<boolean>('publishing', { default: false });

const { class: propClass } = defineProps<{ class?: string | string[] }>();

const router = useRouter();
</script>

<template>
    <div
        :class="
            twMerge(
                'relative rounded-lg',
                'flex flex-col',
                'lg:ring-2 ring-zinc-200 dark:ring-zinc-700',
                'lg:bg-zinc-100 lg:dark:bg-zinc-800',
                propClass
            )
        "
    >
        <div
            class="hidden lg:flex z-[1] sticky top-0 left-0 right-0 p-5 gap-1 bg-zinc-100 dark:bg-zinc-800"
        >
            <Button
                :label="!publishing ? '公開' : '処理中'"
                :icon="
                    !publishing ? 'lucide:upload' : 'i-svg-spinners-ring-resize'
                "
                :icon-size="18"
                variant="flat"
                :class="[
                    'grow rounded-full px-4 whitespace-nowrap',
                    'bg-zinc-600 hover:bg-zinc-300 hover:dark:bg-zinc-700  dark:bg-zinc-300',
                    'text-zinc-200 hover:text-zinc-600 dark:text-zinc-900 hover:dark:text-zinc-100',
                ]"
                @click="emit('publish')"
            >
            </Button>

            <Button
                tooltip="破棄"
                icon="lucide:trash"
                :icon-size="18"
                variant="flat"
                class="rounded-full"
                @click="router.back()"
            />
        </div>

        <div class="p-5 pt-2 flex flex-col gap-8">
            <div class="w-full flex flex-col items-start gap-3">
                <div class="w-full flex gap-2 items-center justify-between">
                    <UiTitle label="タイトル" icon="lucide:text" />
                    <UiCount
                        v-if="title.length"
                        :count="title.length"
                        :max="setupLimits().title"
                    />
                </div>
                <UiTextarea
                    v-model="title"
                    placeholder="セットアップ名"
                    class="w-full"
                />
            </div>

            <div
                class="grid grid-flow-row sm:grid-flow-col lg:grid-flow-row gap-8"
            >
                <div class="w-full flex flex-col items-start gap-3">
                    <div class="w-full flex gap-2 items-center justify-between">
                        <UiTitle label="画像" icon="lucide:image" />
                        <PopupUploadImage>
                            <button
                                type="button"
                                class="cursor-pointer flex items-center gap-1"
                            >
                                <Icon
                                    name="lucide:info"
                                    class="text-indigo-400 dark:text-indigo-300"
                                />
                                <span
                                    class="text-xs font-medium text-zinc-600 dark:text-zinc-300"
                                >
                                    画像の添付について
                                </span>
                            </button>
                        </PopupUploadImage>
                    </div>
                    <EditImage ref="editImage" v-model="image" />
                </div>

                <div class="flex flex-col gap-8">
                    <div class="w-full flex flex-col items-start gap-3">
                        <div
                            class="w-full flex gap-2 items-center justify-between"
                        >
                            <UiTitle label="説明" icon="lucide:text" />
                            <UiCount
                                v-if="description.length"
                                :count="description.length"
                                :max="setupLimits().description"
                            />
                        </div>
                        <UiTextarea
                            v-model="description"
                            placeholder="説明"
                            class="w-full"
                        />
                    </div>

                    <div class="w-full flex flex-col items-start gap-3">
                        <div
                            class="w-full flex gap-2 items-center justify-between"
                        >
                            <UiTitle label="タグ" icon="lucide:tags" />
                            <UiCount
                                v-if="tags.length"
                                :count="tags.length"
                                :max="setupLimits().tags"
                            />
                        </div>
                        <EditTags v-model="tags" />
                    </div>

                    <div class="w-full flex flex-col items-start gap-3">
                        <div
                            class="w-full flex gap-2 items-center justify-between"
                        >
                            <UiTitle
                                label="共同作者"
                                icon="lucide:users-round"
                            />
                            <UiCount
                                v-if="coAuthors.length"
                                :count="coAuthors.length"
                                :max="setupLimits().coAuthors"
                            />
                        </div>
                        <EditCoAuthor v-model="coAuthors" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
