<script lang="ts" setup>
const props = withDefaults(
    defineProps<{
        user: string;
        size?: "md" | "sm";
    }>(),
    {
        user: "",
        size: "md",
    }
);
const userData = ref<{
    name: string;
    avatar: string;
    bio: string;
    links: string[];
    create_at: string;
}>();

onMounted(async () => {
    const client = await useSBClient();

    const { data } = await client
        .from("users")
        .select("name, avatar, bio, links, created_at")
        .eq("id", props.user)
        .single();

    if (!data) {
        return;
    }

    userData.value = {
        name: data.name,
        avatar: data.avatar,
        bio: data.bio,
        links: data.links,
        create_at: data.created_at,
    };

    if (data.avatar) {
        const storedAvatar = sessionStorage.getItem(props.user);

        if (storedAvatar) {
            userData.value.avatar = storedAvatar;
            return;
        } else {
            userData.value.avatar = await client.storage
                .from("images")
                .getPublicUrl(data.avatar).data.publicUrl;

            sessionStorage.setItem(props.user, userData.value.avatar);
        }
    }
});
</script>

<template>
    <div v-if="size === 'md'" class="flex flex-row items-center justify-between pt-1 w-full">
        <NuxtLink :to="{ name: 'user-id', params: { id: props.user } }" class="flex flex-row gap-3 items-center">
            <UAvatar :src="userData?.avatar" alt="Avatar" />
            <p class="text-black dark:text-white pb-0.5 text-left font-normal">
                {{ userData?.name }}
            </p>
        </NuxtLink>
    </div>

    <UiTooltip v-else-if="size === 'sm'" :text="userData?.name">
        <NuxtLink :to="{ name: 'user-id', params: { id: props.user } }" class="flex flex-row gap-2 items-center">
            <UAvatar v-if="userData?.avatar" size="xs" :src="userData?.avatar" :alt="userData?.name" />
            <div v-else
                class="flex items-center justify-center size-[25px] rounded-full flex-shrink-0 bg-neutral-200 dark:bg-neutral-500">
                <Icon name="lucide:user-round" size="14" class="text-neutral-600 dark:text-neutral-300" />
            </div>
        </NuxtLink>
    </UiTooltip>
</template>
