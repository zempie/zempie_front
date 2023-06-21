<template>
  <dl class="active-room-container">
    <dd>
      <UserAvatar :user="selectedRoom?.joined_users[0]" tag="p" />
    </dd>
    <dt>
      <div>
        <h2>{{ selectedRoom?.joined_users[0]?.name }}</h2>
        <p>@{{ selectedRoom?.joined_users[0]?.nickname }}</p>
      </div>
      <!-- <p>Online</p> -->
    </dt>
    <dd>
      <ClientOnly>
        <el-dropdown trigger="click" ref="msgRef">
          <button class="room-btn pointer"> <i class="uil uil-ellipsis-h font25"></i></button>
          <template #dropdown>
            <div class="more-list fixed" style="min-width: 150px">
              <a @click="opLeaveChatModal = true" id="editFeed" class="pointer">{{ t('remove.chat') }}</a>
            </div>
          </template>
        </el-dropdown>
      </ClientOnly>

      <!-- <router-link to="#"><i class="uil uil-ellipsis-h font25"></i></router-link> -->
    </dd>
  </dl>

  <div class="dlc-chat-content" ref="scrollContent">
    <div :class="msg.sender.id === userInfo.id ? 'receiver-chat' : 'sender-chat'" v-for="msg in msgList" ref="msgRef">
      <h4>{{ dateFormat(msg.created_at) }}</h4>
      <ul>
        <li class="flex">
          <DmMsgMenu :msg="msg" v-if="msg.sender.id === userInfo.id" @delete-msg="deleteMsg" />
          <span>{{ msg.contents }}</span>
        </li>
      </ul>
    </div>
  </div>
  <div class="dlc-send-message">
    <div>
      <!-- TODO: 태그 보낼 수 있어야함  -->
      <input v-model="inputMsg" type="text" class="w100p" name="" title="" :placeholder="$t('send.msg')"
        @keyup.enter="sendMsg" />
      <!-- TODO: 2차 스펙 -->
      <!-- <router-link to="#"><i class="uil uil-scenery font25 mr5"></i></router-link>
                <router-link to="#"><i class="uil uil-camera font28"></i></router-link> -->
    </div>
    <p><button @click="sendMsg"><img src="/images/send_icon.png" alt="" title="" /></button></p>
  </div>

  <ClientOnly>
    <el-dialog v-model="opLeaveChatModal" class="modal-area-type" width="380px">
      <div class="modal-alert">
        <dl class="ma-header">
          <dt>{{ t('leave.chat') }}</dt>
          <dd>
            <button @click="opLeaveChatModal = false">
              <i class="uil uil-times"></i>
            </button>
          </dd>
        </dl>
        <div class="ma-content">
          <h2>
            {{ t('leave.chat.alert') }}
          </h2>
          <div>
            <button class="btn-gray w48p" @click="leaveChat">
              {{ $t('yes') }}
            </button>
            <button class="btn-default w48p" @click="opLeaveChatModal = false">
              {{ $t('no') }}
            </button>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog v-model="opDeleteMsgModal" class="modal-area-type" width="380px">
      <div class="modal-alert">
        <dl class="ma-header">
          <dt> {{ t('leave.msg') }} </dt>
          <dd>
            <button class="pointer" @click="opDeleteMsgModal = false">
              <i class="uil uil-times"></i>
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
            <button class="btn-default w48p" @click="opDeleteMsgModal = false">
              {{ $t('no') }}
            </button>
          </div>
        </div>
      </div>
    </el-dialog>
  </ClientOnly>
</template>
<script setup lang="ts">
import _ from 'lodash'
import { dateFormat } from '~~/scripts/utils'
import { IChat, IMessage, IUser } from '~~/types'
import { ElDropdown, ElDialog, ElMessage } from 'element-plus';
import { PropType } from 'vue';

const props = defineProps({
  selectedRoom: Object as PropType<IChat>,
})

const { t, locale } = useI18n()

const MAX_MSG_LIMIT = 15
const msgRef = ref()
const inputMsg = ref('')
const msgList = ref()

const fromId = ref(0)
const msgLimit = ref(MAX_MSG_LIMIT)
const isAddData = ref(false)

const opLeaveChatModal = ref(false)
const opDeleteMsgModal = ref(false)
const deleteTgMsg = ref()

const scrollContent = ref()

const userInfo = computed(() => useUser().user.value.info)
const msgPolling = ref(null)


