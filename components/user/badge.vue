<script lang="ts" setup>
const props = withDefaults(
    defineProps<{
        developer?: boolean;
        contributor?: boolean;
        translator?: boolean;
        alphaTester?: boolean;
        shopOwner?: boolean;
    }>(),
    {
        developer: false,
        contributor: false,
        translator: false,
        alpha_tester: false,
        shop_owner: false,
    }
);
</script>

<template>
    <div class="flex gap-1.5 items-center mt-0.5">
        <UiTooltip v-if="props.developer" text="デベロッパー">
            <Icon name="lucide:code-xml" size="20" />
        </UiTooltip>

        <UiTooltip v-if="props.contributor" text="コントリビューター">
            <Icon name="lucide:handshake" size="17" />
        </UiTooltip>

        <UiTooltip v-if="props.translator" text="翻訳者">
            <Icon name="lucide:languages" size="19" />
        </UiTooltip>

        <UiTooltip v-if="props.alphaTester" text="アルファテスター">
            <Icon name="lucide:flask-conical" size="19" />
        </UiTooltip>

        <UiTooltip v-if="props.shopOwner" text="ショップオーナー">
            <Icon name="lucide:store" size="19" />
        </UiTooltip>
    </div>
</template>
