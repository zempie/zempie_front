<template>
  <div class="content">
    <div class="dm-list">
      <div class="dl-title">
        <div>
          <h2> <button :class="['mobile-btn', selectedRoom ? 'on' : 'off']" @click="initSelect"><i
                class="uil uil-arrow-left"></i></button> {{
                  $t('dm') }}</h2>
        </div>
        <p>
          <a :class="['pointer new-msg-btn-icon', { 'inactive': roomPending }]" @click="showNewMsg"><i
              class="uil uil-comment-alt-plus"></i> </a>
          <NuxtLink :to="$localePath(`/myaccount`)"><i class="uil uil-setting"></i> </NuxtLink>
        </p>
      </div>

      <dl class="dl-content">
        <dd :class="['room-container', selectedRoom ? 'off' : 'on']">
          <!-- <DmSearchMsg @searchMsg="updateRooms" /> -->
          <!-- <DmVoiceCalling /> -->
          <ul v-if="roomPending">
            <li v-for="i in 7">
              <dl>
                <dd>
                  <UserAvatarSk tag="p" />
                </dd>
                <dt class="ml5">
                  <h3 class="grey-text w50p skeleton-animation">
                  </h3>
                  <p class="grey-text skeleton-animation"></p>
                </dt>
                <dd>
                </dd>
              </dl>
            </li>
          </ul>
          <template v-else>
            <ul v-if="roomList" class="msg-list" ref="msgEl">
              <!-- <el-scrollbar tag="ul" wrap-class="msg-list" height="650px"> -->
              <li v-for="room in roomList" :key="room.id" @click="onClickRoom(room)"
                :class="{ active: room?.id === selectedRoom?.id }">
                <dl>
                  <dd v-if="room.is_group_room" style="position: relative; top:-10px">
                    <UserAvatar class="mr10" :user="room.joined_users[0]" tag="p" :hasRouter="true" />
                    <UserAvatar class="mr10" :user="room.joined_users[1]" tag="p" :hasRouter="true"
                      style="position: absolute; top:15px; left:10px" />
                  </dd>
                  <dd v-else>
                    <UserAvatar class="mr10" :user="room.joined_users[0]" tag="p" :hasRouter="true" />
                  </dd>
                  <dt class="dm-info-box">
                    <h3>{{ getJoinedUserName(room) }}</h3>
                    <p v-if="room?.last_message?.type === eChatType.IMAGE">{{ $t('dm.sent.img') }}</p>
                    <p v-else-if="room?.last_message?.type === eChatType.TEXT">{{ room?.last_message?.contents }}</p>
                  </dt>
                  <dd>
                    <h4 class="font12"><i class="uis uis-clock" style="color:#c1c1c1;"></i>
                      {{ dmDateFormat(room.last_chat_at ? room.last_chat_at : room.created_at) }} </h4>
                    <span v-if="room.unread_count > 0">{{ room.unread_count }}</span>
                  </dd>
                </dl>
              </li>
            </ul>
            <ul v-else class="flex items-center content-center">
              {{ $t('no.msg') }}
            </ul>
          </template>
        </dd>
        <dt :class="['flex column msg-container', selectedRoom ? 'on' : 'off']" ref="activeMsgRef">
          <DmActiveRoom v-if="selectedRoom" :selectedRoom="selectedRoom" @deleted-room="onDeletedRoom"
            @open-keyboard="openkeyboard" @update-last-msg="updateLastMsg" @close-keyboard="closeKeyboard"
            :key="componentKey" @update-group-name="updateGroupName" ref="activeRoomRef" />
          <div v-else class="dlc-chat-emptied">
            <p><i class="uil uil-comment-alt-dots" style="font-size:40px; color:#fff;"></i></p>
            <h2> {{ $t('no.selected.msg') }} </h2>
            <h3> {{ $t('new.msg.info') }} </h3>
            <div><button @click="showNewMsg" :class="['btn-default new-msg-btn', { 'inactive': roomPending }]"
                style="width:100%;">{{ $t('new.msg') }}</button></div>
          </div>
        </dt>
      </dl>
    </div>
    <ClientOnly>
      <el-dialog v-model="openNewMsg" class="modal-area-type new-msg-modal" :show-close="false" width="450px"
        @close="closeModal" :fullscreen="isFullScreen">
        <div class="modal-alert">
          <dl class="ma-header">
            <dt>{{ t('new.message') }}</dt>
            <dd>
              <button class="pointer" @click="openNewMsg = false">
                <i class="uil uil-times"></i>
              </button>
            </dd>
          </dl>
          <div class="ma-content">
            <div class="input-search-default mt0" @input="onInputUser">
              <p><i class="uil uil-search"></i>
              </p>
              <div class="mt0">
                <CommonChipInput ref="chipRef" @currChip="getCurrChip" class="mt0">
                  <template #input>
                    <input class="chip-input" v-model="userKeyword" type="text" name="" title="keywords"
                      :placeholder="$t('enter.keyword')" @blur="saveChip" @keyup.enter="saveChip"
                      @keydown.delete="backspaceDelete" />
                  </template>
                </CommonChipInput>
              </div>
            </div>
            <ul v-if="followPending" class="user-list" ref="userListRef">
              <li>
                <dl class="row">
                  <dd class="mr10">
                    <UserAvatarSk tag="p" style="width:45px; height: 45px;" />
                  </dd>
                  <dt class="w100p">
                    <h3 class="grey-text w50p skeleton-animation"></h3>
                    <p class="grey-text mt10 skeleton-animation"></p>
                  </dt>
                </dl>
              </li>
            </ul>
            <ul v-else-if="!followPending && !findUserPending" class="user-list">
              <UserOdList v-if="userList?.length" :users="userList" @onClickUser="onClickUser" />
              <li v-else>
                {{ $t('not.found.user') }}
              </li>
            </ul>
            <ul v-if="findUserPending" class="flex row content-center">
              <ClipLoader color='#ff6e17' size="20px" />
            </ul>
            <!-- selectedUsers -->
            <button :class="[selectedUsers ? 'btn-default' : 'inactive-btn', 'mt20 w100p']" @click="startChat">{{
              $t('chatting') }}</button>
          </div>
        </div>
      </el-dialog>
    </ClientOnly>
  </div>
