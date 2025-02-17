<script lang="ts" setup>
const { items } = defineProps<{
    items: {
        avatar: SetupItem[];
        cloth: SetupItem[];
        accessory: SetupItem[];
        other: SetupItem[];
    };
}>();
</script>

<template>
    <div class="flex flex-col gap-3">
        <template v-if="items.avatar.length">
            <UiTitle
                label="ベースアバター"
                icon="lucide:person-standing"
                is="h2"
                class="mb-3"
            />
            <SetupsItem
                v-for="item in items.avatar"
                :key="useId()"
                size="lg"
                :item="item"
            />
        </template>

        <template v-if="items.cloth.length">
            <UiTitle label="衣装" icon="lucide:shirt" is="h2" class="mb-3" />
            <SetupsItem
                v-for="item in items.cloth"
                :key="useId()"
                size="md"
                :item="item"
            />
        </template>

        <template v-if="items.accessory.length">
            <UiTitle
                label="アクセサリー"
                icon="lucide:star"
                is="h2"
                class="mb-3"
            />
            <SetupsItem
                v-for="item in items.accessory"
                :key="useId()"
                size="md"
                :item="item"
            />
        </template>

        <template v-if="items.other.length">
            <UiTitle
                label="その他"
                icon="lucide:package"
                is="h2"
                class="mb-3"
            />
            <SetupsItem
                v-for="item in items.other"
                :key="useId()"
                size="md"
                :item="item"
            />
        </template>
    </div>
</template>
