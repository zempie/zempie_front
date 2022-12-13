
export default defineNuxtRouteMiddleware((to, from) => {
  const config = useRuntimeConfig();
  const { $localePath } = useNuxtApp()
  const cookie = useCookie(config.COOKIE_NAME).value;
  const isLogin = useUser().user.value.isLogin


  if (to.path !== from.path && process.client) {
    window.scrollTo(0, 0)
  }
  if (!cookie) {
    console.log('useState', useState('user').value)
    console.log('middle: ', cookie)
    console.log('user', useUser().user.value.info)
    if (!isLogin) return $localePath('/')
    // return '/';
  }

})