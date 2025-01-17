<script lang="ts" setup>
interface Props {
    initial: string;
}
const props = defineProps<Props>();
const avatar = ref<string>(props.initial);

const client = await useSBClient();
const user = useSupabaseUser();

const loading = ref(false);

const changeAvatar = async () => {
    const { open, onChange } = useFileDialog({
        accept: 'image/png, image/jpeg, image/webp, image/avif, image/gif, image/svg, image/tiff',
        multiple: false,
    });

    const faild = () => {
        useAddToast(
            'アバターの変更に失敗しました',
            '画像の形式が非対応の可能性があります。'
        );
        loading.value = false;
    };

    open();
    onChange(async (files) => {
        if (!files || files.length === 0) throw new Error('No files selected');
        const file = files[0];

        loading.value = true;

        const uploaded = await usePutImage(file, {
            res: 512,
            size: 300,
            prefix: 'avatar',
        });
        if (!uploaded) return faild();

        const { data: legacy } = await client
            .from('users')
            .select('avatar')
            .eq('id', user.value.id)
            .maybeSingle();

        const { error } = await client
            .from('users')
            .update({ avatar: uploaded.name } as never)
            .eq('id', user.value.id);
        if (error) return faild();

        if (legacy) await useDeleteImage(legacy.avatar, { prefix: 'avatar' });

        useAddToast('アバターを変更しました');
        avatar.value = uploaded.name;
        loading.value = false;
    });
};
</script>

<template>
    <UiCard :divider="false" content-class="pb-4">
        <template #header>
            <UiTitle label="アバター" icon="lucide:smile" is="h2" />
        </template>

        <div
            v-if="loading"
            class="flex items-center justify-center size-20 rounded-full flex-shrink-0 bg-zinc-200 dark:bg-zinc-500 relative"
        >
            <Icon
                name="svg-spinners:ring-resize"
                size="36"
                class="text-zinc-600 dark:text-zinc-300"
            />
        </div>

        <div
            v-else-if="avatar && avatar.length"
            class="flex items-center justify-center size-20 rounded-full flex-shrink-0 bg-zinc-200 dark:bg-zinc-500 relative"
        >
            <UiAvatar
                :url="
                    avatar
                        ? useGetImage(avatar, {
                              prefix: 'avatar',
                          })
                        : ''
                "
                alt="User avatar"
                :icon-size="36"
                class="size-20"
            />
            <button
                type="button"
                class="absolute inset-0 hover:bg-black/20 rounded-full"
                @click="changeAvatar"
            />
        </div>

        <div
            v-else
            class="flex items-center justify-center size-20 rounded-full flex-shrink-0 bg-zinc-200 dark:bg-zinc-500 relative"
        >
            <Icon
                name="lucide:user-round"
                size="36"
                class="text-zinc-600 dark:text-zinc-300"
            />
            <button
                type="button"
                class="absolute inset-0 hover:bg-black/20 rounded-full"
                @click="changeAvatar"
            />
        </div>
    </UiCard>
</template>
