<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        redirect?: string;
    }>(),
    {
        redirect: "/",
    }
);

const emit = defineEmits(["success"]);

const { loginValidate, loginErrorMessages } = useLoginVaridate();
const { signupValidate, signupErrorMessages } = useSignupVaridate();
const loginError = ref<string>("");
const signupError = ref<string>("");

const mode_login = ref(true);
const loading = ref(false);

const login = ref({
    email: "",
    password: "",
});

const signUp = ref({
    email: "",
    password: "",
});

watch(login.value, () => {
    loginErrorMessages.value = null;
    loginError.value = "";
});

watch(signUp.value, () => {
    signupErrorMessages.value = null;
    signupError.value = "";
});

const handleLogin = async () => {
    loginError.value = "";

    loginValidate({
        email: login.value.email,
        password: login.value.password,
    });

    if (loginErrorMessages.value) {
        return;
    } else {
        try {
            loading.value = true;
            await useLogin(login.value.email, login.value.password);
            emit("success");
            navigateTo(props.redirect, { external: true });
        } catch (error) {
            console.error(error);
            loginError.value = "メールアドレスまたはパスワードが間違っています";
        } finally {
            loading.value = false;
        }
    }
};

const handleSignUp = async () => {
    signupError.value = "";

    signupValidate({
        email: signUp.value.email,
        password: signUp.value.password,
    });

    if (signupErrorMessages.value) {
        return;
    } else {
        try {
            loading.value = true;
            await useSignUp(signUp.value.email, signUp.value.password);
            emit("success");
            navigateTo(props.redirect);
        } catch (error) {
            alert(error);
        } finally {
            loading.value = false;
        }
    }
};
</script>

<template>
    <UCard>
        <div v-if="mode_login" class="flex flex-col gap-4 items-center">
            <div class="font-bold text-2xl">ログイン</div>

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
                    :disabled="loading"
                    variant="outline"
                    :ui="{ rounded: 'rounded-xl' }"
                    class="h-10"
                >
                    {{ loading ? "処理中" : "メールアドレスでログイン" }}
                </UButton>
            </UForm>

            <UDivider label="OR" />

            <UButton
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
                Login with X
            </UButton>
        </div>

        <div v-if="!mode_login" class="flex flex-col gap-4 items-center">
            <div class="font-bold text-2xl">サインアップ</div>

            <UForm
                :state="signUp"
                class="w-96 flex flex-col gap-2"
                @submit="handleSignUp"
            >
                <UFormGroup
                    name="email"
                    :error="
                        (signupErrorMessages &&
                            signupErrorMessages.flatten().fieldErrors.email
                                ?.length &&
                            signupErrorMessages
                                .flatten()
                                .fieldErrors.email?.toString()) ||
                        undefined
                    "
                >
                    <UInput
                        v-model="signUp.email"
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
                        (signupErrorMessages &&
                            signupErrorMessages.flatten().fieldErrors.password
                                ?.length &&
                            signupErrorMessages
                                .flatten()
                                .fieldErrors.password?.toString()) ||
                        undefined
                    "
                >
                    <UInput
                        v-model="signUp.password"
                        type="password"
                        id="password"
                        icon="lucide:key"
                        placeholder="パスワード"
                        size="lg"
                        :ui="{
                            rounded: 'rounded-xl',
                            icon: { trailing: { pointer: '' } },
                        }"
                    >
                        <template #trailing>
                            <UPopover
                                mode="hover"
                                :ui="{
                                    rounded: 'rounded-xl',
                                    ring: 'ring-1 ring-gray-300 dark:ring-gray-600',
                                }"
                                class="flex"
                            >
                                <Icon
                                    name="lucide:info"
                                    class="text-neutral-300"
                                />

                                <template #panel>
                                    <div
                                        class="flex flex-col gap-2 text-sm p-4 rounded-lg"
                                    >
                                        <p>
                                            プライベートアルファでは弱い強度のパスワードでも登録ができますが、<br />
                                            パブリックベータ以降では仕様が変更されます。
                                        </p>
                                        <p>
                                            認証方法についてアイデアをお持ちであれば、<br />
                                            フィードバックをお送りください。
                                        </p>
                                    </div>
                                </template>
                            </UPopover>
                        </template>
                    </UInput>
                </UFormGroup>

                <UButton
                    block
                    type="submit"
                    :disabled="loading"
                    variant="outline"
                    :ui="{ rounded: 'rounded-xl' }"
                    class="h-10"
                >
                    {{ loading ? "処理中" : "メールアドレスでサインアップ" }}
                </UButton>
            </UForm>

            <UDivider label="OR" />

            <UButton
                block
                variant="outline"
                icon="simple-icons:x"
                :ui="{
                    rounded: 'rounded-xl',
                    ring: 'ring-1 ring-gray-300 dark:ring-gray-600',
                }"
                class="h-10"
                @click="useLoginWithTwitter"
            >
                Sign up with X
            </UButton>
        </div>

        <template #footer>
            <div class="w-full flex items-center justify-center gap-8">
                <UiTooltip v-if="mode_login" text="準備中">
                    <UButton disabled variant="link" :padded="false">
                        パスワードを忘れた場合
                    </UButton>
                </UiTooltip>
                <UButton
                    variant="link"
                    :padded="false"
                    @click="mode_login = !mode_login"
                >
                    {{
                        mode_login ? "サインアップはこちら" : "ログインはこちら"
                    }}
                </UButton>
            </div>
        </template>
    </UCard>
</template>
