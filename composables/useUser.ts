import { IUser } from "~~/types"

export default function () {
  const user = useState('user', () => ({
    isLogin:false,
    info:{} as IUser,
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
    // user.value.profile_img = url;
  }
  const removeUserState = () =>{
    user.value.fUser = null;
    user.value.info = {} as IUser;
    user.value.isLogin = false;
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
    removeUserState
    
  }
}