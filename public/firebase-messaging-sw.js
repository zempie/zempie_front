// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup


importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js')
importScripts(
  'https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js'
)
// importScripts('/__/firebase/init.js')

/*
 *development
 */
// const config = {
//   apiKey: 'AIzaSyAE2WeLg2L9n2niQMysGbXzACLNIXd5msE',
//   authDomain: 'zempie-dev.firebaseapp.com',
//   projectId: 'zempie-dev',
//   storageBucket: 'zempie-dev.appspot.com',
//   messagingSenderId: '797641160577',
//   appId: '1:797641160577:web:3c10f8e96f7827d2645a80',
//   measurementId: 'G-NFY628EX60',
// }

/*
 *production
 */
const config = {
  apiKey: "AIzaSyAXt32ipLLoSlyijdCKAMSpapooo7wbTTE",
    authDomain: "zempie.firebaseapp.com",
    databaseURL: "https://zempie.firebaseio.com",
    projectId: "zempie",
    storageBucket: "zempie.appspot.com",
    messagingSenderId: "235654438895",
    appId: "1:235654438895:web:03bb6a5b89826f37c9601a",
    measurementId: "G-Z3JMFZBKM3"
}

firebase.initializeApp(config)

const messaging = firebase.messaging()

// messaging.onBackgroundMessage(function (payload) {
//   console.log(payload)

//   const notificationTitle = 'ZEMPIE NOTIFICATION'
//   const notificationOptions = {
//     body: payload.data.body,
//     icon: './images/favicon.ico',
//   }

//   self.registration.showNotification(notificationTitle, notificationOptions)
// })
