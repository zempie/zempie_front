import { defineNuxtPlugin } from '#app'
import * as firebase from 'firebase/app'
import { getAuth, onIdTokenChanged } from 'firebase/auth'
import * as Api from '~/composables/useFetchData'

const DAYSTOSEC_30 = 60 * 60 * 24 * 30;

export default defineNuxtPlugin(async(nuxtApp)=>{  
  const{ $cookies} = useNuxtApp()

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
      $cookies.set(config.COOKIE_NAME, (user as any ).accessToken, {
            maxAge:DAYSTOSEC_30,
            path:'/',
            domain:config.COOKIE_DOMAIN
          }); 
     useUser().setFirebaseUser(user); 
     console.log('useUser().user.value.isSignUp', useUser().user.value.isSignUp)

     if(!useUser().user.value.isSignUp)  {
      setUserInfo()
     }
    }
  })
  nuxtApp.provide('firebaseApp', app);  
  nuxtApp.provide('firebaseAuth', auth);   
})

async function setAuthCookie(accessToken: string){  
  const { data } = await useFetch('/api/setAuthCookie', { method: 'post', body: { accessToken: accessToken }, initialCache:false})
  return data;
}

async function setUserInfo(){
   const router = useRouter(); 

    const { data, error } = await auth.login()

    if (data.value) {
      const { user } = data.value.result
      useUser().setLogin()
      useUser().setUser(user)
      routerToHome()
    }else if(error.value){
      const{error:err} = error.value.data;
      
    
      if(err.code === 20001){
        
       
        // alert('회원가입이 완료되지않았습니다. 회원가입을 진행해주세요')
        
        //  router.push('/join')
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

