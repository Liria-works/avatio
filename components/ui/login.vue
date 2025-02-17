<script setup lang="ts">
const token = ref();

let env: string | undefined;
try {
    env = process?.env?.NODE_ENV;
} catch {
    env = 'production';
}
const mailAddressLogin = ref({ email: '', password: '' });
const handleLogin = async () => {
    try {
        await useLogin(
            mailAddressLogin.value.email,
            mailAddressLogin.value.password,
            token.value
        );
        navigateTo('/');
    } catch (error) {
        console.error(error);
    }
};
</script>

<template>
    <UiCard>
        <div class="min-w-80 flex flex-col gap-4 items-center">
            <div class="font-bold text-2xl my-4">ログイン</div>

            <Button
                :disabled="!token"
                variant="outline"
                label="X アカウントでログイン"
                icon="simple-icons:x"
                class="w-full"
                @click="useLoginWithTwitter"
            />

            <div
                v-if="env === 'development'"
                class="w-full flex flex-col gap-2"
            >
                <p>Development only</p>
                <UiTextinput v-model="mailAddressLogin.email" />
                <UiTextinput
                    v-model="mailAddressLogin.password"
                    type="password"
                />
                <Button
                    :disabled="!token"
                    variant="outline"
                    label="Mail address login"
                    icon="lucide:mail"
                    class="w-full"
                    @click="handleLogin"
                />
            </div>

            <NuxtTurnstile v-model="token" />
        </div>

        <template #footer>
            <div class="flex flex-col gap-2">
                <div class="self-center flex gap-1.5 items-center">
                    <Button to="/terms" variant="link"> 利用規約 </Button>
                    <Button to="/privacy-policy" variant="link">
                        プライバシーポリシー
                    </Button>
                </div>
                <PopupTwitterWarning />
            </div>
        </template>
    </UiCard>
</template>
