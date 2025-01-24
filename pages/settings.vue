<script lang="ts" setup>
const client = await useSBClient();
const user = useSupabaseUser();
if (!user.value) showError('ログインしてください');

const { data } = await client
    .from('users')
    .select('name, avatar, bio, links')
    .eq('id', user.value.id)
    .maybeSingle();

const name = ref<string>(data?.name ?? '');
const bio = ref<string>(data?.bio ?? '');
const links = ref<string[]>(data?.links ?? []);

const save = async () => {
    await useSaveUsername(name.value);
    await useSaveBio(bio.value);
    await useSaveLink(links.value);
};

onMounted(() => {
    useOGP({
        title: 'ユーザー設定',
    });
});
</script>

<template>
    <div v-if="!data" class="w-full flex flex-col items-center">
        <p class="text-zinc-400 mt-5">ユーザーデータの取得に失敗しました</p>
    </div>

    <div v-else class="w-full px-2 flex flex-col gap-5">
        <div class="flex items-center justify-between">
            <UiTitle
                label="プロフィール"
                icon="lucide:user-round"
                size="lg"
                is="h1"
            />
            <ButtonBase label="保存" @click="save" />
        </div>
        <UserSettingName v-model="name" />
        <UserSettingAvatar :initial="data.avatar" />
        <UserSettingBio v-model="bio" />
        <UserSettingLinks v-model="links" />

        <UiTitle
            label="アカウント操作"
            icon="lucide:user-round"
            size="lg"
            is="h1"
            class="mt-5"
        />
        <UserSettingAccount />
    </div>
</template>
