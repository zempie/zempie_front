import routerOption from '../app/router.option'

export default defineNuxtPlugin(() => {

  addRouteMiddleware('global-middleware', (to, from) => {
    routerOption.scrollBehavior(to, from, null)
  },
    { global: true }
  )
})

