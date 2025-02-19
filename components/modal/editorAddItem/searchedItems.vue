<script lang="ts" setup>
const searchItems = defineModel<
    {
        id: number;
        name: string;
        thumbnail: string;
        shop: string;
        category: string;
    }[]
>('items', {
    default: [],
});
const searching = defineModel<boolean>('searching', {
    default: false,
});
const emit = defineEmits(['add']);
</script>

<template>
    <div
        class="min-h-[30vh] px-4 py-3 rounded-2xl ring-1 ring-zinc-300 dark:ring-zinc-700 bg-zinc-100 dark:bg-zinc-900"
    >
        <div v-if="searching" class="flex items-center justify-center">
            <Icon name="i-svg-spinners-ring-resize" />
        </div>

        <div
            v-else
            class="max-h-[60vh] w-full flex flex-col gap-6 overflow-y-auto"
        >
            <div
                v-for="c in Object.values(itemCategories())"
                :key="useId()"
                class="empty:hidden w-full flex flex-col gap-3"
            >
                <template
                    v-if="
                        searchItems.filter((item) =>
                            c.id
                                ? item.category === c.id
                                : !Object.values(itemCategories())
                                      .map((value) => value.id)
                                      .includes(item.category)
                        ).length
                    "
                >
                    <UiTitle :label="c.label" :icon="c.icon" />
                    <div class="flex flex-col gap-2 px-3">
                        <Button
                            v-for="i in searchItems.filter((item) =>
                                c.id
                                    ? item.category === c.id
                                    : !Object.values(itemCategories())
                                          .map((value) => value.id)
                                          .includes(item.category)
                            )"
                            :key="useId()"
                            variant="flat"
                            class="w-full p-1 pr-2"
                            @click="emit('add', i.id)"
                        >
                            <NuxtImg
                                :src="i.thumbnail"
                                :alt="i.name"
                                :width="40"
                                :height="40"
                                format="webp"
                                fit="cover"
                                class="size-10 rounded-lg object-cover"
                            />
                            <p
                                class="grow text-left text-sm line-clamp-1 break-all text-zinc-800 dark:text-zinc-200"
                            >
                                {{ i.name }}
                            </p>
                            <p
                                class="min-w-20 max-w-32 text-xs text-right line-clamp-1 break-all text-zinc-600 dark:text-zinc-400"
                            >
                                {{ i.shop }}
                            </p>
                        </Button>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
