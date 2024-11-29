<script lang="ts" setup>
const vis = defineModel<boolean>({
    default: false,
});

const emit = defineEmits(['accept', 'close']);

const status = ref<'idle' | 'loading' | 'error'>('idle');
const password = ref<string>('');

const deleteUser = async () => {
    status.value = 'loading';

    try {
        const res = await useAuthFetch('/api/user', {
            method: 'DELETE',
            body: JSON.stringify({ plainPassword: password.value }),
        });
        console.log(res);
        if (!res) throw new Error('Failed to delete user');

        navigateTo('/', { external: true });
    } catch (e: any) {
        console.error(e);
        status.value = 'error';
        if (e.statusCode === 401) {
            alert('パスワードが違います');
        }
    }
};
</script>

<template>
    <ModalBase v-model="vis">
        <template #header>
            <UiTitle label="アカウント削除" icon="lucide:circle-alert" />
        </template>

        <div v-if="status === 'idle'" class="gap-6 px-3 flex flex-col">
            <div class="gap-2 flex flex-col text-sm">
                <p>アカウントに関連するデータは、直ちにすべて削除されます。</p>
                <p>削除したアカウントおよびデータは復元できません。</p>
                <p class="text-xs text-neutral-400">
                    アカウント・データの復元に関するお問い合わせには、一切対応いたしません。
                </p>
            </div>

            <div class="gap-2 flex flex-col">
                <p class="text-sm">
                    続行するにはパスワードを入力してください。
                </p>
                <UInput
                    v-model="password"
                    type="password"
                    placeholder="パスワード"
                />
            </div>
        </div>

        <div v-else-if="status === 'loading'" class="gap-6 px-3 flex flex-col">
            <Icon name="svg-spinners:ring-resize" />
        </div>

        <div v-else-if="status === 'error'" class="gap-6 px-3 flex flex-col">
            <p class="text-sm">エラーにより処理が未了</p>
        </div>

        <template #footer>
            <div class="w-full flex gap-2 items-center justify-end">
                <UiButton
                    v-if="status === 'idle'"
                    :disabled="!password"
                    label="削除"
                    class="text-red-500 dark:text-red-400 hover:text-white hover:dark:text-white hover:bg-red-500 hover:dark:bg-red-800 hover:outline-red-400 hover:dark:outline-red-700"
                    @click="deleteUser"
                />
                <UiButton
                    v-if="status !== 'loading'"
                    label="キャンセル"
                    @click="
                        status = 'idle';
                        emit('close');
                    "
                />
            </div>
        </template>
    </ModalBase>
</template>
