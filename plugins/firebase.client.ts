import { defineNuxtPlugin } from '#app'
import * as firebase from 'firebase/app'
import { getAuth, onIdTokenChanged, } from 'firebase/auth'
import * as fbFcm from '~~/scripts/firebase-fcm'
import shared from '~~/scripts/shared'
import { getMessaging, onMessage, getToken } from "firebase/messaging";
import { onBackgroundMessage } from "firebase/messaging/sw";


const HOURTOSEC = 60 * 60;

export default defineNuxtPlugin(async (nuxtApp) => {

  const route = useRoute();
  const router = useRouter();
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

  onIdTokenChanged(auth, async (user: any) => {
    console.log(user)
    colorLog('login 1', 'red')

    if (user) {
      shared.setTokens(user.accessToken, user.stsTokenManager.refreshToken)
      useUser().setFirebaseUser(user);

      // // 회원가입중인 경우 회원가입 로직에서 처리
      // if (!useUser().user.value.isSignUp) {

      //   // 로그인 페이지인 경우에만 유저 채널로 이동
      //   if (route.name?.toString().includes('login')) {
      //     router.push(`/${useCommon().setting.value.lang}/channel/${useUser().user.value.info.channel_id}`)
      //   }
      // }
    }

    useUser().setLoadDone()

  })


  const messaging = getMessaging(app);

  console.log('messaging', messaging)

  onMessage(messaging, (payload) => {
    console.log('Message received. ', payload);
    useAlarm().setNewNoti(payload)
  });


  nuxtApp.provide('firebaseApp', app);
  nuxtApp.provide('firebaseAuth', auth);
})
