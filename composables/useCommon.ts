
export default function () {
  const setting = useState('setting', () => ({
    lang: 'ko',
    isFbSupported: true,
    isNotiAllow: false,
  }))

  const loading = useState('loading', () => {
    return true
  })

  const common = useState('common', () => ({
    isMobile: false
  }))


  const setLang = (lang: string) => {
    setting.value.lang = lang;
  }

  const setLoading = () => {
    loading.value = true
  }
  const setLoadingDone = () => {
    loading.value = false
  }
  const setSupport = (state: boolean) => {
    setting.value.isFbSupported = state
  }
  const setNoti = (state: boolean) => {
    setting.value.isNotiAllow = state
  }
  const setMobile = (state: boolean) => {
    common.value.isMobile = state
  }

  return {
    setting,
    loading,
    common,
    setLang,
    setLoading,
    setLoadingDone,
    setSupport,
    setNoti,
    setMobile
  }
}