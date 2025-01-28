<script lang="ts" setup>
const client = useSupabaseClient();
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

const old = ref({
    name: data?.name ?? '',
    avatar: data?.avatar ?? null,
    bio: data?.bio ?? '',
    links: data?.links ?? [],
});

const name = ref<string>(old.value.name);
const avatar = ref<{ oldName: string | null; new: File | null }>({
    oldName: old.value.avatar,
    new: null,
});
const bio = ref<string>(old.value.bio);
const links = ref<string[]>(old.value.links);

const checkSame = () =>
    name.value === old.value.name &&
    bio.value === old.value.bio &&
    avatar.value.new === null &&
    links.value === old.value.links;

const save = async () => {
    if (name.value === '') return useAddToast('ユーザー名を入力してください');

    let avatarName = old.value.avatar;
    if (avatar.value.new) {
        const uploaded = await usePutImage(avatar.value.new, {
            prefix: 'avatar',
            resolution: 512,
            size: 300,
        });

        if (!uploaded)
            return useAddToast(
                'ユーザー情報の保存に失敗しました',
                'アバターのアップロードでエラーが発生しました'
            );

        if (old.value.avatar)
            await useDeleteImage(old.value.avatar, { prefix: 'avatar' });

        avatarName = uploaded.name;
    }

    const { error } = await client
        .from('users')
        .update({
            name: name.value,
            bio: bio.value,
            avatar: avatarName,
            links: links.value,
        })
        .eq('id', user.value.id);

    if (error) return useAddToast('ユーザー情報の保存に失敗しました');

    old.value = {
        name: name.value,
        avatar: avatarName,
        bio: bio.value,
        links: links.value,
    };
    userProfile.value.name = name.value;
    userProfile.value.avatar = avatarName
        ? useGetImage(avatarName, { prefix: 'avatar' })
        : null;
    return useAddToast('ユーザー情報を保存しました');
};

useOGP({
    title: 'ユーザー設定',
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
        <UserSettingAvatar v-model="avatar" />
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
