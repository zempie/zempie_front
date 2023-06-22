import { defineNuxtPlugin } from '#app'
import * as firebase from 'firebase/app'
import { getAuth, onIdTokenChanged, } from 'firebase/auth'
import * as fbFcm from '~~/scripts/firebase-fcm'
import shared from '~~/scripts/shared'
import { getMessaging, onMessage, getToken, isSupported } from "firebase/messaging";
import { isObjEmpty } from '~~/scripts/utils'
import { eNotificationType } from '~~/types';


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

  const isSupport = await isSupported()
  useCommon().setSupport(isSupport)


  if (isSupport) {
    const messaging = getMessaging(app);

    console.log('messaging', messaging)

    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);

      if (payload.data?.meta) {
        const meta = JSON.parse(payload.data.meta)
        if (meta.fcmType === String(eNotificationType.dm)) {
          useAlarm().setNewDm(payload)
        }
      } else {
        useAlarm().setNewNoti(payload)
      }
    });

  }

  nuxtApp.provide('firebaseApp', app);
  nuxtApp.provide('firebaseAuth', auth);
})


export async function setFirebaseToken() {
  const userInfo = useUser().user.value.info;
  if (userInfo) {
    await fbFcm.resigterFcmToken(userInfo.id)
  }
}
