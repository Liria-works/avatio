// @ts-check
import { defineConfig } from "astro/config";

import icon from "astro-icon";
import vercel from "@astrojs/vercel/serverless";
import UnoCSS from "unocss/astro";
import vue from "@astrojs/vue";

import { presetAttributify, presetUno } from "unocss";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
	output: "server",
	integrations: [
		UnoCSS({
			injectReset: true,
			presets: [presetAttributify(), presetUno()],
		}),
		icon(),
		vue({ appEntrypoint: "/src/pages/_app" }),
		tailwind({ applyBaseStyles: false }),
	],
	adapter: vercel(),
});
