<script lang="ts" setup>
const client = await useSBClient();

const props = defineProps<{
    user: string;
}>();

const badges = ref();

onMounted(async () => {
    const { data } = await client
        .from("badges")
        .select("*")
        .eq("user_id", props.user)
        .maybeSingle();
    badges.value = data;
});
</script>

<template>
    <div class="flex gap-1.5 items-center mt-0.5">
        <UiTooltip v-if="badges?.developer" text="デベロッパー">
            <Icon name="lucide:code-xml" size="20" />
        </UiTooltip>

        <UiTooltip v-if="badges?.contributor" text="コントリビューター">
            <Icon name="lucide:handshake" size="17" />
        </UiTooltip>

        <UiTooltip v-if="badges?.translator" text="翻訳者">
            <Icon name="lucide:languages" size="19" />
        </UiTooltip>

        <UiTooltip v-if="badges?.alpha_tester" text="アルファテスター">
            <Icon name="lucide:flask-conical" size="19" />
        </UiTooltip>

        <UiTooltip v-if="badges?.shop_owner" text="ショップオーナー">
            <Icon name="lucide:store" size="19" />
        </UiTooltip>
    </div>
</template>
