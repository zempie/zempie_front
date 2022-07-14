//import * as firebase from 'firebase/app'
import { reactive, ref, readonly } from 'vue'
import {
  getAuth,
  GoogleAuthProvider,
  onIdTokenChanged,
  // EmailAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  // signOut,
  createUserWithEmailAndPassword,
  // reauthenticateWithCredential,
  // updatePassword,
  // signInWithCustomToken,
  FacebookAuthProvider,
  OAuthProvider,
  // sendPasswordResetEmail,
  UserCredential,
  AuthProvider
} from 'firebase/auth'

import * as firebase from 'firebase/app'

import { config } from '~/plugins/firebase'


import { useUserStore } from '~/store/user'



// import { getMessaging, getToken, onMessage } from 'firebase/messaging'
if (!firebase) {
  console.log('init app')
  //@ts-ignore
  firebase.initializeApp(config)

}
const authInstance = getAuth()


const state = reactive({
  fUser: {},
  fcmToken: null,
  kakao_token: null,
  naver_token: null,
})

// check

onIdTokenChanged(authInstance, (user: any) => {
  const userStore = useUserStore()
  if (user) {
    state.fUser = user

    userStore.$state.fUser = user;
    // res.user.providerData.forEach((profile) => {
    //   state.fUser.photoURL = profile.photoURL ?? 'img/profile_default.png'
    // });


    console.info('fb login', user)
  } else {
    // console.info('No login')
  }
})

//const messagingInstance = getMessaging()

// join
async function signUpEmail(email: string, passwd: string) {
  return createUserWithEmailAndPassword(authInstance, email, passwd)
    .then((res: UserCredential) => {
      state.fUser = res.user

      return res.user
    })
    .catch((err: any) => {
      const errorCode = err.code
      const errorMessage = err.message
      let message = errorCode ? errorCode : errorMessage
      switch (errorCode) {
        case 'auth/weak-password':
          message = 'Please enter a 6-20 digit password including English letter and at least 1 number or special character'
          break
        case 'auth/wrong-password':
          message = 'Wrong information. Please type in again.'
          break
      }
      throw { message }
    })
}

// login
async function signInEmail(email: string, passwd: string) {
  return signInWithEmailAndPassword(authInstance, email, passwd)
    .then((res: UserCredential) => {
      state.fUser = res.user
    })
    .catch((err: any) => {
      console.error('ERROR signInEmail', err)
      const errorCode = err.code
      const errorMessage = err.message
      //return Promise.reject( { errorCode, message: errorMessage })
      // throw { errorCode, message: errorMessage }
      let message = errorCode ? errorCode : errorMessage
      switch (errorCode) {
        case 'auth/user-not-found':
          message = "This member's information does not exist. Please proceed with registration"
          break
        case 'auth/wrong-password':
          message = 'Wrong information. Please type in again.'
          break
      }
      throw { message }
    })

}

function signInGoogle() {
  const provider = new GoogleAuthProvider()
  return socialLogin(provider)
}

function singInFacebook() {
  const provider = new FacebookAuthProvider()
  provider.addScope('email');
  return socialLogin(provider)
}

function singInApple() {
  const provider = new OAuthProvider('apple.com')
  provider.addScope('email');
  return socialLogin(provider)
}

async function socialLogin(provider: AuthProvider) {

  return signInWithPopup(authInstance, provider)
    .then((res: UserCredential) => {
      state.fUser = res.user
    })
    .catch((err: any) => {
      console.error('socialLogin err', err)

      const errorCode = err.code


      // if (err.message.includes('auth/account-exists-with-different-credential')) {
      //   Notify.create({
      //     message: 'The account already exists with a different credential'
      //     , color: 'negative'
      //   })

      // }
      // else {
      //   Notify.create({
      //     message: err.message
      //     , color: 'negative'
      //   })
      // }

      //console.log('chk2', errorCode)
      const message = errorCode ? errorCode : err.message
      throw { message }
    })
}

// kakao naver
// async function signInCustomToken(customToken: string) {
//   return signInWithCustomToken(authInstance, customToken)
//     .then((res) => {
//       state.fUser = res.user
//     })
//     .catch((err) => {
//       console.error('signInCustomToken err', err)
//       const errorCode = err.code
//       //console.log('chk2', errorCode)
//       const message = errorCode ? errorCode : err.message
//       throw { message }
//     })
// }

async function fLogOut() {
  // return signOut(authInstance)
  //   .then(() => {
  //     state.fUser = null
  //   })
  //   .catch((err) => {
  //     throw err
  //   })
}

async function changePassword(passwd: string, newPasswd: string) {
  // const user = authInstance.currentUser
  // const cred = EmailAuthProvider.credential(user.email, passwd)

  // try {
  //   const _reauth = await reauthenticateWithCredential(user, cred)
  //   await updatePassword(user, newPasswd)
  //   return { message: 'success' }
  // } catch (err) {
  //   const errorCode = err.code
  //   const errorMessage = err.message
  //   let message = errorCode ? errorCode : errorMessage
  //   switch (errorCode) {
  //     case 'auth/weak-password':
  //       message = 'The Combination power is too low (Letters and numbers, 6 or more characters)'
  //       break
  //     case 'auth/wrong-password':
  //       message = 'Wrong information. Please type in again'
  //       break
  //     case 'auth/too-many-requests':
  //       message = 'Too many Requests. Please try again later!'
  //       break
  //   }
  //   throw { message }
  // }
}

// messaging
// function getFcmToken(vapidKey) {
//   //console.log('getFcmToken', vapidKey)
//   if (store.state.fcm_token) return store.state.fcm_token
//   getToken(messagingInstance, { vapidKey })
//     .then((currentToken) => {
//       if (currentToken) {
//         //console.log('fcm_token', currentToken)
//         store.methods.setFcmToken(currentToken)
//         sessionStorage.setItem('fcm_token', currentToken)
//         return currentToken
//       } else {
//         // Show permission request UI
//         console.error('No registration token available. Request permission to generate one.')
//         // ...
//         return null
//       }
//     })
//     .catch((err) => {
//       console.error('An error occurred while retrieving token. ', err)
//       return null
//       // ...
//     })

//   // 알림 수신을 위한 사용자 권한 요청
//   Notification.requestPermission().then((permission) => {
//     //console.log('permission ', permission)
//     if (permission !== 'granted') {
//       alert('알림을 허용해주세요')
//     }
//   })
// }

//
// function setKakaoToken(token: null) {
//   state.kakao_token = token
// }
// function setNaverToken(token: null) {
//   state.naver_token = token
// }

// async function sendResetPassword(email: string) {
//   return sendPasswordResetEmail(authInstance, email)
//     .then((res) => {
//       console.log(res)
//     })
//     .catch((err) => {
//       console.error(err)
//     })

// }

export default {
  state: readonly(state),

  signInEmail,
  signUpEmail,
  signInGoogle,
  fLogOut,
  changePassword,

  singInFacebook,
  singInApple,
  getAuth
}
