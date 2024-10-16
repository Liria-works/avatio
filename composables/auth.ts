import { z, ZodError } from "zod";

export const useLoginVaridate = () => {
    const loginErrorMessages = ref<ZodError | null>(null);

    const loginSchema = z.object({
        email: z.string().email("有効なメールアドレスを入力してください"),
        password: z.string().min(1, "パスワードを入力してください"),
    });

    const loginValidate = (data: z.TypeOf<typeof loginSchema>) => {
        try {
            loginSchema.parse(data);
            if (loginErrorMessages.value) {
                loginErrorMessages.value = null;
            }
        } catch (e) {
            if (e instanceof ZodError) {
                loginErrorMessages.value = e;
            }
        }
    };

    return {
        loginErrorMessages,
        loginValidate,
    };
};

export const useSignupVaridate = () => {
    const signupErrorMessages = ref<ZodError | null>(null);

    const signupSchema = z.object({
        email: z.string().email("有効なメールアドレスを入力してください"),
        password: z.string().min(1, "パスワードを入力してください"),
    });

    const signupValidate = (data: z.TypeOf<typeof signupSchema>) => {
        try {
            signupSchema.parse(data);
            if (signupErrorMessages.value) {
                signupErrorMessages.value = null;
            }
        } catch (e) {
            if (e instanceof ZodError) {
                signupErrorMessages.value = e;
            }
        }
    };

    return {
        signupErrorMessages,
        signupValidate,
    };
};

export const useSignOut = async () => {
    const supabase = await useSBClient();

    await supabase.auth.signOut();

    // const storeSetupIndex = useSetupIndex();
    // const { GetSetupIndex } = storeSetupIndex;
    // await GetSetupIndex();
    navigateTo("/", { external: true });
    // useAddToast("ログアウトしました。");
};

export const useLogin = async (email: string, password: string) => {
    const supabase = useSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });
    if (error) throw error;

    // useAddToast("ログインしました。");
    // const storeSetupIndex = useSetupIndex();
    // const { GetSetupIndex } = storeSetupIndex;
    // await GetSetupIndex();
};

export const useSignUp = async (email: string, password: string) => {
    const supabase = await useSBClient();

    const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
    });
    if (error) throw error;

    navigateTo("/user/setting");

    useAddToast("サインアップしました。");
};

export const useLoginWithTwitter = async () => {
    const supabase = await useSBClient();

    const { error } = await supabase.auth.signInWithOAuth({
        provider: "twitter",
    });

    if (error) {
        navigateTo("/login");
        useAddToast("ログインに失敗しました。");
    }
};
