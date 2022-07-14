
import { i18n } from './modules/i18n'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'zempie-nuxt',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  server: {
    port: 3010,
    host: 'localhost'

  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    "@/assets/css/animate.css",
    "@/assets/css/jquery-ui.css",
    "@/assets/css/fonts-jam.css",
    "@/assets/css/common.css",
    "@/assets/css/content.css",
    "@/assets/css/layout.css",
    "@/assets/css/style.css",
    "@/assets/css/fonts.css",
    "@/assets/css/common.scss",
    'vue-select/dist/vue-select.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/firebase',
    '~/plugins/vue-select'
  ],

  router: {              // customize nuxt.js router (vue-router).
    // middleware: 'i18n'   // middleware all pages of the application
  },

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    '@nuxtjs/composition-api/module',
    '@nuxtjs/dotenv',
    '@pinia/nuxt',

  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    ['@nuxtjs/i18n', i18n],

  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: process.env.BASE_API,
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
