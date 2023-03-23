<template>
  <dl class="row" v-if="feed">
    <dt class="flex">
      <UserAvatar :user="feed.user" tag='span' :hasRouter="true" />
    </dt>
    <dd class="column content-center">
      <div class="row" v-if="user">
        <h2 class="user-name mr5 text-ellipsis pointer" @click="moveUserPage"> {{ feed.user?.nickname }} </h2>
        <!-- <h3 class="text-ellipsis pointer" v-if="feed.user.nickname" @click="moveUserPage">@{{ feed.user.nickname }}</h3> -->
      </div>
      <p>
        <i class="uis uis-clock" style="color: #c1c1c1"></i>
        <span v-if="locale === 'ko'">
          {{ dateFormat(feed.created_at) }}</span>
        <span v-else> {{ enDateFormat(feed.created_at) }}</span>
        <span v-if="isTranslated" class="trans-btn" @click="undoTranslate">{{
          $t('see.original')
        }}</span>
        <span v-else class="trans-btn" @click="translate">{{
          $t('see.translation')
        }}</span>
      </p>
    </dd>
    <slot name="followBtn" />
  </dl>
  <dl v-else class="row items-center">
    <dt>
      <UserAvatarSk style="width:40px; height:40px" />
    </dt>
    <dd>
      <h2>{{ $t('feed.noUser.post') }}</h2>
    </dd>
  </dl>
</template>
<script setup lang='ts'>
import _ from 'lodash'

import { dateFormat, enDateFormat, } from '~~/scripts/utils'

const { $localePath } = useNuxtApp()
const { locale } = useI18n()
const $router = useRouter()

const isTranslated = ref(false)
const originFeedContent = ref('')

const props = defineProps({
  feed: Object
})


const emit = defineEmits(['translatedText', 'untranslatedText'])

async function translate() {
  originFeedContent.value = _.cloneDeep(props.feed.content)

  const payload = {
    text: props.feed.content,
    source: locale.value,
    target: locale.value,
    format: 'text',
  }
  const { data, pending, refresh } = await useCustomAsyncFetch<{
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

function moveUserPage() {

  $router.push($localePath(`/channel/${props.feed?.user.channel_id}`))
}
</script>
<style scoped lang='scss'></style>
