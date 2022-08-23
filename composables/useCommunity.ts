import { ICommunity, eGameStage } from "~~/types"


export default function () {

  const community = useState('community', () => ({
    info: null as ICommunity
  }))

  const setCommunity = async (id: string) => {
    const config = useRuntimeConfig()
    const accessToken = useCookie(config.COOKIE_NAME).value

    //FIXME: composable 왜 안되지??????
    const { data, pending, error } = await useFetch<any>(`/community/${id}`, {
      method: 'get',
      baseURL: config.COMMUNITY_API,
      headers: accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {},
      initialCache: false,


    })
    community.value.info = data.value
  }
  const setSubscribe = () => {
    community.value.info.is_subscribed = true
  }

  const resetCommunity = () => {
    community.value.info = null as ICommunity
  }

  return {
    community,
    setCommunity,
    resetCommunity,
    setSubscribe
  }
}