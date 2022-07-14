import ko from '../locales/ko/translation.json'
import en from '../locales/en/translation.json'

const languages = {
  en: en,
  ko: ko,
}

const messages = Object.assign(languages)

export const i18n = {

  locales: ['en', 'ko'],
  defaultLocale: 'en',
  vueI18n: {
    silentTranslationWarn: true,
    fallbackLocale: 'en',
    messages
  }

}
