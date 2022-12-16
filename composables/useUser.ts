import { IUser } from "~~/types"
import { signOut } from 'firebase/auth'
import { ElMessage, ElDialog } from "element-plus";
import { removeFcmToken } from "~~/scripts/firebase-fcm";

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
    user.value.isLogin = !!user.value.info;
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

  const updateUserKey = (key: string, value?: any) => {
    user.value.info[key] = value

  }


  const logout = async () => {
    signOut($firebaseAuth)
      // .then(() => {
      //   removeFcmToken(user.value.info.id)
      // })
      .then(() => {
        removeUserState();
        setLogout()
        $cookies.remove(config.COOKIE_NAME, {
          path: '/',
          domain: config.COOKIE_DOMAIN
        })

        $cookies.remove(config.REFRESH_TOKEN, {
          path: '/',
          domain: config.COOKIE_DOMAIN
        })

      })
      .catch((error: any) => {
        ElMessage({
          message: error.message,
          type: 'error'
        })
      })
  }


  const setLoadDone = () => {
    user.value.isLoading = false;
  }

  const setUserInfo = async () => {
    colorLog(`===set user info===`, '#ed1cdc')
    const response = await useCustomFetch<{ result: { user: IUser } }>('/user/info', getZempieFetchOptions('get', true))

    if (response) {
      const { user: userResult } = response.result
      user.value.info = { ...userResult }
      setLogin()
    }

  }


  return {
    user,
    setUser,
    setFirebaseUser,
    setLogin,
    setLogout,
    setProfileImg,
    removeUserState,
    logout,
    setSignup,
    unsetSignup,
    setBannerImg,
    setLoadDone,
    setUserInfo,
    updateUserKey
  }
}
