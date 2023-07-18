
export default function () {
  const setting = useState('setting', () => ({
    lang: 'ko',
    isFbSupported: true,
    isNotiAllow: false,

  }))
  const loading = useState('loading', () => {
    return true
  })

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

  return {
    setting,
    loading,
    setLang,
    setLoading,
    setLoadingDone,
    setSupport,
    setNoti
  }
}