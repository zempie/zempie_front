<template>
  <span v-if="isTranslated" class="trans-btn" @click="undoTranslate">{{
    $t('see.original')
  }}</span>
  <span v-else class="trans-btn" @click="translate">{{
    $t('see.translation')
  }}</span>
</template>
<script setup lang="ts">
import _ from 'lodash'
import { useI18n } from 'vue-i18n'
import { htmlToDomElem } from '~~/scripts/utils'

const { t, locale } = useI18n()

const isTranslated = ref(false)
const originFeedContent = ref('')

const props = defineProps({
  text: String,
})
const emit = defineEmits(['translatedText', 'untranslatedText'])

async function translate() {
  originFeedContent.value = _.cloneDeep(props.text)

  const payload = {
    text: props.text,
    source: locale.value,
    target: locale.value,
    format: 'text',
  }
  const { data, pending, refresh } = await useFetch<{
    result: {
      translations: {
        translatedText: string
        model: string
        glossaryConfig: string | null
        detectedLanguageCode: string
      }[]
      glossaryTranslations: []
    }
  }>('/translate', getZempieFetchOptions('post', false, payload))

  if (data.value) {
    const { result } = data.value

    emit('translatedText', result.translations[0].translatedText)

    isTranslated.value = true
  }
}

async function undoTranslate() {
  isTranslated.value = false
  emit('untranslatedText', originFeedContent.value)
}
</script>
<style lang="scss">
.trans-btn {
  margin-left: 10px;
  cursor: pointer;
}
</style>
