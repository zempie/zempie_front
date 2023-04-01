
export default defineNuxtPlugin(() => {

  addRouteMiddleware('global-middleware', (to, from) => {

    //SEO Redirect : 기존의 사용하지 않는 url 
    switch (to.fullPath) {

      case '/gameList':
        useRouter().replace('/game/list')
        break;
      case '/communityList':
        useRouter().replace('/community/list')
        break;
      case '/channel/gameList':
        useRouter().replace('/game/list')
        break;
    }
  },
    { global: true }
  )
})

