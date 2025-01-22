<script lang="ts" setup>
interface Porps {
    setups: SetupClient[];
    minColumns?: number;
    maxColumns?: number;
    ssrColumns?: number;
}
const props = withDefaults(defineProps<Porps>(), {
    minColumns: 2,
    maxColumns: 5,
    ssrColumns: 3,
});
</script>

<template>
    <MasonryWall
        :items="props.setups"
        :column-width="240"
        :gap="6"
        :min-columns="props.minColumns"
        :max-columns="props.maxColumns"
        :ssr-columns="props.ssrColumns"
    >
        <template #default="{ item }">
            <SetupsLink
                :aria-label="item.name"
                :image-size="{ width: 16, height: 9 }"
                :setup="item"
                class="mb-2"
            />
        </template>
    </MasonryWall>
</template>
