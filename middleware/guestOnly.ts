
export default defineNuxtRouteMiddleware((to, from) => {
  const config = useRuntimeConfig();
  const cookie = useCookie(config.COOKIE_NAME).value;
  const info = useUser().user.value.info

  if (info?.id) {
    return '/';
  }

})