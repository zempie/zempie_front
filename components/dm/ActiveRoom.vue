<template>
  <dl>
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
              <a @click="opLeaveChatModal = true" id="editFeed" class="pointer">채팅 삭제</a>
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
      <input v-model="inputMsg" type="text" class="w100p" name="" title="" placeholder="메시지 보내기" @keyup.enter="sendMsg" />
      <!-- TODO: 2차 스펙 -->
      <!-- <router-link to="#"><i class="uil uil-scenery font25 mr5"></i></router-link>
                <router-link to="#"><i class="uil uil-camera font28"></i></router-link> -->
    </div>
    <p><button><img src="/images/send_icon.png" alt="" title="" /></button></p>
  </div>

  <ClientOnly>
    <el-dialog v-model="opLeaveChatModal" class="modal-area-type" width="380px">
      <div class="modal-alert">
        <dl class="ma-header">
          <dt>대화 나가기</dt>
          <dd>
            <button @click="opLeaveChatModal = false">
              <i class="uil uil-times"></i>
            </button>
          </dd>
        </dl>
        <div class="ma-content">
          <h2>
            나가기를 하면 대화 내용이 모두 삭제되고 목록에서도 삭제됩니다.
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
          <dt>메시지 나가기</dt>
          <dd>
            <button class="pointer" @click="opDeleteMsgModal = false">
              <i class="uil uil-times"></i>
            </button>
          </dd>
        </dl>
        <div class="ma-content">
          <h2>
            이 작업은 해당 메시지를 모든 사람에게서 삭제됩니다.
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
import { dateFormat } from '~~/scripts/utils'
import { IChat, IMessage, IUser } from '~~/types'
import { ElDropdown, ElDialog, ElMessage } from 'element-plus';
import { PropType } from 'vue';

const props = defineProps({
  selectedRoom: Object as PropType<IChat>,
})

const { t, locale } = useI18n()

const msgRef = ref()
const inputMsg = ref('')
const msgList = ref()

const fromId = ref(0)
const msgLimit = ref(15)

const opLeaveChatModal = ref(false)
const opDeleteMsgModal = ref(false)
const deleteTgMsg = ref()

const scrollContent = ref()

const userInfo = computed(() => useUser().user.value.info)

const emit = defineEmits(['deletedRoom'])

defineExpose({ addMsg })



onMounted(async () => {
  //FIXME : 마이너스로 넘어오는 경우가 있어서 우선은 이렇게 처리
  if (props.selectedRoom.unread_count <= 0) {
    fromId.value = props.selectedRoom.last_message?.id - 15
  }
  await getMessages()

  nextTick(() => {
    if (props.selectedRoom.unread_count <= 0) {
      // 읽을 메세지가 없는 경우 스크롤 맨 하단
      scrollToBottom()
    }
  })

})

function scrollToBottom() {
  scrollContent.value.scrollTop = scrollContent.value.scrollHeight
}

async function getMessages() {

  const payload = {
    // from_id: fromId.value,
    // limit: msgLimit.value,
    order: 'asc'
  }

  const { data, error } = await useCustomAsyncFetch<{ messages: IMessage[] }>(createQueryUrl(`/chat/room/${props.selectedRoom.id}`, payload), getComFetchOptions('get', true))

  //TODO: 로딩 넣어야함

  if (data.value) {
    const { messages } = data.value
    msgList.value = messages
  }

}


async function sendMsg() {
  if (!inputMsg.value) return
  const payload = {
    room_id: props.selectedRoom.id,
    // receiver_ids: [
    //   userInfo.value.id
    // ],
    type: 0,
    contents: inputMsg.value
  }

  const { data, error } = await useCustomAsyncFetch<{ message: IMessage }>(`/chat/room`, getComFetchOptions('post', true, payload))

  if (data.value) {
    initInputMsg()
    if (msgList.value?.length) {
      msgList.value = [...msgList.value, data.value.message]
    } else {
      msgList.value = [data.value.message]
    }
  }
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
<style scoped lang="scss">
.room-btn {
  background: none;
  border: none;
}

.dlc-chat-content {
  li {
    &:hover {
      ::v-deep(.msg-menu-btn) {
        display: block;
        cursor: pointer;

      }
    }

    ::v-deep(.msg-menu-btn) {
      display: none;
      background: none;
      border: none;
    }

  }
}


.dlc-send-message {
  div {
    justify-content: space-between;
  }

  button {
    display: inline-block;
    width: 50px;
    height: 50px;
    text-align: center;
    border-radius: 8px;
    background: #f4f0eb;
    border: none;
    cursor: pointer;

    &:hover {
      background: #f1f1f1;
    }
  }
}
</style>