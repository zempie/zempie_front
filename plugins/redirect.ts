export default defineNuxtPlugin((nuxtApp) => {
  /**
   * global middleware 
   * /en redirect
   */
  addRouteMiddleware('global-middleware', (to) => {
    if( to.path.substring(0,3) === '/en'){       
    return  navigateTo(`/${to.path.substring(4)}`)
  }
  }, { global: true })
})

