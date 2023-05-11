import { IUser } from "~~/types"
import { signOut } from 'firebase/auth'
import { ElMessage, ElDialog } from "element-plus";
import { removeFcmToken } from "~~/scripts/firebase-fcm";
import { isObjEmpty } from "~~/scripts/utils";
import flutterBridge from "~~/scripts/flutterBridge";

export default function () {
  const { $firebaseAuth, $cookies } = useNuxtApp()
  const config = useRuntimeConfig()
  const router = useRouter();

  const isFlutter = computed(() => useMobile().mobile.value.isFlutter)

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
    user.value.info.banner_img = url;
  }
  const removeUserState = () => {
    user.value.fUser = null;
    user.value.info = null as IUser;
    user.value.isLogin = false;
    // useChannel().resetUserChannel()
  }

  const updateUserKey = (key: string, value?: any) => {
    user.value.info[key] = value
  }
  const updateFbToken = (token: string) => {
    user.value.fUser.accessToken = token
  }
  const updateUserCoin = (coin: { zem: number, pie: number }) => {
    user.value.info.coin.pie = coin.pie
    user.value.info.coin.zem = coin.zem

  }

  const logout = async () => {

    try {
      if (isFlutter.value) {
        await flutterBridge().signOutFirebase();
      } else {
        await signOut($firebaseAuth);
      }
      await removeFcmToken(user.value.info.id);

    } catch (error) {
      ElMessage({
        message: error.message,
        type: 'error',
      });
    } finally {
      removeUserState();
    }

  }


  const setLoadDone = () => {
    user.value.isLoading = false;
  }

  const setUserInfo = async () => {

    try {
      const response = await useCustomFetch<{ result: { user: IUser } }>('/user/info', getZempieFetchOptions('get', true))

      if (response) {
        const { user: userResult } = response.result
        user.value.info = { ...userResult }

        user.value.isLogin = true;
        useUser().setLoadDone()
      }
      if (!isObjEmpty(user.value.fUser)) {
        useUser().setLoadDone()
      }

      return user.value.info

    } catch (error) {
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
    updateFbToken,
    updateUserCoin
  }
}
