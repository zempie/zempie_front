import Hotjar from 'vue-hotjar'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  nuxtApp.vueApp.use(Hotjar, {
    id: config.HOTJAR_ID,
    snippetVersion: 6
  })

})
