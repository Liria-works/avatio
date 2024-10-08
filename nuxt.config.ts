// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    // ssr: false,

    routeRules: {
        "/": { swr: true },
        "/setup": { swr: true },
    },

    devtools: {
        enabled: true,

        timeline: {
            enabled: true,
        },
    },
    modules: [
        "@nuxt/ui",
        "@vueuse/nuxt",
        "@nuxt/image",
        "@nuxt/fonts",
        "@nuxt/scripts",
        "@formkit/auto-animate",
        "@nuxtjs/color-mode",
        "@nuxtjs/supabase",
        "@nuxtjs/ngrok",
        "@nuxt/eslint",
        "@pinia/nuxt",
    ],
    compatibilityDate: "2024-08-21",

    components: [
        {
            path: "~/components",
        },
    ],

    supabase: {
        redirect: true,
        redirectOptions: {
            login: "/login",
            callback: "/confirm",
            include: ["/setup/edit"],
            exclude: [],
            cookieRedirect: false,
        },
    },

    icon: {
        customCollections: [
            {
                prefix: "avatio",
                dir: "./public/icons/avatio",
            },
        ],
    },

    ngrok: {
        authtoken: process.env.NGROK_AUTHTOKEN,
    },

    runtimeConfig: {
        public: {
            token: "",
            edgeConfig: "",
        },
    },

    nitro: {
        preset: "vercel",
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
