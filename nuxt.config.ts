import { i18n } from './modules/i18n'
import { resolve } from 'pathe'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        {
          property: 'og:site_name',
          content: 'Zempie'
        },
        {
          name: 'og:type',
          content: 'website',
        },
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no, maximum-scale=1' },
        { hid: 'description', name: 'description', content: "Worldwide Community Platform for Game Creators." },
        { name: 'format-detection', content: 'telephone=no' }
      ],

      link: [
        { hid: 'icon', rel: 'icon', type: 'image/x-icon', href: '~/static/favicon.ico' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' },
        { rel: 'stylesheet', href: 'https://unicons.iconscout.com/release/v3.0.3/css/line.css' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0' },
        { rel: "apple-touch-icon", type: 'image/png', href: process.env.APPLE_TOUCH_ICON },
        { rel: "apple-touch-icon-precomposed", type: 'image/png', href: process.env.APPLE_TOUCH_ICON },
      ],

    }
  },
  // experimental: {
  //   writeEarlyHints: false,
  // },

  hooks: {
    'pages:extend'(routes) {
      routes.push({
        name: 'community-channel',
        path: '/community/:id/:channel_name',
        file: resolve(__dirname, './pages/community/[id]/index.vue')
      })
    }
  },

  build: {
    html: {
      minify: {
        collapseBooleanAttributes: true,
        decodeEntities: true,
        minifyCSS: true,
        minifyJS: true,
        processConditionalComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        trimCustomFragments: true,
        useShortDoctype: true,
      }
    }
  },

  generate: {
    fallback: '404.html'
  },
  router: {
    middleware: ['auth']
  },
  css: [
    '@/assets/css/animate.css',
    '@/assets/css/jquery-ui.css',
    '@/assets/css/fonts-jam.css',
    // '@/assets/css/common.css',
    // '@/assets/css/content.css',
    '@/assets/css/layout.css',
    '@/assets/css/style.css',
    '@/assets/css/fonts.css',
    // '@/assets/css/common.scss',
    // '@/assets/css/editor.scss',
    'element-plus/dist/index.css',
    'swiper/css',
    'swiper/css/pagination',
    // '@/assets/css/prism.css'
  ],


  modules: [
    'cookie-universal-nuxt',
    ['@nuxtjs/i18n', i18n],
    '@vueuse/nuxt',

  ],

  publicRuntimeConfig: {
    ENV: process.env.ENV,
    COOKIE_NAME: process.env.COOKIE_NAME,
    SUPPORT_EMAIL: process.env.SUPPORT_EMAIL,
    FTR_PAGE_URL: process.env.FTR_PAGE_URL,
    ZEMPIE_INSTA_URL: process.env.ZEMPIE_INSTA_URL,
    ZEMPIE_YOUTUBE_URL: process.env.ZEMPIE_YOUTUBE_URL,
    ZEMPIE_FACEBOOK_URL: process.env.ZEMPIE_FACEBOOK_URL,
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
    BASE_API: process.env.BASE_API,
    COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
    COMMUNITY_API: process.env.COMMUNITY_API,
    STUDIO_API: process.env.STUDIO_API,
    ZEMPIE_URL: process.env.ZEMPIE_URL,
    LAUNCHER_URL: process.env.LAUNCHER_URL,
    GA_TAG: process.env.GA_TAG,
    GOOGLE_REFRESH_TOKEN_URL: process.env.GOOGLE_REFRESH_TOKEN_URL,
    REFRESH_TOKEN: process.env.REFRESH_TOKEN_COOKIE,
    GAME_JAM_PLUS: process.env.GAME_JAM_PLUS,
    fCM_KEY: process.env.FCM_KEY,
    ZEMPIE_METAVERSE: process.env.ZEMPIE_METAVERSE,
    OG_IMG: process.env.OG_IMG,
    APPLE_TOUCH_ICON: process.env.APPLE_TOUCH_ICON
  },

})

