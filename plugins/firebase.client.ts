import { defineNuxtPlugin } from '#app'
import * as firebase from 'firebase/app'
import { getAuth, onIdTokenChanged, } from 'firebase/auth'


// import * as firebaseAuth from '@firebase/auth'
import { IUser } from '~~/types';


const DAYSTOSEC_30 = 60 * 60 * 24 * 30;

export default defineNuxtPlugin(async (nuxtApp) => {
  const { $cookies } = useNuxtApp()

  const config = useRuntimeConfig();

  if (firebase.getApps().length !== 0) {
    return
  }
  const firebaseConfig = {
    apiKey: config.FIREBASE_API_KEY,
    authDomain: config.FIREBASE_AUTH_DOMAIN,
    projectId: config.FIREBASE_PROJECT_ID,
    storageBucket: config.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: config.FIREBASE_MESSAGING_SENDER_ID,
    appId: config.FIREBASE_APP_ID,
    measurementId: config.FIREBASE_MEASUREMENT_ID
  };

  const app = firebase.initializeApp(firebaseConfig);

  let auth = null

  try {
    auth = getAuth(app)

  } catch (error) {
    useUser().setLoadDone()
  }

  onIdTokenChanged(auth, (user) => {
    if (user) {
      $cookies.set(config.COOKIE_NAME, (user as any).accessToken, {
        maxAge: DAYSTOSEC_30,
        path: '/',
        domain: config.COOKIE_DOMAIN
      });

      $cookies.set(config.REFRESH_TOKEN, (user as any).stsTokenManager.refreshToken, {
        maxAge: DAYSTOSEC_30,
        path: '/',
        domain: config.COOKIE_DOMAIN
      });
      useUser().setFirebaseUser(user);

      if (!useUser().user.value.isSignUp) {
        setUserInfo()
      }
    } else {
      useUser().setLoadDone()
    }
  })

  nuxtApp.provide('firebaseApp', app);
  nuxtApp.provide('firebaseAuth', auth);
})


async function setUserInfo() {
  const config = useRuntimeConfig();
  const { $cookies, $firebaseAuth } = useNuxtApp()
  const router = useRouter()

  const { data, error } = await useCustomFetch<{ result: { user: IUser } }>('/user/info', getZempieFetchOptions('get', true))


  if (data.value) {
    const { user } = data.value.result
    useUser().setLogin()
    useUser().setUser(user)
    routerToHome()
  } else if (error.value) {
    const { error: err } = (error.value as any).data;
    console.log(err)

    switch (err.code) {
      case 20001:
        router.push(`/${useCommon().setting.value.lang}/join`)
        break;
      case 10001:
        alert('일정시간동안 활동이 없어 세션이 만료되었습니다. 다시 로그인해주세요')
        useUser().logout()
        break;
      default:
        break;
    }
  }

}

async function routerToHome() {
  const route = useRoute();
  const router = useRouter();
  if (route.name?.toString().includes('login')) {
    router.push(`/${useCommon().setting.value.lang}/timeline`)

  }
}

