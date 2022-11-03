import { FetchOptions } from "ohmyfetch"
import dayjs from "dayjs";
import { IUser } from "~~/types";
const DAYSTOSEC_30 = 60 * 60 * 24 * 30;


export const useCustomFetch = async <T>(url: string, options?: FetchOptions) => {

  colorLog(`start fetcch:  ${url}`, 'success')

  const config = useRuntimeConfig()
  const accessToken = useCookie(config.COOKIE_NAME).value
  let result = null;

  if (accessToken) {
    result = await getRefreshToken()
  }


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

      if (accessToken) options.headers['Authorization'] = result && `Bearer ${result.access_token}`

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


  //5분 빨리 refresh
  const expirationTime = dayjs(useUser().user.value.fUser && useUser().user.value.fUser.stsTokenManager?.expirationTime).subtract(5, 'minutes')

  const refreshToken = useCookie(config.REFRESH_TOKEN).value
  let isContinue = false;

  if (!refreshToken) {
    useUser().logout()
    return
  };

  /**
   * 토큰 리프레시 해야되는 경우
   * 1. api 실행하기 전에 유효기간 확인하고 유효기간 끝났으면 리프레시 해야함
   * 2. 리프레시 토큰이 있는데 useState 값 사라졋을 때 유효기간 끝났으면 다시 리프레시 해야함
   */

  if ((!useUser().user.value.fUser && useCookie(config.COOKIE_NAME).value)) {
    colorLog('case 2', 'yellow')
    isContinue = true
  } else if (useUser().user.value.fUser && (dayjs().isSame(expirationTime) || dayjs().isAfter(expirationTime))) {
    colorLog('case 1', 'pink')
    isContinue = true
  }

  //토큰 리프레시 없이 기존 토큰으로 api 실행
  if (!isContinue) {
    return {
      access_token: useUser().user.value.fUser.stsTokenManager.accessToken
    };
  }

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

    if (!useUser().user.value.fUser) {
      const user = $firebaseAuth.currentUser;
      console.log('user: ', user)


      const response = await $fetch<{ result: { user: IUser } }>('/user/info', getZempieFetchOptions('get', true))
      console.log('result: ', result)
      if (response) {
        const { user } = response.result
        useUser().setUser(user)
      }
    }
  }

  return result
}