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
        <el-dropdown trigger="click">
          <button class=" room-btn pointer"> <i class="uil uil-ellipsis-h font25"></i></button>
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
  <div class="dlc-chat-content">
    <div class="inner" ref="scrollContent">
      <div :class="msg.sender.id === userInfo.id ? 'receiver-chat' : 'sender-chat'" v-for="(msg, index) in msgList"
        :ref="el => { divs[msg.id] = el }" :key="index">
        <h4>{{ dateFormat(msg.created_at) }}</h4>
        <ul>
          <li class="flex" style="overflow:auto; word-break: break-all; max-width: 100%; ">
            <DmMsgMenu :msg="msg" v-if="msg.sender.id === userInfo.id" @delete-msg="deleteMsg"
              style="max-height: 100px;" />
            <span>{{ msg.contents }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div class="dlc-send-message">
    <div>
      <!-- TODO: 태그 보낼 수 있어야함  -->
      <input v-model="inputMsg" type="text" class="w100p" name="" title="" :placeholder="$t('send.msg')"
        @keyup.enter="sendMsg" @focus="onFocus" @blur="onBlur" />
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
import _, { now } from 'lodash'
import { dateFormat } from '~~/scripts/utils'
import { IChat, IMessage, IUser } from '~~/types'
import { ElDropdown, ElDialog, ElMessage, linkEmits } from 'element-plus';
import { PropType } from 'vue';
import { useInfiniteScroll, useScroll } from '@vueuse/core'
import FlutterBridge from '~~/scripts/flutterBridge'

const props = defineProps({
  selectedRoom: Object as PropType<IChat>,
})

const { t, locale } = useI18n()

const MAX_MSG_LIMIT = 15
const MAX_INPUT_LIMIT = 5000
const msgEl = ref<HTMLElement | null>(null)
const divs = ref([])

const inputMsg = ref('')
const msgList = ref<IMessage[]>()

const fromId = ref(0)
const msgLimit = ref(MAX_MSG_LIMIT)
const isAddData = ref(false)
const order = ref('desc')
const offset = ref(0)

const opLeaveChatModal = ref(false)
const opDeleteMsgModal = ref(false)
const deleteTgMsg = ref()

const scrollContent = ref<HTMLElement | null>(null)
const msgPolling = ref(null)
const totalMsgCnt = ref(0)

const userInfo = computed(() => useUser().user.value.info)
const isFbSupported = computed(() => useCommon().setting.value.isFbSupported)
const isFlutter = computed(() => useMobile().mobile.value.isFlutter)
const unreadStartId = computed(() => props.selectedRoom.unread_start_id)


const lastMsg = computed({
  get() {
    return props.selectedRoom.last_message
  },
  set(value) {
    props.selectedRoom.last_message = value;
  }
})

const isLastMsg = computed(() => {
  if (props.selectedRoom?.meta?.isLastMsg) {
    return true
  }
  if (msgList.value) {
    console.log(msgList.value, props.selectedRoom)
    return msgList.value[msgList.value?.length - 1].id === lastMsg.value.id
  }
})


//중복 클릭 방지용
let msgAcceessableCnt = 2

const isSending = ref(false)

//스크롤
const { arrivedState, y } = useScroll(scrollContent, {
  offset: { top: 20, bottom: 10 }
})
const { top, bottom } = toRefs(arrivedState)

const emit = defineEmits(['deletedRoom', 'openKeyboard', 'closeKeyboard'])

defineExpose({ addMsg })

watch(
  () => top.value,
  async (val) => {
    if (val) {
      colorLog('watch top', 'yellow')
      if (msgList.value && msgList.value[0].chat_idx === 0) return
      if (msgList.value.length) {
        if (msgList.value[0].id === 0) return
        offset.value += MAX_MSG_LIMIT
        order.value = 'desc'
        const prevScroll = _.cloneDeep(scrollContent.value?.scrollHeight)
        await msgFetch()
        scrollToPrev(prevScroll)

      }
    }
  }
)



watch(
  () => bottom.value,
  async (val) => {
    if (val) {
      colorLog('watch bottom', 'yellow')
      console.log('isLastMsg.value', isLastMsg.value)
      if (isLastMsg.value) return

      if (msgList.value.length) {
        offset.value += MAX_MSG_LIMIT
        order.value = 'asc'
        await msgFetch()

      }
    }
  }
)



onMounted(async () => {
  if (props.selectedRoom.unread_count) {
    if (props.selectedRoom.unread_count > msgLimit.value) {
      offset.value = props.selectedRoom.unread_count - msgLimit.value
    }
    order.value = 'desc'
  }

  await msgFetch()

  nextTick(() => {
    if (props.selectedRoom.unread_count < msgLimit.value) {
      // 읽을 메세지가 없는 경우 스크롤 맨 하단
      scrollToBottom()
    } else {
      divs.value[unreadStartId.value].scrollIntoView()
    }
  })


  if (!userInfo.value.setting.dm_alarm || !isFbSupported.value || !useCommon().setting.value.isNotiAllow) {
    clearInterval(msgPolling.value)

    msgPolling.value = setInterval(async () => {
      order.value = 'asc'
      const newMessage = await msgFetch(totalMsgCnt.value)
      if (newMessage && newMessage.length) {
        scrollToBottom()
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



async function msgFetch(customOffset?: number) {
  if (isSending.value) return

  const payload = {
    offset: customOffset ? customOffset : offset.value,
    limit: msgLimit.value,
    order: order.value
  }

  const { data, error } = await useCustomAsyncFetch<{ result: IMessage[], totalCount: number }>(createQueryUrl(`/chat/room/${props.selectedRoom.id}`, payload), getComFetchOptions('get', true))

  if (data.value) {
    const { result: messages, totalCount } = data.value
    totalMsgCnt.value = totalCount

    if (customOffset && messages.length) {
      console.log('possling new message')
      lastMsg.value = messages[messages.length - 1]
    }
    if (order.value === 'asc') {
      if (messages.length > 0) {
        if (msgList.value?.length) {
          msgList.value = [...msgList.value, ...messages]
        } else {
          msgList.value = messages
        }
      }

    } else {
      if (messages.length > 0) {
        if (msgList.value?.length) {
          msgList.value = [...newMsg(messages.reverse()), ...msgList.value]
        } else {
          msgList.value = messages.reverse()
        }
      }
    }

    return messages
  }

}

function scrollToPrev(yPos: number) {
  console.log(yPos)
  scrollContent.value.scrollTop = scrollContent.value?.scrollHeight - yPos

}

async function sendMsg() {
  // console.log(isSending.value)
  if (isSending.value) return
  if (!inputMsg.value) return
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

function addMsg(msg: IMessage) {
  if (msgList.value && msgList.value.length) {
    msgList.value = [...msgList.value, ...newMsg([msg])]

  } else {
    msgList.value = [msg]
  }

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

async function onFocus() {
  if (isFlutter.value) {
    const kbHeight = await FlutterBridge().getKeyHight()
    console.log('kbHeight', kbHeight)
    emit('openKeyboard', Number(kbHeight))
  }
}
function onBlur() {
  console.log('onBlur')
  if (isFlutter.value) {

    emit('closeKeyboard')
  }

}
</script>