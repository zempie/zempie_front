import { FetchOptions } from "ohmyfetch"
import dayjs from "dayjs";
import shared from "~~/scripts/shared";
import { getAuth, getIdToken } from "firebase/auth";
import FlutterBridge from '~~/scripts/flutterBridge'

const HOURTOSEC = 60 * 60;

let isTokenProcessing = 0

interface IRefreshToken {
  access_token: string,
  expires_in: string,
  id_token: string,
  project_id: string,
  refresh_token: string,
  token_type: string,
  user_id: string
}
const isFlutter = computed(() => useMobile().mobile.value.isFlutter)
export const useCustomAsyncFetch = async <T>(url: string, options?: FetchOptions, retryCount: number = 0) => {
  // const { $cookies } = useNuxtApp()
  const config = useRuntimeConfig()
  // const accessToken = useCookie(config.COOKIE_NAME)


  return await useFetch<T>(url, {
    initialCache: false,
    ...options,
    async onResponse({ request, response, options }) {

      useCommon().setLoadingDone()

      console.log('[fetch response]')

    },
    async onResponseError({ request, response, options }) {
      console.log('[fetch response error]', response)

      //사용자 uid error
      const errorCode = response._data?.error?.code

      switch (errorCode) {
        case 20001:
          break;
        case 10001:
          useUser().removeUserState()
          shared.removeCookies()
          break;
        default:
          if (retryCount < 3) {
            console.log('error run', retryCount)
            // await getRefreshToken()
          } else {
            console.log('remove cookie')

            useUser().removeUserState()
            shared.removeCookies()
            console.log('check', config.public.ENV, 'env:', config.env === 'development', config.env == 'development')

          }

          break;
      }


    },

    async onRequest({ request, options }) {
      console.log('url', url)
      const user = await getCurrentUser()
      let token = user?.accessToken || user?.idToken

      if (isFlutter.value) {
        options.headers['Authorization'] = `Bearer ${token}`

      } else if (user && !isFlutter.value) {


        const expirationTime = user.stsTokenManager.expirationTime
        // const expirationTime = 1681264108
        console.log('expirationTime', new Date(expirationTime))
        if (expirationTime <= Date.now()) {
          console.log('url', url)
          token = await getIdToken(user, true)
        }
        options.headers['Authorization'] = `Bearer ${token}`

      }

      options.headers = options.headers || {}

      console.log(options.headers)
      useCommon().setLoading()
      console.log('[fetch request]')
    },
    async onRequestError({ request, options, error }) {
      console.log('[fetch request error]')
    }
  })
}


// $fetch interceptor
export const useCustomFetch = async <T>(url: string, options?: FetchOptions, retryCount: number = 0) => {
  const config = useRuntimeConfig()
  const { $cookies, $localePath } = useNuxtApp()
  const router = useRouter()

  return await $fetch<T>(url, {
    ...options,
    async onResponse({ request, response, options }) {

      useCommon().setLoadingDone()

      console.log('[fetch response]')

    },
    async onResponseError({ request, response, options }) {
      console.log('[fetch response error]', response)

      //사용자 uid error
      const errorCode = response._data?.error?.code

      switch (errorCode) {
        case 20001:
          router.push($localePath('/join'))
          break;
        case 10001:
          await useUser().logout()
          shared.removeCookies()
          break;
        default:
          if (retryCount < 3) {
            console.log('error run')
            // await getRefreshToken()
            await useCustomAsyncFetch(url, options, ++retryCount)
          } else {
            console.log('remove cookie')
            await useUser().logout()
            shared.removeCookies()

          }
          break;
      }



    },

    async onRequest({ request, options }) {

      const user = await getCurrentUser()

      let token = user?.accessToken || user?.idToken

      if (isFlutter.value) {
        options.headers['Authorization'] = `Bearer ${token}`
      } else if (user && !isFlutter.value) {
        const expirationTime = user.stsTokenManager.expirationTime
        // const expirationTime = 1681264165
        console.log('expirationTime', expirationTime <= Date.now(), new Date(expirationTime))


        if (expirationTime <= Date.now()) {
          token = await getIdToken(user, true)
        }
        console.log('toekn2 ', token)
        options.headers['Authorization'] = `Bearer ${token}`
      }


      options.headers = options.headers || {}

      useCommon().setLoading()
      console.log('[fetch request]')
      return
    },
    async onRequestError({ request, options, error }) {
      console.log('[fetch request error]')
    }
  })


}

export async function getCurrentUser() {

  if (isFlutter.value) {

    const result = await FlutterBridge().FlutterBridge.getFbCurrentUser()
    return result
  } else {
    const auth = getAuth()

    const user: any = new Promise((resolve, reject) => {
      auth.onIdTokenChanged((user: any) => {
        resolve(user);
      });
    });

    return user
  }
}

export async function getRefreshToken() {
  if (isTokenProcessing > 0) return
  isTokenProcessing += 1
  const config = useRuntimeConfig();
  const { $cookies, $firebaseAuth } = useNuxtApp()


  //5분 빨리 refresh
  // const expirationTime = dayjs(useUser().user.value.fUser && useUser().user.value.fUser.stsTokenManager?.expirationTime).subtract(5, 'minutes')

  const refreshToken = useCookie(config.REFRESH_TOKEN).value
  let isContinue = false;

  if (!refreshToken) {
    useUser().removeUserState();
    $cookies.remove(config.COOKIE_NAME, {
      path: '/',
      domain: config.COOKIE_DOMAIN
    })

    $cookies.remove(config.REFRESH_TOKEN, {
      path: '/',
      domain: config.COOKIE_DOMAIN
    })
    return
  };

  /**
   * 토큰 리프레시 해야되는 경우
   * 1. api 실행하기 전에 유효기간 확인하고 유효기간 끝났으면 리프레시 해야함
   * 2. 리프레시 토큰이 있는데 useState 값 사라졋을 때
   */


  // if ((!useUser().user.value.info && useCookie(config.COOKIE_NAME).value)) {
  //   colorLog('case 2 no useState', 'yellow')
  //   isContinue = true
  // }
  // else if (useUser().user.value.info && (dayjs().isSame(expirationTime) || dayjs().isAfter(expirationTime))) {
  //   colorLog('case 1 expiration', 'pink')
  //   isContinue = true
  // }

  //토큰 리프레시 없이 기존 토큰으로 api 실행
  // if (!isContinue) {
  //   return {
  //     access_token: useCookie(config.COOKIE_NAME).value
  //   };
  // }

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


  try {
    const result = await $fetch<IRefreshToken>(config.GOOGLE_REFRESH_TOKEN_URL, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formBody2
    })

    console.log(result)

    if (result) {
      shared.setTokens(result.access_token, result.refresh_token)

      if (!useUser().user.value.info) {
        colorLog("refresh token and no info", 'yellow')
        await useUser().setUserInfo()
      }
    }

    isTokenProcessing = 0
    console.log('running...', isTokenProcessing)
    return result

  } catch (error: any) {
    shared.removeCookies()

  }
}
