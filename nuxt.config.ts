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
    ],
    compatibilityDate: '2024-08-21',

    components: [
        {
            path: '~/components',
        },
    ],

    supabase: {
        url: import.meta.env.SUPABASE_URL,
        key: import.meta.env.SUPABASE_ANON_KEY,
        redirect: true,
        redirectOptions: {
            login: '/login',
            callback: '/confirm',
            include: ['/setup/edit'],
            exclude: [],
            cookieRedirect: false,
        },
    },

    image: {
        domains: [
            // "booth.pximg.net", // 何故かたまに読み込まないので一旦off
            import.meta.env.NUXT_PUBLIC_R2_DOMAIN.replace('https://', ''), // R2
        ],
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
        siteKey: '0x4AAAAAAA002QQW-WRng1Pr',
    },

    runtimeConfig: {
        public: {
            token: '',
            r2Domain: '',
        },
        turnstile: {
            secretKey: '',
        },
        r2: {
            endpoint: '',
            accessKey: '',
            secretKey: '',
        },
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
