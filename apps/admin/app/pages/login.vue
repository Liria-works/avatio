<script lang="ts" setup>
// import * as z from 'zod';
// import type { FormSubmitEvent } from '@nuxt/ui';

const user = useSupabaseUser();
console.log(user.value);
if (user.value) navigateTo('/');

// const schema = z.object({
//     password: z.string(),
// });

// type Schema = z.output<typeof schema>;

// const state = reactive<Partial<Schema>>({
//     password: undefined,
// });

// const toast = useToast();
// const onSubmit = async (event: FormSubmitEvent<Schema>) => {
//     toast.add({
//         title: 'Success',
//         description: 'The form has been submitted.',
//         color: 'success',
//     });
//     console.log(event.data);
// };

const useLoginWithTwitter = async () => {
    const supabase = useSupabaseClient();

    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: {
            redirectTo: 'http://localhost:3000',
        },
    });

    if (error) {
        useToast().add({
            title: 'Login Error',
            description: error.message,
            color: 'error',
        });
        return;
    }

    useToast().add({
        title: 'Logged in',
        description: 'Successfully logged in with Twitter.',
        color: 'success',
    });
    navigateTo('/');
    return;
};
</script>

<template>
    <div class="h-screen flex flex-col items-center justify-center gap-8">
        <Icon name="avatio:avatio" size="48" />
        <!-- <UForm
            :schema="schema"
            :state="state"
            class="min-w-sm flex flex-col gap-y-8 items-center"
            @submit="onSubmit"
        >
            <Icon name="avatio:avatio" size="48" />

            <div class="w-full flex items-start gap-1">
                <UFormField name="password" class="w-full">
                    <UInput
                        v-model="state.password"
                        type="password"
                        class="w-full"
                    />
                </UFormField>
                <UButton type="submit" icon="lucide:arrow-right" />
            </div>
        </UForm> -->

        <UButton
            icon="simple-icons:x"
            variant="soft"
            @click="useLoginWithTwitter"
        />
    </div>
</template>
