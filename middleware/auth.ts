
export default defineNuxtRouteMiddleware((to, from) => {
  const { $localePath } = useNuxtApp()
  const isLogin = useUser().user.value.isLogin
  const isLoading = useUser().user.value.isLoading

  if (to.path !== from.path && process.client) {
    window.scrollTo(0, 0)
  }
  if (!isLogin && !isLoading) {
    return navigateTo($localePath('/'))
  }

})
