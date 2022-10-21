import { FetchOptions } from "ohmyfetch"
import dayjs from "dayjs";
const DAYSTOSEC_30 = 60 * 60 * 24 * 30;


export const useCustomFetch = <T>(url: string, options?: FetchOptions) => {

  getRefreshToken()

  return useFetch<T>(url, {
    ...options,
    async onResponse({ request, response, options }) {
      useCommon().setLoadingDone()

      console.log('[fetch response]', useCommon().loading.value)

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
      useCommon().setLoading()
      console.log('[fetch request]', useCommon().loading.value)
    },
    async onRequestError({ request, options, error }) {
      console.log('[fetch request error]')
    }
  })
}


export async function getRefreshToken() {
  const config = useRuntimeConfig();
  const { $cookies, $firebaseAuth } = useNuxtApp()

  const expirationTime = useUser().user.value?.fUser?.stsTokenManager?.expirationTime

  console.log(dayjs(expirationTime).format('YYYY-MM-DD HH:mm:ss'))

  if (expirationTime && dayjs().isSame(expirationTime) || dayjs().isAfter(expirationTime)) {
    const refreshToken = useUser().user.value?.fUser?.stsTokenManager?.refreshToken
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


    const { data, error } = await useFetch<{ access_token: string, expires_in: string, id_token: string, project_id: string, refresh_token: string, token_type: string, user_id: string }>(config.GOOGLE_REFRESH_TOKEN_URL, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formBody2
    })
    if (data.value) {
      $cookies.set(config.COOKIE_NAME, data.value.access_token, {
        maxAge: DAYSTOSEC_30,
        path: '/',
        domain: config.COOKIE_DOMAIN
      });
      $cookies.set(config.REFRESH_TOKEN, data.value.refresh_token, {
        maxAge: DAYSTOSEC_30,
        path: '/',
        domain: config.COOKIE_DOMAIN
      });
    }
  }
}