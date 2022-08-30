
// export default defineNuxtPlugin(() => {
//   addRouteMiddleware('global-middleware', (to, from) => {
//     scrollBe

//   },
//     { global: true }
//   )
// })


export default function (to, from, savedPosition) {
  return { x: 0, y: 0 }
}