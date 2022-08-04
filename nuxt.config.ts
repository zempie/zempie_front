import { defineNuxtConfig } from 'nuxt'


import { i18n } from './modules/i18n'
// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({   
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
 
  router: {    
          // https://router.vuejs.org/api/#routeroptions
      options:{},
      middleware:['auth']
    },
  buildDir:'../nuxt_webserver/public',
  css: [
      '@/assets/css/animate.css',
      '@/assets/css/jquery-ui.css',
      '@/assets/css/fonts-jam.css',
      '@/assets/css/common.css',
      '@/assets/css/content.css',
      '@/assets/css/layout.css',
      '@/assets/css/style.css',
      '@/assets/css/fonts.css',
      '@/assets/css/common.scss',
      'element-plus/dist/index.css'
    ],
  

  modules: [
    'cookie-universal-nuxt',
    ['@nuxtjs/i18n',i18n],
  ],
  
   
  publicRuntimeConfig: {
    ENV:process.env.ENV,
    COOKIE_NAME:process.env.COOKIE_NAME,
    SUPPORT_EMAIL: process.env.SUPPORT_EMAIL,
    FTR_PAGE_URL: process.env.FTR_PAGE_URL,
    ZEMPIE_INSTA_URL:process.env.ZEMPIE_INSTA_URL,
    ZEMPIE_YOUTUBE_URL:process.env.ZEMPIE_YOUTUBE_URL,
    ZEMPIE_FACEBOOK_URL:process.env.ZEMPIE_FACEBOOK_URL,
    FIREBASE_API_KEY:process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN:process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID:process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET:process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID:process.env.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID:process.env.FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID:process.env.FIREBASE_MEASUREMENT_ID,
    BASE_API:process.env.BASE_API,
    COOKIE_DOMAIN:process.env.COOKIE_DOMAIN,
    COMMUNITY_API:process.env.COMMUNITY_API,
    STUDIO_API:process.env.STUDIO_API,
},

})


// @import "https://unicons.iconscout.com/release/v3.0.3/css/line.css";
// @import "https://unicons.iconscout.com/release/v3.0.3/css/solid.css";
// @import "https://cdn.jsdelivr.net/npm/xeicon@2.3.3/xeicon.min.css";