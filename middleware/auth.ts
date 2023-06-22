
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { $localePath } = useNuxtApp()
  const isLogin = computed(() => useUser().user.value.isLogin)
  const isLoading = computed(() => useUser().user.value.isLoading)
  const isFlutter = computed(() => useMobile().mobile.value.isFlutter)


  if (to.path !== from.path && process.client) {
    window.scrollTo(0, 0)
  }

  if (!isLogin.value && !isLoading.value) {
    return navigateTo($localePath('/'))
  }

})
