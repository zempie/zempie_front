<template>
  <a v-if="!community?.is_subscribed" class="btn-default mr10 mt20 w100p" :community="community"
    @click.stop="subscribe">{{ t('subscribe.btn') }}</a>
  <a v-else class="btn-sub mr10 mt20 w100p" @click.stop="modalIsOpen = true">{{
    $t('isSubscribing')
  }}</a>

  <ClientOnly>
    <el-dialog v-model="modalIsOpen" append-to-body class="modal-area-type" :show-close="false" width="380px">
      <div class="modal-alert">
        <dl class="ma-header">
          <dt>{{ t('information') }}</dt>
          <dd>
            <button @click="modalIsOpen = false">
              <i class="uil uil-times"></i>
            </button>
          </dd>
        </dl>
        <div class="ma-content">
          <h2>
            {{ t('leave.community.text1') }}<br />※
            {{ t('leave.community.text2') }}
          </h2>
          <div>
            <button class="btn-default w48p" @click="unsubscribe">
              {{ t('yes') }}
            </button>
            <button class="btn-gray w48p" @click="modalIsOpen = false">
              {{ t('no') }}
            </button>
          </div>
        </div>
      </div>
    </el-dialog>
  </ClientOnly>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { ICommunity } from '~~/types'
import { ElDialog, ElMessage } from 'element-plus'

import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()

const modalIsOpen = ref(false)

const props = defineProps({
  community: Object as PropType<ICommunity>,
})
const emit = defineEmits(['refresh'])

const isLogin = computed(() => useUser().user.value.isLogin)
const communityId = computed(() => props.community.id)

async function subscribe() {
  if (isLogin) {
    const { data, error } = await useCustomAsyncFetch(`/community/${communityId.value}/subscribe`, getComFetchOptions('post', true))
    if (!error.value) {
      emit('refresh')
      ElMessage({
        message: t('community.subscribe.done'),
        type: 'success',
        customClass: "copy-msg",
      })
    }
  } else {
    useModal().openLoginModal()
  }
}

async function unsubscribe() {
  const { data, error } = await useCustomAsyncFetch(`/community/${communityId.value}/unsubscribe`, getComFetchOptions('post', true))
  if (!error.value) {
    ElMessage({
      message: t('community.unsubscribe.done'),
      type: 'success',
      customClass: "copy-msg",
    })
    emit('refresh')
    modalIsOpen.value = false
  }
}
</script>

<style scoped lang="scss"></style>
