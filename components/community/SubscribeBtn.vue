<template>
  <a v-if="!community?.is_subscribed" class="btn-default mr10 mt20 w100p" :community="community"
    @click.stop="subscribe">{{ t('subscribe.btn') }}</a>

  <a v-else class="btn-sub mr10 mt20 w100p" @click.stop="openModal">{{
    $t('isSubscribing')
  }}</a>

  <ClientOnly>
    <el-dialog v-model="isModalOpen" class="modal-area-type" :show-close="false" width="380px" @close="onCloseModal"
      append-to-body>
      <div class="modal-alert">
        <dl class="ma-header">
          <dt class="mt0" style="order:1; text-align: left;">{{ t('information') }}</dt>
          <dd style="order:2;text-align: right;">

            <button @click.stop="closeModal" ref="closeBtnRef">
              <IconClose />
            </button>
          </dd>
        </dl>
        <div class="ma-content">
          <h2>
            {{ t('leave.community.text1') }}<br />※
            {{ t('leave.community.text2') }}
          </h2>
          <div>
            <button class="btn-default w48p" @click.stop="unsubscribe">
              {{ t('yes') }}
            </button>
            <button class="btn-gray w48p" @click.stop="closeModal">
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

const isModalOpen = ref(false)
const closeBtnRef = ref()

const isLogin = computed(() => useUser().user.value.isLogin)
const communityId = computed(() => props.community.id)
const isMobile = computed(() => useCommon().common.value.isMobile)

const props = defineProps({
  community: Object as PropType<ICommunity>,
})
const emit = defineEmits(['refresh', 'isSubModal'])

defineExpose({ closeModal })

watch(
  () => useCommon().common.value.isPopState,
  (val) => {
    if (!val) {
      closeModal()
    }
  })

async function subscribe() {
  if (isLogin.value) {
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
  emit('isSubModal', false)

  const { data, error } = await useCustomAsyncFetch(`/community/${communityId.value}/unsubscribe`, getComFetchOptions('post', true))
  if (!error.value) {
    ElMessage({
      message: t('community.unsubscribe.done'),
      type: 'success',
      customClass: "copy-msg",
    })
    emit('refresh')
    isModalOpen.value = false
  }
}

function openModal() {
  isModalOpen.value = true;
  emit('isSubModal', true);
  if (isMobile.value) {
    useCommon().setPopState(true)
  }
}

function closeModal() {
  isModalOpen.value = false;
  emit('isSubModal', false)
}

function onCloseModal() {
  if (isMobile.value) {
    useCommon().setPopState(false)
  }
}
</script>
