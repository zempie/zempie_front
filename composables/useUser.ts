import { IUser } from "~~/types"
import { signOut } from 'firebase/auth'
import { ElMessage, ElDialog } from "element-plus";
import { removeFcmToken } from "~~/scripts/firebase-fcm";
import { isObjEmpty } from "~~/scripts/utils";

export default function () {
  const { $firebaseAuth, $cookies } = useNuxtApp()
  const config = useRuntimeConfig()
  const router = useRouter();

  const user = useState('user', () => ({
    info: null as IUser,
    fUser: null,
    isSignUp: false,
    isLoading: true,
    isLogin: false,
  }))

  const setFirebaseUser = (info: any) => {
    user.value.fUser = info
  }

  const setUser = (info: IUser) => {
    user.value.info = { ...info }
  }
  const setLogin = () => {
    user.value.isLogin = true;
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
    user.value.info = null as IUser;
    user.value.isLogin = false;
  }

  const updateUserKey = (key: string, value?: any) => {
    user.value.info[key] = value
  }
  const updateFbToken = (token: string) => {
    user.value.fUser.accessToken = token
  }


  const logout = async () => {
    signOut($firebaseAuth)
      .then(() => {
        removeFcmToken(user.value.info.id)
      })
      .then(() => {
        removeUserState();
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

    try {
      const response = await useCustomFetch<{ result: { user: IUser } }>('/user/info', getZempieFetchOptions('get', true))

      if (response) {
        const { user: userResult } = response.result
        user.value.info = { ...userResult }
        if (!isObjEmpty(user.value.fUser)) {
          useUser().setLoadDone()
        }
        user.value.isLogin = true;
      }
    } catch (error) {
      console.log(error)
      useUser().setLoadDone()
    }

  }


  return {
    user,
    setUser,
    setFirebaseUser,
    setLogin,
    // setLogout,
    setProfileImg,
    removeUserState,
    logout,
    setSignup,
    unsetSignup,
    setBannerImg,
    setLoadDone,
    setUserInfo,
    updateUserKey,
    updateFbToken
  }
}
