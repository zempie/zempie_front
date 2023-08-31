export default function () {
  const config = useRuntimeConfig()

  const zemtown = useState('zemtown', () => ({
    isOpenMyProfile: false,
    isOpenDm: false,
    url: config.ZEMTOWN_URL
  }))

  const openMyProfile = () => {
    zemtown.value.isOpenMyProfile = true
  }

  const closeMyProfile = () => {
    zemtown.value.isOpenMyProfile = false
  }


  const openDm = () => {
    zemtown.value.isOpenDm = true
  }

  const closeDm = () => {
    zemtown.value.isOpenDm = false
  }
  const setUrl = (url) => {
    zemtown.value.url = url
  }


  return {
    zemtown,
    openMyProfile,
    closeMyProfile,
    openDm,
    closeDm,
    setUrl
  }

}