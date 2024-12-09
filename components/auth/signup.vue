<script setup lang="ts">
const token = defineModel<string>({ default: '', required: true });

const { signupValidate, signupErrorMessages } = useSignupVaridate();
const signupError = ref<string>('');

const loading = ref(false);

const signUpAgree = ref(false);
const signUp = ref({ email: '', password: '' });

watch(signUp.value, () => {
    signupErrorMessages.value = null;
    signupError.value = '';
});

const handleSignUp = async () => {
    signupError.value = '';

    signupValidate({
        email: signUp.value.email,
        password: signUp.value.password,
    });

    if (signupErrorMessages.value) return;
    else {
        loading.value = true;
        try {
            await useSignUp(
                signUp.value.email,
                signUp.value.password,
                token.value
            );
            // emit('success');
            // navigateTo('/user/setting');
        } catch (error) {
            console.error(error);
        } finally {
            loading.value = false;
        }
    }
};
</script>

<template>
    <div class="flex flex-col gap-4 items-center">
        <div class="font-bold text-2xl mb-4">サインアップ</div>

        <UButton
            block
            variant="outline"
            icon="simple-icons:x"
            :ui="{
                rounded: 'rounded-xl',
                ring: 'ring-1 ring-gray-300 dark:ring-gray-600',
            }"
            class="h-10"
            :disabled="!signUpAgree || !token"
            @click="useLoginWithTwitter"
        >
            X アカウントでサインアップ
        </UButton>

        <UDivider label="OR" />

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
                </UInput>
            </UFormGroup>

            <UButton
                block
                type="submit"
                :disabled="loading || !signUpAgree || !token"
                variant="outline"
                :ui="{ rounded: 'rounded-xl' }"
                class="h-10"
            >
                {{ loading ? '処理中' : 'メールアドレスでサインアップ' }}
            </UButton>
        </UForm>

        <UDivider />

        <div class="flex flex-col gap-1">
            <UCheckbox
                v-model="signUpAgree"
                :ui="{ base: 'size-5' }"
                class="mb-4"
            >
                <template #label>
                    <p>
                        <NuxtLink
                            to="/terms"
                            target="_blank"
                            class="underline hover:text-neutral-400 hover:dark:text-neutral-400"
                        >
                            利用規約
                        </NuxtLink>
                        ・
                        <NuxtLink
                            to="/privacy-policy"
                            target="_blank"
                            class="underline hover:text-neutral-400 hover:dark:text-neutral-400"
                        >
                            プライバシーポリシー
                        </NuxtLink>
                        に同意
                    </p>
                </template>
            </UCheckbox>
        </div>
    </div>
</template>
