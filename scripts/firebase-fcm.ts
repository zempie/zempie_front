import axios from 'axios'
import { getMessaging, getToken } from 'firebase/messaging'
import flutterBridge from './flutterBridge'


interface iFcmToken {
  created_at: string,
  deleted_at: string,
  id: string,
  token: string,
  updated_at: string,
  user_id: number
}

const FCM_TOKEN = 'fToken'

export const getFcmToken = async (user_id) => {
  return await useCustomFetch<{
    channel_id: string, created_at: string, deleted_at: string, email: string, id: number, is_developer: number, last_log_in: string,
    name: string, picture: string, token: iFcmToken, uid: string, updated_at: string, banner_img: string
  }>(`/fcm/${user_id}`, getComFetchOptions('get', false))
}

export const removeFcmToken = async () => {
  const config = useRuntimeConfig()
  const fcmToken = getTokenInLocal()
  const fUser = useUser().user.value.fUser
  removeTokenInLocal()

  return useCustomAsyncFetch(`/fcm?token=${fcmToken}`, getComFetchOptions('delete', true))

}

export const resigterFcmToken = async (user_id: number) => {
  const isFlutter = useMobile().mobile.value.isFlutter
  const config = useRuntimeConfig()
  let token = null

  if (isFlutter) {
    try {
      token = await flutterBridge().getMessagingToken()
    } catch (err) {
      alert(`err : ${err}`)
    }
  } else {
    const { $firebaseApp } = useNuxtApp()
    const messaging = getMessaging($firebaseApp);
    token = await getToken(messaging, { vapidKey: config.fCM_KEY })
  }
  if (token) {
    setTokenInLocal(token)
    return await axios(`/fcm/${user_id}?token=${token}`,
      {
        method: 'post',
        baseURL: config.COMMUNITY_API
      })
  }
}

const getTokenInLocal = () => {
  return localStorage.getItem(FCM_TOKEN)
}

const setTokenInLocal = (token: string) => {
  localStorage.setItem(FCM_TOKEN, token);
}

const removeTokenInLocal = () => {
  const fcmToken = getTokenInLocal()

  if (fcmToken) {
    localStorage.removeItem(FCM_TOKEN)
  }
}