</template>
<script setup lang="ts">
import { ElScrollbar, ElDialog, rowProps, ElMessage } from 'element-plus'
import { dmDateFormat } from '~~/scripts/utils'
import { IChat, IMessage, IUser, eChatType } from '~~/types'
import { debounce } from '~~/scripts/utils'
import { useInfiniteScroll } from '@vueuse/core'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import { onBeforeRouteLeave } from 'vue-router';


const CHAT_LIMIT = 10
const DISPLAY_USER_LIMIT = 2

const route = useRoute()
const { $localePath } = useNuxtApp()
const { t } = useI18n()

const userInfo = computed(() => useUser().user.value.info)

const router = useRouter()
const dmDropdown = ref()
const roomList = ref<IChat[]>()
const selectedMsg = ref<IMessage>()
const selectedRoom = ref<IChat>()
const activeRoomRef = ref()
const dmKeyword = ref('')

const inputMsg = ref('')

const openNewMsg = ref(false)
const userKeyword = ref('')
const chipRef = ref()
const userList = ref<IUser[]>()
const selectedUsers = ref()

const msgList = ref<IMessage[]>()

const roomPending = ref(true)
const followPending = ref(true)
const findUserPending = ref(false)
const msgEl = ref<HTMLElement | null>(null)
const userListRef = ref<HTMLElement | null>(null)
const fromId = ref(0)
const isAddData = ref()
const offset = ref(0)

const activeMsgRef = ref()

const isFlutter = computed(() => useMobile().mobile.value.isFlutter)

// 초기데이터 저장용
const followingList = computed(() => userList.value)

//polling
const roomPolling = ref(null)

//반응형
const isFullScreen = ref(false)

const componentKey = ref(0);

const isMobile = computed(() =>
  window.matchMedia('screen and (max-width: 767px)')
)
const isFbSupported = computed(() => useCommon().setting.value.isFbSupported)


const totalRoomCnt = ref(0)


let createRoomCount = 2


definePageMeta({
  title: 'dm',
  name: 'dm',
  middleware: 'auth',
  layout: 'header-only',
})

useInfiniteScroll(
  msgEl,
  async () => {
    if (isAddData.value) {
      // fromId.value = roomList.value[roomList.value.length - 1].id + 1
      offset.value += CHAT_LIMIT
      await fetch(true)
    }
  },
  { distance: 10 }
)


