
export default function () {
  const setting = useState('setting', () => ({
    lang: 'ko'

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

  return {
    setting,
    loading,
    setLang,
    setLoading,
    setLoadingDone
  }
}