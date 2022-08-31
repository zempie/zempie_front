
export default function () {
  const setting = useState('setting', () => ({
    lang: 'ko'

  }))

  const setLang = (lang: string) => {
    setting.value.lang = lang;
  }

  return {
    setting,
    setLang
  }
}