import { defineNuxtPlugin } from '#app'
import * as firebase from 'firebase/app'
import { getAuth, onIdTokenChanged, } from 'firebase/auth'
import * as fbFcm from '~~/scripts/firebase-fcm'
import shared from '~~/scripts/shared'
import { getMessaging, onMessage, getToken } from "firebase/messaging";
import { isObjEmpty } from '~~/scripts/utils'


export default defineNuxtPlugin(async (nuxtApp) => {
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
    console.info('fuser', user)
    if (!isObjEmpty(useUser().user.value.info)) {
      useUser().setLoadDone()
    } else {
      if (user) {
        await useUser().setUserInfo()
        useUser().setFirebaseUser(user);
      }
    }
    if (user) {
      await setFirebaseToken()
    }


  })
  if (!navigator.userAgent.match(/iPad/i) && !navigator.userAgent.match(/iPhone/i) && !window.navigator.userAgent.toLowerCase().includes('naver') && !window.navigator.userAgent.toLowerCase().includes('kakao') && window.location.protocol === 'https:') {
    const messaging = getMessaging(app);

    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      useAlarm().setNewNoti(payload)
    });

  }

  nuxtApp.provide('firebaseApp', app);
  nuxtApp.provide('firebaseAuth', auth);
})


async function setFirebaseToken() {
  const { token } = await fbFcm.getFcmToken(useUser().user.value.info.id)
  if (!token) {
    await fbFcm.resigterFcmToken(useUser().user.value.info.id)
  }
}