watch(
  () => useAlarm().alarm.value.newDm,
  async (val) => {
    if (val) {
      const meta = JSON.parse(val.data.meta)
      const roomId = Number(meta.room.id)
      if (meta) {
        if (selectedRoom.value?.id === roomId) {
          activeRoomRef.value.addMsg(meta.chat)
        } else {
          const existRoom = roomList.value.filter((room) => {
            if (room.id === roomId) {
              return room
            }
          })

          if (existRoom.length) {
            roomList.value = roomList.value.map((room) => {
              if (room.id === roomId) {
                return {
                  ...room,
                  unread_count: increaseUnreadCount(room.unread_count),
                  last_message: meta.chat
                }
              } else {
                return room
              }
            })
          } else {
            await createRoom([meta.chat.sender_id])
          }
        }
      }

      //  hasNewNoti.value = true
    }
  }
)

watch(
  () => userKeyword.value,
  async (val) => {
    if (val && isFlutter.value) {
      onInputUser()
    }
  }
)


onMounted(async () => {

  clearInterval(roomPolling.value)

  nextTick(async () => {
    onResize()
    await fetch()
    if (!userInfo.value.setting.dm_alarm || !isFbSupported.value || !useCommon().setting.value.isNotiAllow) {
      await pollingRoom()
    }
    const userId = getQuery('user')
    if (userId) { await findRoom([Number(userId)]) }
  })

  window.addEventListener('resize', onResize)

})

onBeforeRouteLeave((to, from, next) => {
  window.removeEventListener('resize', onResize)
  clearInterval(roomPolling.value)
  next()
})

function getQuery(query: string) {
  return route.query ? route.query[query] : null
}

function onResize() {
  isFullScreen.value = isMobile.value.matches ? true : false
}

async function fetch(isPolling: boolean = false, customOffset?: number) {

  const payload = {
    limit: CHAT_LIMIT,
    offset: customOffset ? customOffset : offset.value,
    order: 'desc'
  }

  //TODO: limit 제한 걸어야됨 임시
  try {
    const { data, error, pending } = await useCustomAsyncFetch<{ result: IChat[], updated_rooms: IChat[], totalCount: number }>(createQueryUrl(`/chat/rooms`, payload), getComFetchOptions('get', true))

    if (data.value) {
      const { result: rooms, updated_rooms, totalCount } = data.value
      totalRoomCnt.value = totalCount
      if (isAddData.value) {
        if (updated_rooms.length > 0) {

          updated_rooms.map((room) => {

            const targetRoom = roomList.value.find((room2) => room2.id === room.id)

            if (room.updated_message.length) {

              room.updated_message.map((msg) => {

                //CASE 1: 삭제된 메세지가 업데이트 된 경우 : chat_idx : -1인 경우 삭제된 메세지임 
                if (msg.chat_idx === -1 && (targetRoom.last_message.id === msg.id)) {
                  roomList.value = roomList.value.map((room3) => {
                    if (room3.id === room.id) {
                      return {
                        ...room3,
                        last_message: {
                          ...room3.last_message,
                          contents: t('deleted.message')
                        },
                        unread_count: room3.unread_count - 1,
                        meta: { isLastMsg: msg.id === room3.last_message.id }
                      }
                    } else {
                      return room3
                    }
                  })
                }

                //CASE 2 : 새로운 메세지 수신 된 경우
                else if (room.id === targetRoom?.id) {
                  roomList.value = roomList.value.map((room3) => {
                    if (room3.id === room.id) {
                      return {
                        ...room3,
                        last_message: msg,
                        unread_count: selectedRoom.value ? selectedRoom.value.id !== room3.id && isNotMyMsg(msg) && increaseUnreadCount(room3.unread_count) : isNotMyMsg(msg) && increaseUnreadCount(room3.unread_count),
                        unread_start_id: room.unread_start_id
                      }
                    } else {
                      return room3
                    }
                  })

                }
              })

            }
          })

          roomList.value = [...newRooms(updated_rooms), ...roomList.value]
        }
        if (rooms.length > 0) {
          roomList.value = [...roomList.value, ...newRooms(rooms)]
        } else if (rooms.length === 0) {
          if (!isPolling)
            isAddData.value = false
        }
      }
      else {
        roomList.value = rooms
        isAddData.value = true
      }
    }
  }
  finally {
    roomPending.value = false
  }
}
const isNotMyMsg = (msg: IMessage) => {
  return msg.sender?.id !== userInfo.value.id
}

const increaseUnreadCount = (unreadCount: number) => {
  return unreadCount + 1
}

const newRooms = ((rooms: IChat[]) => {
  return rooms.filter((room: IChat) => !roomList.value.some(existingRoom => existingRoom.id === room.id))
})



const onInputUser = debounce(async () => {
  await getUsers()
}, 300)

