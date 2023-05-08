import Hotjar from 'vue-hotjar'

export default defineNuxtPlugin((nuxtApp) => {
  console.log(Hotjar)
  nuxtApp.vueApp.use(Hotjar, {
    id: '3482036',
    snippetVersion: 6
  })

})
