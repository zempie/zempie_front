
export default defineNuxtRouteMiddleware((to, from) => {
  const config = useRuntimeConfig();
  const cookie = useCookie(config.COOKIE_NAME).value;

  if (!cookie) {
    return '/';
  }

})