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
        "@nuxtjs/color-mode",
        "@nuxtjs/supabase",
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

    image: {
        domains: [
            // "booth.pximg.net",
            import.meta.env.SUPABASE_URL.replace("https://", ""),
        ],
    },

    icon: {
        customCollections: [
            {
                prefix: "avatio",
                dir: "./public/icons/avatio",
            },
        ],
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

    // vite: {
    //     resolve: {
    //         alias: {
    //             util: "rollup-plugin-node-polyfills/polyfills/util",
    //             assert: "rollup-plugin-node-polyfills/polyfills/assert",
    //             os: "rollup-plugin-node-polyfills/polyfills/os",
    //             buffer: "rollup-plugin-node-polyfills/polyfills/buffer-es6",
    //             process: "rollup-plugin-node-polyfills/polyfills/process-es6",
    //             fs: "rollup-plugin-node-polyfills/polyfills/empty",
    //             net: "rollup-plugin-node-polyfills/polyfills/empty",
    //             perf_hooks: "rollup-plugin-node-polyfills/polyfills/empty",
    //             path: "rollup-plugin-node-polyfills/polyfills/path",
    //             child_process: "rollup-plugin-node-polyfills/polyfills/empty",
    //         },
    //     },
    // },
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