async function getUsers() {
  let isPending = true
  findUserPending.value = true

  if (userKeyword.value) {
    //TODO: 무한 스크롤 처리 해야됨 
    try {
      const { data, error, pending } = await useCustomAsyncFetch<{ totalCount: number, result: IUser[] }>(`/search?username=${userKeyword.value}`, getComFetchOptions('get', false))

      if (data.value) {
        const { result } = data.value
        userList.value = result
        isPending = pending.value
        findUserPending.value = pending.value
      } else if (error.value) {
        isPending = pending.value
        findUserPending.value = pending.value
      }
    } finally {
      followPending.value = isPending
      findUserPending.value = isPending

    }
  } else {
    await getFollowings()
  }
}

async function showNewMsg() {
  if (!userInfo.value) return
  openNewMsg.value = true
  await getFollowings()
}

async function getFollowings() {
  let isPending = true

  try {
    //TODO: 무한 스크롤 처리 해야됨 
    const { data, error, pending } = await useCustomAsyncFetch<{ totalCount: number, result: IUser[] }>(`/user/${userInfo.value?.id}/list/following`, getComFetchOptions('get', false))

    console.table(data.value)
    if (data.value) {
      const { result } = data.value
      userList.value = result.map((user) => {
        console.log(user)
        return {
          ...user,
          picture: user.profile_img
        }
      })
      isPending = pending.value
    } else if (error.value) {
      isPending = pending.value
    }
  } finally {
    followPending.value = isPending
    findUserPending.value = isPending
  }
}


async function onClickUser(user: IUser) {

  chipRef.value.saveChip({ id: user.id, name: user.name })
  // await findRoom([user.id])
}


async function onClickRoom(clickedRoom: IChat) {

  selectedRoom.value = clickedRoom
  forceRerender()

  // await getMessages()

  roomList.value = roomList.value.map((room) => {
    if (room.id === clickedRoom.id) {
      return {
        ...room,
        unread_count: 0
      }
    } else {
      return room
    }
  })

}

function forceRerender() {
  componentKey.value += 1;
};

async function findRoom(user_ids: Number[]) {


  try {
    const { data, error } = await useCustomAsyncFetch<{ result: IChat[] }>(`/chat/rooms/search/user?user_ids=${user_ids}&perfact=true`, getComFetchOptions('get', true))

    if (data.value) {
      const { result: rooms } = data.value
      if (!rooms.length) {
        await createRoom(user_ids)
        selectedRoom.value = roomList.value[0]
        forceRerender()

      } else {
        //이미 방이 존재하는 경우
        const existRoom = roomList.value.filter((room) => {
          if (room.id === rooms[0].id) {
            return room
          }
        })

        if (existRoom.length) {
          selectedRoom.value = existRoom[0]
        } else {
          selectedRoom.value = rooms[0]
          await createRoom([selectedRoom.value.joined_users[0].id])
        }
        forceRerender()
      }
    }
  } finally {
    openNewMsg.value = false

  }

}


async function createRoom(receiver_ids: Number[]) {

  const payload = {
    receiver_ids
  }

  const { data, error } = await useCustomAsyncFetch<IChat>(`/chat/rooms`, getComFetchOptions('post', true, payload))

  if (data.value) {

    forceRerender()
    if (roomList.value.length) {
      roomList.value = [data.value, ...roomList.value]
    } else {
      roomList.value = [data.value]
    }

  }
  else if (error.value) {

    ElMessage({
      message: error.value._data.message,
      type: 'error'
    })

  }



}

function closeModal() {
  userList.value = followingList.value
  userKeyword.value = ''
  chipRef.value.clearArr()
}

function onDeletedRoom(room: IChat) {
  selectedRoom.value = null
  roomList.value = roomList.value.filter((elem) => {
    return elem.id !== room.id
  })

}


//fcm이 작동하지 않는 경우 polling 해야됨
async function pollingRoom() {
  roomPolling.value = setInterval(async () => {
    await fetch(true, totalRoomCnt.value)
  }, 5000)
}

function initSelect() {
  selectedRoom.value = null

}

function openkeyboard(height: number) {
  activeMsgRef.value.style.paddingBottom = height + 'px'
}

function closeKeyboard() {
  activeMsgRef.value.style.paddingBottom = '0px'
}

function updateRooms(list: IChat[]) {


}

function backspaceDelete({ which }) {
  if (which == 8 && userKeyword.value === '')
    chipRef.value.backspaceDelete()
}

function saveChip() {
  chipRef.value.saveChip()
}

async function startChat() {

  createRoomCount = createRoomCount - 1


  if (createRoomCount > 0) {
    const ids = chipRef.value.chipsArr.map((chip) => chip.id)
    if (!ids.length) return
    await findRoom(ids)
  }
  createRoomCount = createRoomCount + 1

}

