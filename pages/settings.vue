<script lang="ts" setup>
const client = await useSBClient();
const client = await useSupabaseClient();
const user = useSupabaseUser();
if (!user.value) showError('ログインしてください');

const { data } = await client
    .from('users')
    .select('name, avatar, bio, links')
    .eq('id', user.value.id)
    .maybeSingle<{
        name: string;
        avatar: string;
        bio: string;
        links: string[];
    }>();
console.log(data);

const name = ref<string>(data?.name ?? '');
const avatar = ref<string>(data?.avatar ?? '');
const bio = ref<string>(data?.bio ?? '');
const links = ref<string[]>(data?.links ?? []);

const checkSame = () =>
    name.value === data?.name &&
    bio.value === data?.bio &&
    links.value === data?.links;

const save = async () => {
    if (name.value === '') return useAddToast('ユーザー名を入力してください');

    const { error } = await client
        .from('users')
        .update({
            name: name.value,
            bio: useLineBreak(bio.value),
            links: links,
        })
        .eq('id', user.value.id);

    if (error) return useAddToast('ユーザー情報の保存に失敗しました');
};

onMounted(() => {
    useOGP({
        title: 'ユーザー設定',
    });
    console.log({
        name: name.value,
        avatar: avatar.value,
        bio: bio.value,
        links: links.value,
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
            <ButtonBase :disabled="checkSame()" label="保存" @click="save" />
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
