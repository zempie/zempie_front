<template>
  <dl class="active-room-container">
    <dd>
      <UserAvatar :user="selectedRoom?.joined_users[0]" tag="p" :hasRouter="selectedRoom.is_group_room ? false : true" />
    </dd>
    <dt>
      <div>
        <h2 v-if="isMobile" class="font16 text-bold fontColor-black" @click="opJoinedUserModal = true"> {{
          getJoinedUserName(selectedRoom) }}
        </h2>
        <CommonDropdown v-else :is-custom-btn="true" ref="memDropdownRef" style="width:auto">
          <template #btn>
            <h2 class="font16 text-bold fontColor-black" @click="memDropdownRef.toggleDropdown"> {{
              getJoinedUserName(selectedRoom) }}
            </h2>
          </template>

          <template #options>
            <UserOdList :users="selectedRoom.joined_users" />
          </template>
        </CommonDropdown>

        <p v-if="!selectedRoom.is_group_room">{{ selectedRoom?.joined_users[0]?.name }}</p>
      </div>
    </dt>
    <!-- <DmSearchMsg :room_id="selectedRoom.id" @searchMsg="searchMsg" /> -->
    <dd>
      <DmChatMenu :selectedRoom="selectedRoom" @deleted-room="$emit('deletedRoom', props.selectedRoom)"
        @update-group-name="(roomName) => $emit('updateGroupName', roomName)" />
    </dd>
  </dl>
  <div class="dlc-chat-content">
    <div class="inner" ref="scrollContent">
      <div :class="msg.sender?.id === userInfo.id ? 'receiver-chat' : 'sender-chat'" v-for="( msg, index ) in  msgList "
        :ref="el => { divs[msg.id] = el }" :key="index">
        <template v-if="msg?.chat_idx !== -1">
          <DmMessage :msg="msg" @delete-msg="deleteMsg" />
        </template>
      </div>
    </div>
  </div>


  <div class="dlc-send-message column">
    <div v-if="attr && attr[0]?.type === eChatType.VIDEO" class=" video-container w100p flex mb30">
      <VideoPreview :videos="attr" @delete-video="deleteVideo" />
    </div>
    <!-- TODO: 음성녹음 -->
    <!-- <div class="msg-record-container flex items-center content-cent" v-else-if="recorderRef?.formattedRecordingTime">
      <i class="uil uil-play font20 mr10 zem-color"></i>
      <el-progress :percentage="recordingProgressPercentage">
        <span class="font15 ml10"> {{ recorderRef?.formattedRecordingTime }}</span>
      </el-progress>
    </div> -->

    <div class="img-container" v-else-if="attr && attr[0]?.type === eChatType.IMAGE">
      <ImageSwiperPreview :images="attr" @deleteImage="deleteImage" />
    </div>
    <div class="flex row msg-container">
      <!-- TODO: 태그 보낼 수 있어야함, 음성녹음 코덱 처리하고  -->
      <div class="input-container">
        <input v-model="inputMsg" type="text" class="w100p" name="" title="" :placeholder="$t('send.msg')"
          @keyup.enter="onSubmitMsg" @focus="onFocus" @blur="onBlur" ref="inputRef" />
        <ImageUploader @uploadImage="uploadImage" ref="imgUploaderRef" class="dm-uploader-btn" />
        <VideoUploader @uploadVideo="uploadVideo" ref="videoUploaderRef" class="dm-uploader-btn" />
        <!-- <DmRecorder @uploadRecord="uploadRecord" ref="recorderRef" class="dm-uploader-btn" /> -->

      </div>
      <button @click="onSubmitMsg"><img src="/images/send_icon.png" alt="" title="" /></button>
    </div>
  </div>
  <ClientOnly>

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
    <el-dialog v-model="opJoinedUserModal" class="modal-area-type" width="380px" :fullscreen="true">
      <div class="modal-alert">
        <dl class="ma-header">
          <!-- <UserOdList :users="selectedRoom.joined_users" /> -->
          <dt> {{ t('joined.users') }} </dt>
          <dd>
            <button class="pointer" @click="opJoinedUserModal = false">
              <i class="uil uil-times"></i>
            </button>
          </dd>
        </dl>
        <div class="ma-content">
          <ul class="user-list" ref="userListEl">
            <UserOdList :users="selectedRoom.joined_users" />
          </ul>
        </div>
      </div>
    </el-dialog>

    <ImageOriginModal :imgInfo="activeMsg" :open-modal="showOriginImg" @close-modal="showOriginImg = false" />

  </ClientOnly>
