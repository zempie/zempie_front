<template>
  <ul>
    <li class="flex column" style="overflow:visible; word-break: break-all; width: 100%; " @mousemove="openMenu"
      @mouseleave="closeMenu">
      <p class="mb5" v-if="msg.sender?.id !== userInfo.id">{{ msg.sender.nickname }}</p>
      <div class="flex pos-relative msg-box ">
        <UserAvatar v-if="msg.sender?.id !== userInfo.id" :user="msg.sender" tag="span"
          style="width:40px; height:40px; position:absolute; top:0px;" class="mr5" />
        <template v-if="msg.sender?.id === userInfo.id" class="mr5">
          <DmMsgMenu v-if="showMsgMenu" :msg="msg" @delete-msg="openDeleteMsgModal" style="max-height: 100px;" />
          <h4 class="mr5">{{
            dmDateFormat(msg.created_at) }}</h4>
        </template>
        <span v-if="msg.type === eChatType.TEXT" style="max-width: 85%;"
          :style="msg.sender?.id !== userInfo.id && 'margin-left:45px'">{{
            msgContent }}</span>
        <div class="msg-img-container" v-else-if="msg.type === eChatType.IMAGE"
          :style="msg.sender?.id !== userInfo.id && 'margin-left:45px'">
          <img class="pointer" :src="msg.contents" @click="onClickImg(msg)" />
        </div>
        <div class="msg-video-container" v-else-if="msg.type === eChatType.VIDEO"
          :style="msg.sender?.id !== userInfo.id && 'margin-left:45px'">
          <video :src="msg.contents" width="320" height="240" controls />
        </div>

        <!-- <div v-if="msg.attached_files" v-for="file in msg.attached_files">
                  <img :src="file.url" style="height:150px; width:150px" />
                </div> -->
        <h4 class="ml5" v-if="msg.sender?.id !== userInfo.id">{{
          dmDateFormat(msg.created_at)
        }}</h4>
      </div>
    </li>
  </ul>

  <ClientOnly>
    <el-dialog v-model="opDeleteMsgModal" class="modal-area-type" width="380px">
      <div class="modal-alert">
        <dl class="ma-header">
          <dt> {{ t('leave.msg') }} </dt>
          <dd>
            <button class="pointer" @click="closeDeleteMsgModal">
              <IconClose />
            </button>
          </dd>
        </dl>
        <div class="ma-content">
          <h2>
            {{ t('leave.msg.alert') }}
          </h2>
          <div>
            <button class="btn-gray w48p" @click="onDeleteMsg">
              {{ $t('yes') }}
            </button>
            <button class="btn-default w48p" @click="closeDeleteMsgModal">
              {{ $t('no') }}
            </button>
          </div>
        </div>
      </div>
    </el-dialog>
  </ClientOnly>
</template>
<script setup lang="ts">
import { ElProgress, ElDialog, ElMessage } from 'element-plus';
import { PropType } from 'vue';
import { IMessage, eChatType } from '~~/types';
import { dmDateFormat } from '~~/scripts/utils'

const { t, locale } = useI18n()


const props = defineProps({
  msg: Object as PropType<IMessage>
})
const emit = defineEmits(['deleteMsg'])

const isMobile = computed(() => useCommon().common.value.isMobile)

const showMsgMenu = ref(false)
const opDeleteMsgModal = ref(false)

const userInfo = computed(() => useUser().user.value.info)

const msgContent = computed(() => {

  if (props.msg.sender.is_blocked) {
    return 'Blocked User'
  }
  return props.msg.contents
})

watch(
  () => useCommon().common.value.isPopState,
  (val) => {
    if (!val) {
      closeDeleteMsgModal()
    }
  })

function openMenu() {
  if (props.msg.sender.id === userInfo.value.id) {
    showMsgMenu.value = true
  }
}

function closeMenu() {
  showMsgMenu.value = false
}

function deleteMsg() {
  emit('deleteMsg', props.msg)

}

function openDeleteMsgModal() {
  opDeleteMsgModal.value = true
  if (isMobile.value) {
    useCommon().setPopState(true)
  }
}

function closeDeleteMsgModal() {
  opDeleteMsgModal.value = false
  if (isMobile.value) {
    useCommon().setPopState(false)
  }
}

</script>
<style scoped lang="scss"></style>