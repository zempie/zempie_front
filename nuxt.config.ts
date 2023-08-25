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
        { name: 'description', content: "Worldwide Community Platform for Game Creators." },
        { name: 'format-detection', content: 'telephone=no' }
      ],

      link: [
        { hid: 'icon', rel: 'icon', type: 'image/x-icon', href: '~/static/favicon.ico' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Two+Tone' },
        { rel: 'stylesheet', href: 'https://unicons.iconscout.com/release/v3.0.3/css/line.css' },
        { rel: "apple-touch-icon", href: 'https://s3.ap-northeast-2.amazonaws.com/zempie.com/icons/favicon-32x32.png' },
        { rel: "apple-touch-icon-precomposed", href: 'https://s3.ap-northeast-2.amazonaws.com/zempie.com/icons/favicon-32x32.png' },
      ],
      script: [
        {
          src: process.env.KAKAO_SDK
        },
        {
          children: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${process.env.TAG_MANAGER_ID}');`
        }
      ],


    },
  },
  hooks: {
    'pages:extend'(routes) {
      routes.push({
        name: 'community-channel',
        path: '/community/:id/:channel_name',
        file: resolve(__dirname, './pages/community/[id]/index.vue')
      })
    },
    'build:manifest': (manifest) => {
      // find the app entry, css list
      const css = manifest['node_modules/nuxt/dist/app/entry.js']?.css
      if (css) {
        // start from the end of the array and go to the beginning
        for (let i = css.length - 1; i >= 0; i--) {
          // if it starts with 'entry', remove it from the list
          if (css[i].startsWith('entry')) css.splice(i, 1)
        }
      }
    },
    'webpack:config': (config) => {
      console.log('config', config)

    }
  },
  generate: {
    fallback: '404.html'
  },
  router: {
    middleware: ['auth']
  },

  css: [
    '@/assets/css/jquery-ui.css',
    '@/assets/css/layout.css',
    '@/assets/css/style.css',
    '@/assets/css/fonts.css',
    'element-plus/dist/index.css',
    'swiper/css',
    'swiper/css/pagination',
  ],

  modules: [
    ['@nuxtjs/i18n', i18n],
    '@vueuse/nuxt',
    ['nuxt-compress', { gzip: { threshold: 8192 } }],
  ],
  nitro: {
    compressPublicAssets: true,
    minify: true
  },

  build: {
    extractCSS: true,
    filenames: {
      chunk: () => '[name].js'
    }
  },

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
    APPLE_TOUCH_ICON: process.env.APPLE_TOUCH_ICON,
    ANDROID_DOWNLOAD_LINK: process.env.ANDROID_DOWNLOAD_LINK,
    KAKAO_JS_KEY: process.env.KAKAO_JS_KEY,
    FACEBOOK_SHARE_URL: process.env.FACEBOOK_SHARE_URL,
    FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
    TWITTER_SHARE_URL: process.env.TWITTER_SHARE_URL,
    HOTJAR_ID: process.env.HOTJAR_ID,
    BOOTPAY_JS_KEY: process.env.BOOTPAY_JS_KEY,
    TAG_MANAGER_ID: process.env.TAG_MANAGER_ID,
    ZEMTOWN_URL: process.env.ZEMTOWN_URL,
    MOGERA_URL: process.env.MOGERA_URL

  },

})

