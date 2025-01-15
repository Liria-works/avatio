<script lang="ts" setup>
const client = await useSBClient();
const user = useSupabaseUser();
if (!user.value) showError('ログインしてください');

const { data } = await client
    .from('users')
    .select('name, avatar, bio, links')
    .eq('id', user.value.id)
    .maybeSingle();

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
        <UserSettingName :initial="data.name" />
        <UserSettingAvatar :initial="data.avatar" />
        <UserSettingBio :initial="data.bio" />
        <UserSettingLinks :initial="data.links" />
        <UserSettingAccount />
    </div>
</template>
