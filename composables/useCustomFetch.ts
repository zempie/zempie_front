import { FetchOptions } from "ohmyfetch"
import dayjs from "dayjs";
const DAYSTOSEC_30 = 60 * 60 * 24 * 30;


export const useCustomFetch = async <T>(url: string, options?: FetchOptions) => {


  console.log('url', url)

  const config = useRuntimeConfig()
  const accessToken = useCookie(config.COOKIE_NAME).value
  if (accessToken) getRefreshToken()

  return await useFetch<T>(url, {
    initialCache: false,
    ...options,
    async onResponse({ request, response, options }) {

      useCommon().setLoadingDone()

      console.log('[fetch response]')

    },
    async onResponseError({ request, response, options }) {
      console.log('[fetch response error]', response)
      const { status } = response
      switch (status) {
        case 401:
          console.log('unauth')
          break;
        case 500:
          // useUser().logout()
          break;

        default:
          break;
      }
    },

    async onRequest({ request, options }) {
      options.headers = options.headers || {}

      if (accessToken) options.headers['Authorization'] = accessToken && `Bearer ${accessToken}`

      useCommon().setLoading()
      console.log('[fetch request]')
    },
    async onRequestError({ request, options, error }) {
      console.log('[fetch request error]')
    }
  })
}


export async function getRefreshToken() {
  const config = useRuntimeConfig();
  const { $cookies, $firebaseAuth } = useNuxtApp()

  //3분 빠르게 
  const expirationTime = dayjs(useUser().user.value?.fUser?.stsTokenManager?.expirationTime).subtract(3, 'minutes')

  console.log(dayjs(useUser().user.value?.fUser?.stsTokenManager?.expirationTime).format('YYYY-MM-DD HH:mm:ss'))

  if (expirationTime && dayjs().isSame(expirationTime) || dayjs().isAfter(expirationTime)) {
    const refreshToken = useUser().user.value?.fUser?.stsTokenManager?.refreshToken
    if (!refreshToken) return;
    let body = {
      'grant_type': 'refresh_token',
      'refresh_token': refreshToken,
    };

    let formBody = [];
    for (var property in body) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(body[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    const formBody2 = formBody.join("&");



    const result = await $fetch<{ access_token: string, expires_in: string, id_token: string, project_id: string, refresh_token: string, token_type: string, user_id: string }>(config.GOOGLE_REFRESH_TOKEN_URL, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formBody2
    })

    if (result) {
      $cookies.set(config.COOKIE_NAME, result.access_token, {
        maxAge: DAYSTOSEC_30,
        path: '/',
        domain: config.COOKIE_DOMAIN
      });
      $cookies.set(config.REFRESH_TOKEN, result.refresh_token, {
        maxAge: DAYSTOSEC_30,
        path: '/',
        domain: config.COOKIE_DOMAIN
      });
    }
  }
}