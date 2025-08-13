// https://nuxt.com/docs/api/configuration/nuxt-config
import {resolve} from "path";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  alias: {
    '@': resolve(__dirname, './'),
    '@fonts': resolve(__dirname, 'assets/fonts'),
    '@icons': resolve(__dirname, 'assets/icons'),
    '@styles': resolve(__dirname, 'assets/styles'),
    '@components-buttons': resolve(__dirname, './app/components/buttons'),
    '@components-inputs': resolve(__dirname, './app/components/inputs'),
    '@components-layouts': resolve(__dirname, './app/components/layouts'),
    '@stores': resolve(__dirname, 'stores'),
    '@interfaces': resolve(__dirname, 'interfaces'),
  },
  components: [
    { path: '~/components/buttons', pathPrefix: true },
    { path: '~/components/inputs', pathPrefix: true },
    { path: '~/components/layout', pathPrefix: true },
  ],
  css: ['@/assets/styles/main.scss']
})
