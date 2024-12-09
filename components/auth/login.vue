<script setup lang="ts">
const props = defineProps<{
    redirect?: string;
}>();

const token = defineModel<string>({ default: '', required: true });

const emit = defineEmits(['success']);

const { loginValidate, loginErrorMessages } = useLoginVaridate();
const loginError = ref<string>('');

const loading = ref(false);
const login = ref({ email: '', password: '' });

watch(login.value, () => {
    loginErrorMessages.value = null;
    loginError.value = '';
});

const handleLogin = async () => {
    loginError.value = '';

    loginValidate({
        email: login.value.email,
        password: login.value.password,
    });

    if (loginErrorMessages.value) return;
    else {
        loading.value = true;
        try {
            await useLogin(
                login.value.email,
                login.value.password,
                token.value
            );
            emit('success');
            navigateTo(props.redirect ?? '/');
        } catch (error) {
            console.error(error);
            loginError.value =
                'メールアドレスまたはパスワードが間違っているか、CAPTCHA認証に失敗しています';
        } finally {
            loading.value = false;
        }
    }
};
</script>

<template>
    <div class="flex flex-col gap-4 items-center">
        <div class="font-bold text-2xl mb-4">ログイン</div>

        <UButton
            :disabled="!token"
            block
            variant="outline"
            icon="simple-icons:x"
            :ui="{
                rounded: 'rounded-xl',
                ring: 'ring-1 ring-gray-300 dark:ring-gray-600',
            }"
            class="w-96 h-10"
            @click="useLoginWithTwitter"
        >
            X アカウントでログイン
        </UButton>

        <UDivider label="OR" />

        <UForm
            :state="login"
            class="w-96 flex flex-col gap-2"
            @submit="handleLogin"
        >
            <UFormGroup
                name="email"
                :error="
                    (loginErrorMessages &&
                        loginErrorMessages.flatten().fieldErrors.email
                            ?.length &&
                        loginErrorMessages
                            .flatten()
                            .fieldErrors.email?.toString()) ||
                    undefined
                "
            >
                <UInput
                    v-model="login.email"
                    id="email"
                    icon="lucide:mail"
                    placeholder="メールアドレス"
                    size="lg"
                    :ui="{ rounded: 'rounded-xl' }"
                />
            </UFormGroup>
            <UFormGroup
                name="password"
                :error="
                    (loginErrorMessages &&
                        loginErrorMessages.flatten().fieldErrors.password
                            ?.length &&
                        loginErrorMessages
                            .flatten()
                            .fieldErrors.password?.toString()) ||
                    undefined
                "
            >
                <UInput
                    v-model="login.password"
                    type="password"
                    id="password"
                    icon="lucide:key"
                    placeholder="パスワード"
                    size="lg"
                    :ui="{ rounded: 'rounded-xl' }"
                />
            </UFormGroup>

            <p class="empty:hidden text-sm text-red-400">
                {{ loginError }}
            </p>

            <UButton
                block
                type="submit"
                :disabled="loading || !token"
                variant="outline"
                :ui="{ rounded: 'rounded-xl' }"
                class="h-10"
            >
                {{ loading ? '処理中' : 'メールアドレスでログイン' }}
            </UButton>
        </UForm>
    </div>
</template>
