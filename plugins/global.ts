


export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.hooks.hook('page:start', () => {
    useRender().startLoad()

  })
  nuxtApp.hooks.hook('page:finish', () => {
    window.scrollTo(0, 0)
    useRender().finishLoad()
  })

})