</template>
<script setup lang="ts">
import _ from 'lodash'
import { IChat, IMessage, IUser, eChatType } from '~~/types'
import { ElProgress, ElDialog, ElMessage } from 'element-plus';
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
const inputRef = ref(null)
const msgList = ref<IMessage[]>()

const fromId = ref(0)
const msgLimit = ref(MAX_MSG_LIMIT)
const isAddData = ref(false)
const order = ref('desc')
const offset = ref(0)

const opDeleteMsgModal = ref(false)
const deleteTgMsg = ref()

const scrollContent = ref<HTMLElement | null>(null)
const msgPolling = ref(null)
const totalMsgCnt = ref(0)
const showOriginImg = ref(false)
const activeMsg = ref()

const attr = ref()
const imgUploaderRef = ref()
const videoUploaderRef = ref()
const recorderRef = ref()

const memDropdownRef = ref()
const opJoinedUserModal = ref()


const userInfo = computed(() => useUser().user.value.info)
const isFbSupported = computed(() => useCommon().setting.value.isFbSupported)
const isFlutter = computed(() => useMobile().mobile.value.isFlutter)
const unreadStartId = computed(() => props.selectedRoom.unread_start_id)
const isMobile = computed(() => useCommon().common.value.isMobile)


//pages > dm > list에서 provide됨 
const { getJoinedUserName } = inject('joinedUser')


const lastMsg = computed({
  get() {
    return props.selectedRoom.last_message
  },
  set(value) {
    props.selectedRoom.last_message = value;
  }
})

const isLastMsg = computed(() => {

  console.log(msgList.value.at(-1).id, lastMsg.value.id)
  if (msgList.value) {
    return msgList.value.at(-1).id === lastMsg.value.id
  }
})

const recordingProgressPercentage = computed(() => {
  return (recorderRef.value?.recordingDuration / 600) * 100; // 600 seconds (10 minutes)
});


//중복 클릭 방지용
let msgAcceessableCnt = 2

const isSending = ref(false)

//스크롤
const { arrivedState, y } = useScroll(scrollContent, {
  offset: { top: 20, bottom: 10 }
})
const { top, bottom } = toRefs(arrivedState)

const emit = defineEmits(['deletedRoom', 'updateGroupName', 'openKeyboard', 'closeKeyboard', 'updateLastMsg'])

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
  await useUser().getUnreadMsg()

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
    }, 5000)
  }

  if (props.selectedRoom.unread_count <= 0) {
    // 읽을 메세지가 없는 경우 스크롤 맨 하단
    scrollToBottom()
  }

})


onBeforeUnmount(() => {
  clearInterval(msgPolling.value)
})


const newMsg = ((messages: IMessage[]) => {
  return messages.filter((msg: IMessage) => !msgList.value.some(existingMsg => existingMsg.id === msg.id))
})


