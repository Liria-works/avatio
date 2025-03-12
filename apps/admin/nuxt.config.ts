// https://nuxt.com/docs/api/configuration/nuxt-config

let isDev: boolean = false;
try {
    isDev = process?.env?.NODE_ENV === 'development';
} catch {
    isDev = false;
}

export default defineNuxtConfig({
    devtools: { enabled: true, timeline: { enabled: true } },

    modules: ['@nuxt/ui', '@nuxt/eslint', '@nuxtjs/supabase', '@nuxt/image'],

    css: ['~/assets/css/main.css'],

    future: {
        compatibilityVersion: 4,
    },

    compatibilityDate: '2024-11-27',

    nitro: {
        preset: 'vercel',
    },

    devServer: {
        port: 3100,
    },

    runtimeConfig: {
        public: {
            password: '',
            r2: { domain: '' },
        },
        r2: { endpoint: '', accessKey: '', secretKey: '' },
    },

    fonts: { families: [{ name: 'Inter', provider: 'google' }] },

    icon: {
        customCollections: [{ prefix: 'avatio', dir: './app/assets/icons' }],
    },

    image: {
        domains: [
            'booth.pximg.net', // booth
            's2.booth.pm', // booth
            import.meta.env.NUXT_PUBLIC_R2_DOMAIN.replace('https://', ''), // R2
        ],
    },

    supabase: {
        url: import.meta.env.SUPABASE_URL,
        key: import.meta.env.SUPABASE_ANON_KEY,
        serviceKey: import.meta.env.SUPABASE_SERVICE_ROLE_KEY,
        types: './shared/types/database.d.ts',
        clientOptions: {
            auth: {
                flowType: 'pkce',
            },
        },
        cookieOptions: {
            domain: isDev ? 'localhost:3000' : '.avatio.me',
            sameSite: 'lax',
            secure: isDev ? false : true,
        },
    },
});
