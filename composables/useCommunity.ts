import { ICommunity, eGameStage } from "~~/types"


export default function () {

  const community = useState('community', () => ({
    info: null as ICommunity
  }))

  const setCommunity = async (id: string) => {
    const config = useRuntimeConfig()
    const accessToken = useCookie(config.COOKIE_NAME).value

    const { data, pending, error } = await useCustomFetch<any>(`/community/${id}`,
      getComFetchOptions('get', true))
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