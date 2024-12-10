<script lang="ts" setup>
const props = withDefaults(
    defineProps<{
        label: string;
        thumbnail: string;
    }>(),
    {
        label: 'アイテム',
        thumbnail: '',
    }
);
</script>

<template>
    <ItemBase>
        <template #thumbnail>
            <NuxtImg
                v-if="props.thumbnail.length"
                :src="props.thumbnail"
                :alt="props.label"
                loading="lazy"
                class="size-10 p-0.5 rounded-lg object-cover"
            />
        </template>
        <template #main>
            <p class="text-sm px-2.5">{{ props.label }}</p>
        </template>
    </ItemBase>
</template>
