
export default defineNuxtPlugin(() => {

  addRouteMiddleware('global-middleware', (to, from) => {
    if (process.client) {
      window.scrollTo(0, 0);
    }
  },
    { global: true }
  )
})