//중복호출 방지
const isSending = ref(false)

const emit = defineEmits(['deletedRoom'])

defineExpose({ addMsg })



onMounted(async () => {
  //FIXME : 마이너스로 넘어오는 경우가 있어서 우선은 이렇게 처리
  if (props.selectedRoom.unread_count <= 0) {
    fromId.value = props.selectedRoom.last_message?.id - MAX_MSG_LIMIT + 1
  }
  await getMessages()
  // isAddData.value = true
  if (!userInfo.value.setting.dm_alarm) {
    msgPolling.value = setInterval(async () => {
      const newest = msgList.value[msgList.value.length - 1]
      fromId.value = newest.id + 1
      const newMsg = await msgFetch()
      if (newMsg.length) {
        fromId.value = newMsg[newMsg.length - 1].id
        // scrollToBottom()
      }
    }, 3000)
  }

  nextTick(() => {
    if (props.selectedRoom.unread_count <= 0) {
      // 읽을 메세지가 없는 경우 스크롤 맨 하단
      scrollToBottom()
    }
  })

})


onBeforeUnmount(() => {
  clearInterval(msgPolling.value)
})

function scrollToBottom() {
  scrollContent.value.scrollTop = scrollContent.value?.scrollHeight
}



async function getMessages() {

  const payload = {
    from_id: fromId.value,
    limit: msgLimit.value,
    order: 'asc'
  }

  const { data, error } = await useCustomAsyncFetch<{ messages: IMessage[] }>(createQueryUrl(`/chat/room/${props.selectedRoom.id}`, payload), getComFetchOptions('get', true))

  //TODO: 로딩 넣어야함

  if (data.value) {
    const { messages } = data.value

    if (isAddData.value) {
      if (messages.length > 0) {
        msgList.value = [...msgList.value, ...messages]
      } else if (messages.length === 0) {
        isAddData.value = false
      }
    }
    else {
      msgList.value = messages
      isAddData.value = true
    }
    return messages
  }

}

async function msgFetch() {
  const payload = {
    from_id: fromId.value,
    limit: msgLimit.value,
    order: 'asc'
  }

  const { data, error } = await useCustomAsyncFetch<{ messages: IMessage[] }>(createQueryUrl(`/chat/room/${props.selectedRoom.id}`, payload), getComFetchOptions('get', true))

  if (data.value) {
    const { messages } = data.value
    if (messages.length > 0) {
      msgList.value = [...msgList.value, ...messages]
    }
    return messages
  }
}

async function sendMsg() {
  if (!inputMsg.value) return
  if (isSending.value) return
  isSending.value = true

  const content = _.cloneDeep(inputMsg.value)
  inputMsg.value = ''

  const payload = {
    room_id: props.selectedRoom.id,
    // receiver_ids: [
    //   userInfo.value.id
    // ],
    type: 0,
    contents: content
  }

  const { data, error } = await useCustomAsyncFetch<{ message: IMessage }>(`/chat/room`, getComFetchOptions('post', true, payload))

  if (data.value) {
    initInputMsg()
    if (msgList.value?.length) {
      addMsg(data.value.message)
    } else {
      msgList.value = [data.value.message]
    }
  } else if (error.value) {
    inputMsg.value = content
  }

  isSending.value = false
}

function addMsg(msg) {
  msgList.value = [...msgList.value, msg]

  nextTick(() => {
    scrollToBottom()
  })
}

function initInputMsg() {
  inputMsg.value = ''
}

function deleteMsg(msg: IMessage) {

  opDeleteMsgModal.value = true
  deleteTgMsg.value = msg
}

async function leaveChat() {

  try {
    const { data, error } = await useCustomAsyncFetch<{ message: IMessage }>(`/chat/rooms/${props.selectedRoom.id}`, getComFetchOptions('delete', true))

    if (data.value) {
      emit('deletedRoom', props.selectedRoom)
    }
  } finally {
    opLeaveChatModal.value = false

  }




}


async function onDeleteMsg() {

  try {
    const { data, error } = await useCustomAsyncFetch(`/chat/room/${deleteTgMsg.value.id}`, getComFetchOptions('delete', true))
    if (data.value) {
      msgList.value = msgList.value.filter((elem) => {
        return elem.id !== deleteTgMsg.value.id
      })
    }

  } catch (error) {
    ElMessage.error(error.message)
  }
  finally {
    opDeleteMsgModal.value = false
    deleteTgMsg.value = null
  }
}

</script>