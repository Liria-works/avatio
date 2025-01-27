export const useSignOut = async () => {
    const supabase = await useSupabaseClient();
    await supabase.auth.signOut();
    navigateTo('/');
};

export const useLogin = async (
    email: string,
    password: string,
    token: string
) => {
    const supabase = useSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
        options: { captchaToken: token },
    });
    if (error) throw error;
};

export const useSignUp = async (
    email: string,
    password: string,
    token: string
) => {
    const supabase = await useSupabaseClient();

    const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: { captchaToken: token },
    });
    if (error) throw error;

    useAddToast('サインアップしました。');
};

export const useLoginWithTwitter = async () => {
    const supabase = await useSupabaseClient();

    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
    });

    if (error) {
        navigateTo('/login');
        useAddToast('ログインに失敗しました。');
    }
};
