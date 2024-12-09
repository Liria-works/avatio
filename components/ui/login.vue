<script setup lang="ts">
const props = defineProps<{
    redirect?: string;
}>();

const emit = defineEmits(['loginSuccess']);

const token = ref();
const mode_login = ref(true);
</script>

<template>
    <UCard>
        <AuthLogin
            v-if="mode_login"
            v-model="token"
            :redirect="props.redirect"
            @success="emit('loginSuccess')"
        />

        <AuthSignup v-else v-model="token" />

        <NuxtTurnstile v-model="token" />

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
                        mode_login ? 'サインアップはこちら' : 'ログインはこちら'
                    }}
                </UButton>
            </div>
        </template>
    </UCard>
</template>
