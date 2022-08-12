import { IUser } from "~~/types"
import { signOut } from 'firebase/auth'
import { ElMessage, ElDialog } from "element-plus";

export default function () {
  const { $firebaseAuth, $cookies } = useNuxtApp()
const config = useRuntimeConfig()
const router = useRouter();

  const user = useState('user', () => ({
    isLogin:false,
    info:null as IUser,
    fUser:null
  }))


  const setFirebaseUser = (info:any) =>{
    user.value.fUser = info
  }

  const setUser = (info:IUser) =>{
   user.value.info = {...info}
  }

  const setLogin = (state:boolean) => {
    user.value.isLogin = state;
  }
  const setProfileImg = (url:string) =>{
    user.value.info.picture = url;
  }
  const removeUserState = () =>{
    user.value.fUser = null;
    user.value.info = {} as IUser;
    user.value.isLogin = false;
  }

  const logout = () =>{
    signOut($firebaseAuth)
    .then(() => {
      removeUserState();
      $cookies.remove(config.COOKIE_NAME, {
        path: '/',
        domain: config.COOKIE_DOMAIN
      })
      router.replace('/')
    })
    .catch((error: any) => {
      ElMessage({
        message: error.message,
        type: 'error'
      })
    })
  }

  const joinUser = async (payload:{name:string, nickname?:string}) =>{
    console.log(payload)
    const {data} = await auth.signUp(payload)
  }

  return {
    user,
    setUser,
    setFirebaseUser,
    setLogin,
    setProfileImg,
    joinUser,
    removeUserState,
    logout
    
  }
}