function getCurrChip(chips) {
  selectedUsers.value = chips
}

function getJoinedUserName(room: IChat) {
  if (room.has_name || Number(room.has_name) === 1) {
    return room.name
  } else {
    const users = room.joined_users
    if (users) {
      const total = users.length
      let roomName = ''

      if (total >= DISPLAY_USER_LIMIT) {
        for (let i = 0; i < DISPLAY_USER_LIMIT; i++) {
          roomName += users[i].nickname
          if (i < DISPLAY_USER_LIMIT - 1)
            roomName += ', '
        }

        if (total > DISPLAY_USER_LIMIT) {
          roomName += `외 ${total - 2}명`
        }

        return roomName
      } else {
        return room.joined_users[0]?.nickname
      }
    }
  }

}

provide('joinedUser', { getJoinedUserName })

function updateGroupName(roomName: string) {
  roomList.value = roomList.value.map((room) => {
    if (room.id === selectedRoom.value.id) {
      room.name = roomName
      room.has_name = true
      selectedRoom.value = room
    }
    return room

  })
}
</script>
<style scoped lang="scss">
.content {
  height: 100vh;

  .dm-list {

    .mobile-btn {
      display: none;

    }

    .dl-content {
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin-top: 30px;
      border: 1px solid #e5e5e5;
      border-radius: 10px;
      overflow: hidden;

      dd {

        ul {
          overflow-y: auto;

          li {
            padding: 13px;

            &:hover {
              background-color: #F9f9f9;
            }

            dl {
              dd {
                width: 15%;
              }

              dt {
                width: 70%;
              }
            }
          }
        }
      }


    }
  }
}

.new-msg-btn-icon {
  &.inactive {
    opacity: 0.3;
    pointer-events: none;
    cursor: not-allowed
  }
}

.new-msg-btn {
  &.inactive {
    background-color: #888;
    opacity: 0.3;
    pointer-events: none;
    cursor: not-allowed
  }

}

.new-msg-modal {
  .ma-content {
    .input-search-default {
      justify-content: left
    }

    .user-list {
      margin-top: 20px;

      li {
        padding: 13px;
        border: 1px solid #ededed;
        border-radius: 10px;
        text-align: left;

        dt {
          display: flex;
          flex-direction: column;
          justify-content: center;

          h3 {
            font-weight: 600;
          }

          .nickname {
            color: #888
          }
        }
      }
    }
  }

}

@media all and (max-width: 767px) {
  .content {
    height: 100vh;
    padding-bottom: 0px;

    .dm-list {
      padding: 20px 10px 10px 10px;
      margin: 0px;
      width: 100%;
      height: 100%;
      border-radius: 0px;
      box-shadow: none;

      .dl-title {
        display: flex;
        flex-direction: row;

        .mobile-btn {
          display: inline;
          border: none;
          background: transparent;
          padding: 0px;
          color: #333;
          font-size: 25px;

          &.off {
            display: none;
          }

          &.on {
            display: inline;
          }
        }
      }

      .dl-content {
        border: none;
        margin-top: 10px;
        height: 85%;

        .dm-info-box {
          width: 55% !important;
        }

        .room-container {
          &.off {
            display: none;
          }

          &.on {
            display: block;
          }

          .msg-list {
            padding: 0px;
            height: 100%;
            overflow-y: scroll;

          }
        }

        .msg-container {


          &.off {
            display: none;
          }

          &.on {
            display: flex;
            border: 1px solid #eee;
            border-radius: 10px;
          }


          ::v-deep(.dlc-chat-content) {
            height: auto;
            flex: 1;
            overflow-x: hidden;
            overflow-y: auto;
            position: relative;
            right: 0
          }

          ::v-deep(.dlc-send-message) {
            // height: 50px;

            div {
              width: 90%;
            }

            button {
              height: 30px;
              width: 30px;
            }

          }

        }
      }
    }

    ::v-deep(.new-msg-modal) {
      border-radius: 0px !important;
    }
  }
}

@media all and (min-width: 768px) and (max-width: 991px) {
  .content {
    .msg-list {
      :deep(.picture) {
        width: 40px;
        height: 40px;
      }

      .dm-info-box {
        width: 50% !important;
        font-size: 12px;
      }
    }
  }
}

@media all and (min-width: 992px) and (max-width: 1199px) {

  .content {
    .dm-info-box {
      width: 55% !important;
    }
  }
}
</style>
