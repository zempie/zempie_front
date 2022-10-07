import { FetchOptions } from "ohmyfetch"
const DAYSTOSEC_30 = 60 * 60 * 24 * 30;

export const useCustomFetch = (url: string, options?: FetchOptions) => {

  const { $cookies, $firebaseAuth } = useNuxtApp()
  const config = useRuntimeConfig();
  return useFetch(url, {
    ...options,
    async onResponse({ request, response, options }) {
      // console.log('[fetch response]')

    },
    async onResponseError({ request, response, options }) {
      // console.log('[fetch response error]', response)
      const { status } = response
      switch (status) {
        case 401:
          // console.log('unauth')
          $firebaseAuth.currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken: string) {
            // console.log(idToken)
            $cookies.set(config.COOKIE_NAME, idToken, {
              maxAge: DAYSTOSEC_30,
              path: '/',
              domain: config.COOKIE_DOMAIN
            });
          })

          break;
        case 500:
          useUser().logout()
          break;

        default:
          break;
      }
    },

    async onRequest({ request, options }) {
      // console.log('[fetch request]')
    },
    async onRequestError({ request, options, error }) {
      // console.log('[fetch request error]')
    }
  })
}