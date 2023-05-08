import Hotjar from 'vue-hotjar'

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.vueApp.use(Hotjar, {
    property: {
      id: '3482036'
    }
  })

})