function scrollToBottom() {
  if (scrollContent.value)
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
      lastMsg.value = messages[messages.length - 1]
    }
    if (order.value === 'asc') {
      if (messages.length > 0) {
        if (msgList.value?.length) {
          msgList.value = [...msgList.value, ...newMsg(messages)]
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
  scrollContent.value.scrollTop = scrollContent.value?.scrollHeight - yPos

}

async function onSubmitMsg() {

  // if (isSending.value) return
  isSending.value = true

  const receiver_ids = props.selectedRoom.joined_users.map((user) => {
    return user.id
  })

  const payload = {
    room_id: props.selectedRoom.id,
    receiver_ids,
    type: eChatType.TEXT,
    contents: '',
  }



  //첨부파일이 있는경우 첨부파일 갯수만큼 보내고 텍스트도 보내야함
  if (attr.value) {
    if (attr.value.type?.includes('audio')) {
      const audio = await recorderRef.value.fetchRecord()
    }


    else if (attr.value[0].type === eChatType.VIDEO) {
      const prevMsg = { id: props.selectedRoom.last_message.id + 1, room_id: props.selectedRoom.id, contents: attr.value[0].url, sender: userInfo.value, type: eChatType.VIDEO, created_at: Date.now() }
      //optimistic ui
      addMsg(prevMsg)

      const videoUrls = await videoUploaderRef.value.fetchVideo()
      console.log(videoUrls)
      for (const video of videoUrls) {

        payload.contents = video.url
        payload.type = eChatType.VIDEO
        await sendMsg(payload)
        isSending.value = false
      }
    }

    else if (attr.value[0].type === eChatType.IMAGE) {


      for (const [index, img] of attr.value.entries()) {
        const prevMsg = { id: props.selectedRoom.last_message.id + 1 + index, room_id: props.selectedRoom.id, contents: img.url, sender: userInfo.value, type: eChatType.IMAGE, created_at: Date.now() }
        //optimistic ui
        addMsg(prevMsg)
      }

      const imgUrls = await imgUploaderRef.value.fetchImage()
      for (const img of imgUrls) {
        payload.contents = img.url
        payload.type = eChatType.IMAGE
        await sendMsg(payload)
        isSending.value = false

      }
    }
  }


  //빈 텍스트는 보내지 않음
  if (!inputMsg.value) return


  payload.contents = _.cloneDeep(inputMsg.value)
  payload.type = eChatType.TEXT
  sendMsg(payload)

  inputMsg.value = ''

  isSending.value = false
}

async function sendMsg(payload: any) {

  const content = _.cloneDeep(inputMsg.value)
  if (payload.type === eChatType.TEXT) {

    const prevMsg = { id: msgList.value.at(-1).id + 1, room_id: props.selectedRoom.id, contents: content, sender: userInfo.value, type: payload.type, created_at: Date.now() }

    //optimistic ui
    addMsg(prevMsg)
  }


  const { data, error } = await useCustomAsyncFetch<{ message: IMessage }>(`/chat/room`, getComFetchOptions('post', true, payload))

  if (data.value) {
    if (msgList.value?.length) {
      addMsg(data.value.message)

    } else {
      msgList.value = [data.value.message]
    }
    attr.value = undefined
    lastMsg.value = data.value.message

  } else if (error.value) {

    inputMsg.value = content
    ElMessage({
      message: t('fail.send.msg'),
      type: 'error',
    })
  }
}



function addMsg(msg: IMessage) {
  emit('updateLastMsg', msg)

  if (msgList.value && msgList.value.length) {
    msgList.value = [...msgList.value, ...newMsg([msg])]

  } else {
    msgList.value = [msg]
  }

  nextTick(() => {
    scrollToBottom()
  })
}

function deleteMsg(msg: IMessage) {
  msgList.value = msgList.value.filter((elem) => {
    return elem.id !== msg.id
  })

}
function initInputMsg() {
  inputMsg.value = ''
}


async function onFocus() {
  inputRef.value.scrollIntoView({ behavior: 'smooth', block: 'center' });
  if (isFlutter.value) {
    const kbHeight = await FlutterBridge().getKeyHight()
    emit('openKeyboard', Number(kbHeight))
  }
}
function onBlur() {
  if (isFlutter.value) {

    emit('closeKeyboard')
  }

}

async function onUnBlockUser() {
  await useUser().blockUser(props.selectedRoom?.joined_users[0].id)
    .then(() => {

    })
}


function searchMsg(msg) {
  console.log(msg)

}

function uploadImage(images) {
  attr.value = images
}

function deleteImage(idx: number) {
  imgUploaderRef.value.deleteImage(idx)
}

function onClickImg(msg: IMessage) {

  activeMsg.value = {
    url: msg.contents,
    user: msg.sender,
    created_at: msg.created_at
  }

  showOriginImg.value = true
}

function uploadVideo(video) {

  attr.value = video

}

function uploadRecord(record) {
  console.log('rec', record)
  attr.value = record
}

</script>