import { defineNuxtPlugin } from '#app'
import * as firebase from 'firebase/app'
import { getAuth, onIdTokenChanged } from 'firebase/auth'


export default defineNuxtPlugin(async(nuxtApp)=>{  
  console.log('init firebase')
  const config = useRuntimeConfig();
  console.log('config', config)
  
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
  const auth = getAuth(app)

  onIdTokenChanged(auth, async (user)=>{   
    
    if(user){      
      await setAuthCookie((user as any).accessToken)  
      await setUserInfo()
    } 

  })
  nuxtApp.provide('firebaseApp', app);  
  nuxtApp.provide('firebaseAuth', auth);   
})

async function setAuthCookie(accessToken: string){
  const { data } = await useFetch('/api/setAuthCookie', { method: 'post', body: { accessToken: accessToken }, initialCache:false,})
  console.log('data')
  return data;
}

async function setUserInfo(){
   const router = useRouter();  

    const { data, error } = await auth.login()

    if (data.value) {
      const { user } = data.value.result
      useUser().setLogin(true)
      useUser().setUser(user)
      routerToHome()
    }else if(error.value){
      
      const{error:err} = error.value.data;
    
      if(err.code === 20001){
        alert('회원가입이 완료되지않았습니다. 회원가입을 진행해주세요')
        
         router.push('/join')
      }

    }
  
}

async function routerToHome(){
  const route = useRoute();
  const router = useRouter();
  if(route.name.toString().includes('login')){
    router.push('/')
  }
}

