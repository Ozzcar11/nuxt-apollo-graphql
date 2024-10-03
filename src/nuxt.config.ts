import { URL, fileURLToPath } from "node:url";
import { defineNuxtConfig } from "nuxt/config";
import svgLoader from "vite-svg-loader";
import GraphQLPlugin from "@rollup/plugin-graphql";

export default defineNuxtConfig({
  modules: [
    "@pinia/nuxt",
    "@nuxtjs/robots",
    "@nuxtjs/device",
    "@vueuse/nuxt",
  ],
  app: {
    head: {
      charset: "utf8",
      viewport: "width=device-width, initial-scale=1",
      script: [],
    },
  },
  alias: {
    "@": fileURLToPath(new URL("./", import.meta.url)),
  },
  build: {
    transpile: [
      "@wry/context",
      "@apollo/client",
      "@vue/apollo-composable",
      "ts-invariant/process",
      "tslib",
      "@vuepic/vue-datepicker",
    ],
  },
  components: false,
  css: [
    "@/assets/styles/main.scss",
    "@vuepic/vue-datepicker/dist/main.css",
  ],
  devServer: {
    host: "0.0.0.0",
    port: +(process.env.APP_PORT ?? 3000),
  },
  dir: {
    pages: "views",
    modules: "nuxt-modules",
  },
  imports: {
    autoImport: false,
    collectMeta: false,
    dirs: [],
    global: false,
  },
  nitro: {
    devProxy: {
      "/graphql": {
        target: `${process.env.VITE_APP_API_DOMAIN as string}/graphql`,
        changeOrigin: true,
        cookieDomainRewrite: "localhost",
      },
      "/sanctum": {
        target: `${process.env.VITE_APP_API_DOMAIN as string}/sanctum`,
        changeOrigin: true,
        cookieDomainRewrite: "localhost",
      },
    },
  },
  vite: {
    plugins: [
      svgLoader({
        defaultImport: "component",
      }),
      GraphQLPlugin(),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: "@import '@/assets/styles/global.scss';",
        },
      },
    },
  },
  runtimeConfig: {
    app: {
      API_DOMAIN: process.env.VITE_APP_API_DOMAIN,
      APP_PORT: process.env.APP_PORT ?? "5178",
    },
  },
  watch: [
    "models/**/*.ts",
    "router/**/*.ts",
    "types/**/*.ts",
  ],
  devtools: {
    enabled: false,
  },
  routeRules: {
    "/account/**": { ssr: false },
    "/application/**": { ssr: false },
    "/results/**": { ssr: false },
    "/partners/**": { ssr: false },
    "/auth/**": { ssr: false },
  },
});
