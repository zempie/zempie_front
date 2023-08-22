import ko from '../locales/ko/translation.json'
import en from '../locales/en/translation.json'

const languages = {
  en: en,
  ko: ko,
}

const messages = Object.assign(languages)

export const i18n = {
  strategy: 'prefix_except_default',
  locales: [
    {
      code: 'ko',
      iso: 'kr'
    },
    {
      code: 'en',
      iso: 'en-US'
    },
  ],
  defaultLocale: 'en',

  vueI18n: {
    legacy: false,
    silentTranslationWarn: true,
    fallbackLocale: 'en',
    messages
  }

}
