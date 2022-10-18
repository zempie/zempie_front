import { IUser } from "~~/types"
import { signOut } from 'firebase/auth'
import { ElMessage, ElDialog } from "element-plus";

export default function () {
  const { $firebaseAuth, $cookies } = useNuxtApp()
  const config = useRuntimeConfig()
  const router = useRouter();

  const user = useState('user', () => ({
    isLogin: false,
    info: null as IUser,
    fUser: null,
    isSignUp: false,
    isLoading: true, //header loading
  }))


  const setFirebaseUser = (info: any) => {
    user.value.fUser = info
  }

  const setUser = (info: IUser) => {
    user.value.info = { ...info }
  }

  const setLogin = () => {
    user.value.isLogin = true;
    user.value.isLoading = false;
  }
  const setLogout = () => {
    user.value.isLogin = false;
  }
  const setSignup = () => {
    user.value.isSignUp = true;
  }
  const unsetSignup = () => {
    user.value.isSignUp = false;
  }
  const setProfileImg = (url: string) => {
    user.value.info.picture = url;
  }

  const setBannerImg = (url: string) => {
    user.value.info.url_banner = url;
  }
  const removeUserState = () => {
    user.value.fUser = null;
    user.value.info = {} as IUser;
    user.value.isLogin = false;
  }

  const login = async () => {
    const router = useRouter();
    const { data, error } = await auth.login()

    if (data.value) {
      const { user } = data.value.result
      user.value.isLogin = true;
      user.value.info = { ...user }
      routerToHome()
    } else if (error.value) {

      const { error: err } = error.value.data;

      if (err.code === 20001) {

        alert('회원가입이 완료되지않았습니다. 회원가입을 진행해주세요')

        router.push(`/${useCommon().setting.value.lang}/join`)
      }
    }

  }

  const logout = () => {
    signOut($firebaseAuth)
      .then(() => {
        removeUserState();
        $cookies.remove(config.COOKIE_NAME, {
          path: '/',
          domain: config.COOKIE_DOMAIN
        })

        $cookies.remove(config.REFRESH_TOKEN, {
          path: '/',
          domain: config.COOKIE_DOMAIN
        })

        window.location.href = `/${useCommon().setting.value.lang}`

      })
      .catch((error: any) => {
        ElMessage({
          message: error.message,
          type: 'error'
        })
      })
  }

  const joinUser = async (payload: { name: string, nickname?: string }) => {
    const { data } = await auth.signUp(payload)
  }

  const setLoadDone = () => {
    user.value.isLoading = false;
  }



  return {
    user,
    setUser,
    setFirebaseUser,
    setLogin,
    setLogout,
    setProfileImg,
    joinUser,
    removeUserState,
    logout,
    login,
    setSignup,
    unsetSignup,
    setBannerImg,
    setLoadDone
  }
}


async function routerToHome() {
  const route = useRoute();
  const router = useRouter();
  if (route.name?.toString().includes('login')) {
    router.push(`/${useCommon().setting.value.lang}/timeline`)


  }
}
