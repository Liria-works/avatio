// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        head: {
            htmlAttrs: {
                lang: 'ja',
                prefix: 'og: https://ogp.me/ns#',
            },
            title: 'Avatio',
            meta: [
                { charset: 'utf-8' },
                {
                    name: 'viewport',
                    content: 'width=device-width, initial-scale=1',
                },
                {
                    hid: 'description',
                    name: 'description',
                    content: 'アバターセットアップ共有サービス',
                },
                {
                    hid: 'icon',
                    name: 'icon',
                    content: '/favicon.ico',
                },
                {
                    hid: 'og:site_name',
                    property: 'og:site_name',
                    content: 'Avatio',
                },
                { hid: 'og:type', property: 'og:type', content: 'website' },
                {
                    hid: 'og:url',
                    property: 'og:url',
                    content: 'https://avatio.me',
                },
                {
                    hid: 'og:title',
                    property: 'og:title',
                    content: 'Avatio',
                },
                {
                    hid: 'og:description',
                    property: 'og:description',
                    content: 'アバターセットアップ共有サービス',
                },
                { hid: 'og:image', property: 'og:image', content: '/ogp.png' },
                { name: 'twitter:card', content: 'summary_large_image' },
            ],
        },
    },

    routeRules: {
        '/': { isr: true },
        '/faq': { prerender: true },
        '/terms': { prerender: true },
        '/privacy-policy': { prerender: true },
    },

    nitro: {
        preset: 'vercel',
    },

    devtools: {
        enabled: true,

        timeline: {
            enabled: true,
        },
    },
    modules: [
        '@nuxt/ui',
        '@vueuse/nuxt',
        '@nuxt/image',
        '@nuxt/fonts',
        '@nuxtjs/color-mode',
        '@nuxtjs/supabase',
        '@nuxt/eslint',
        '@nuxt/scripts',
        '@nuxtjs/turnstile',
        '@nuxtjs/robots',
    ],
    compatibilityDate: '2024-08-21',

    supabase: {
        url: import.meta.env.SUPABASE_URL,
        key: import.meta.env.SUPABASE_ANON_KEY,
        serviceKey: import.meta.env.SUPABASE_SERVICE_ROLE_KEY,
        redirect: true,
        redirectOptions: {
            login: '/login',
            callback: '/confirm',
            include: ['/setup/edit', '/user/settings', '/user/bookmark'],
            exclude: [],
            cookieRedirect: false,
        },
    },

    image: {
        domains: [
            'booth.pximg.net', // booth
            import.meta.env.NUXT_PUBLIC_R2_DOMAIN.replace('https://', ''), // R2
        ],
        presets: {
            thumbnail: {
                modifiers: {
                    format: 'webp',
                    sizes: '300px',
                    quality: 85,
                    loading: 'lazy',
                    fit: 'cover',
                },
            },
            avatarThumbnail: {
                modifiers: {
                    format: 'webp',
                    sizes: '80px',
                    quality: 80,
                    loading: 'lazy',
                    fit: 'cover',
                },
            },
        },
    },

    fonts: {
        families: [{ name: 'Murecho', provider: 'google' }],
    },

    icon: {
        customCollections: [
            {
                prefix: 'avatio',
                dir: './public/icons/avatio',
            },
        ],

        clientBundle: {
            icons: [
                'lucide:search',
                'lucide:settings',
                'lucide:plus',
                'lucide:x',
                'lucide:check',
                'svg-spinners:ring-resize',
            ],
            scan: true,
            includeCustomCollections: true,
        },
    },

    turnstile: {
        siteKey: import.meta.env.NUXT_TURNSTILE_SITE_KEY,
    },

    robots: {
        allow: ['Twitterbot', 'facebookexternalhit'],
        blockNonSeoBots: true,
        blockAiBots: true,
    },

    runtimeConfig: {
        public: {
            token: '',
            r2: { domain: '' },
        },
        turnstile: {
            siteKey: '',
            secretKey: '',
        },
        r2: {
            endpoint: '',
            accessKey: '',
            secretKey: '',
        },
        token: '',
    },
});

//
//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//
//
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
//               佛祖保佑         永无BUG
//
