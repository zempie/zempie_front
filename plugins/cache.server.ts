export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:rendered', ctx => {
    ctx.ssrContext?.event.res.setHeader('cache-control', `max-age=${60 * 60 * 24 * 365}`)
  })
})