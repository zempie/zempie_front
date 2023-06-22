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
          <!-- TODO: 2차 스펙에서 진행함 -> -->
          <!-- <div>
            <div class="input-search-default" @input="onInputMsg">
              <p><i class="uil uil-search"></i>
              </p>
              <div><input v-model="dmKeyword" type="text" name="" title="keywords" placeholder="검색어를 입력하세요." /></div>
            </div>
          </div> -->
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
                  <dd v-if="!room.is_group_room" class="mr10">
                    <UserAvatar :user="room.joined_users[0]" tag="p" />
                  </dd>
                  <dt>
                    <h3>{{ room.joined_users[0]?.nickname }}</h3>
                    <p>{{ room?.last_message?.contents }}</p>
                  </dt>
                  <dd>
                    <h4 class="font12"><i class="uis uis-clock" style="color:#c1c1c1;"></i>
                      {{ dateFormat(room.created_at) }} </h4>
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
        <dt :class="['msg-container', selectedRoom ? 'on' : 'off']" ref="activeMsgRef">
          <DmActiveRoom v-if="selectedRoom" :selectedRoom="selectedRoom" @deleted-room="onDeletedRoom"
            @open-keyboard="openkeyboard" @close-keyboard="closeKeyboard" :key="selectedRoom.id" ref="activeRoomRef" />
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
      <el-dialog v-model="openNewMsg" class="modal-area-type new-msg-modal" :show-close="false" width="380px"
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
              <div class="mt0"><input v-model="userKeyword" type="text" name="" title="keywords"
                  :placeholder="$t('enter.keyword')" />
              </div>
            </div>
            <ul v-if="followPending" class="user-list" ref="userListRef">
              <li>
                <dl class="row">
                  <dd class="mr10">
                    <UserAvatarSk tag="p" style="width:45px; height: 45px;" />
                  </dd>
                  <dt class="w100p">
                    <h3 class="grey-text w50p skeleton-animation"> </h3>
                    <p class="grey-text mt10 skeleton-animation"></p>
                  </dt>
                </dl>
              </li>
            </ul>
            <ul v-else-if="!followPending" class="user-list">
              <li v-if="userList?.length" v-for="user in userList" :key="user.id" class="pointer mb10"
                @click="onClickUser(user)">
                <dl class="row">
                  <dd class="mr10">
                    <UserAvatar :user="user" tag="p" style="width:45px; height:45px; border-radius: 50%;" />
                  </dd>
                  <dt>
                    <h3 class="font16">{{ user.name }}</h3>
                    <p class="font13 nickname">@{{ user.nickname }}</p>
                  </dt>
                </dl>
              </li>
              <li v-else>
                {{ $t('not.found.user') }}
              </li>
            </ul>
            <ul v-if="findUserPending" class="flex row content-center">
              <ClipLoader color='#ff6e17' size="20px" />
            </ul>
          </div>
        </div>
      </el-dialog>
    </ClientOnly>
  </div>
</template>
<script setup lang="ts">
import { ElScrollbar, ElDialog } from 'element-plus'
import { dateFormat } from '~~/scripts/utils'
import { IChat, IMessage, IUser } from '~~/types'
import { debounce } from '~~/scripts/utils'
import { useInfiniteScroll } from '@vueuse/core'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'


const CHAT_LIMIT = 10

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
const userList = ref<IUser[]>()

const msgList = ref<IMessage[]>()

const roomPending = ref(true)
const followPending = ref(true)
const findUserPending = ref(false)
const msgEl = ref<HTMLElement | null>(null)
const userListRef = ref<HTMLElement | null>(null)
const fromId = ref(0)
const isAddData = ref()

const activeMsgRef = ref()

const isFlutter = computed(() => useMobile().mobile.value.isFlutter)

// 초기데이터 저장용
const followingList = computed(() => userList.value)

//polling
const roomPolling = ref(null)

//반응형
const isFullScreen = ref(false)


const isMobile = computed(() =>
  window.matchMedia('screen and (max-width: 767px)')
)
const isFbSupported = computed(() => useCommon().setting.value.isFbSupported)


definePageMeta({
  title: 'dm',
  name: 'dm',
  middleware: 'auth',
})

useInfiniteScroll(
  msgEl,
  async () => {
    if (isAddData.value) {
      fromId.value = roomList.value[roomList.value.length - 1].id + 1
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
      const roomId = Number(meta.room_id)
      if (meta) {
        if (selectedRoom.value?.id === roomId) {
          activeRoomRef.value.addMsg(meta)
        } else {
          const existRoom = roomList.value.filter((room) => {
            if (room.id === roomId) {
              return room
            }
          })
          console.log('existRoom', existRoom)

          if (existRoom.length) {
            roomList.value = roomList.value.map((room) => {
              if (room.id === roomId) {
                return {
                  ...room,
                  unread_count: room.unread_count += 1,
                  last_message: {
                    contents: meta.contents
                  }
                }
              } else {
                return room
              }
            })
          } else {
            await createRoom([meta.sender_id])
          }
        }
      }

      console.log(roomList.value)
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
  nextTick(async () => {
    onResize()
    await fetch()
    if (!userInfo.value.setting.dm_alarm || !isFbSupported.value) {
      await pollingChat()
    }
  })
  window.addEventListener('resize', onResize)

})

onBeforeUnmount(() => {
  clearInterval(roomPolling.value)
  window.removeEventListener('resize', onResize)

})

function onResize() {
  isFullScreen.value = isMobile.value.matches ? true : false
}
async function fetch(isPolling: boolean = false) {

  const payload = {
    limit: CHAT_LIMIT,
    from_id: fromId.value,
    order: 'asc'
  }

  //TODO: limit 제한 걸어야됨 임시
  try {
    const { data, error, pending } = await useCustomAsyncFetch<{ rooms: IChat[] }>(createQueryUrl(`/chat/rooms`, payload), getComFetchOptions('get', true))

    if (data.value) {
      const { rooms } = data.value
      if (isAddData.value) {
        if (rooms.length > 0) {
          roomList.value = [...roomList.value, ...rooms]
        } else if (rooms.length === 0) {
          if (!isPolling)
            isAddData.value = false
        }
      }
      else {
        console.log(isAddData.value)
        colorLog('here', 'pink')
        roomList.value = rooms
        isAddData.value = true
      }


    }
  }
  finally {
    roomPending.value = false
  }
}







//TODO:2차스펙
const onInputMsg = debounce(async () => {
  await fetch()
}, 300)

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
      userList.value = result
      isPending = pending.value
    } else if (error.value) {
      isPending = pending.value
    }
  } finally {
    followPending.value = isPending

  }
}


async function onClickUser(user: IUser) {
  openNewMsg.value = false
  await findRoom([user.id])
}


async function onClickRoom(clickedRoom: IChat) {

  selectedRoom.value = clickedRoom


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

async function findRoom(user_ids: Number[]) {


  const { data, error } = await useCustomAsyncFetch<{ rooms: IChat[] }>(`/chat/rooms/search/user?user_ids=${user_ids}&perfact=true`, getComFetchOptions('get', true))

  if (data.value) {
    // TODO: 다이렉트 메시지만 1차 스펙에서는 가능 -> 추후 그룹 메시지로 변경 
    const { rooms } = data.value
    if (!rooms.length) {
      await createRoom(user_ids)
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
    }
  }

}


async function createRoom(receiver_ids: Number[]) {
  const payload = {
    receiver_ids
  }
  const { data, error } = await useCustomAsyncFetch<IChat>(`/chat/rooms`, getComFetchOptions('post', true, payload))

  if (data.value) {
    openNewMsg.value = false
    selectedRoom.value = data.value
    if (roomList.value.length) {
      roomList.value = [data.value, ...roomList.value]
    } else {
      roomList.value = [data.value]
    }

  }

}

function closeModal() {
  userList.value = followingList.value
  userKeyword.value = ''
}

function onDeletedRoom(room: IChat) {
  selectedRoom.value = null
  roomList.value = roomList.value.filter((elem) => {
    return elem.id !== room.id
  })

}


//유저가 fcm 알람 막아둔 경우 polling 해야됨
async function pollingChat() {
  roomPolling.value = setInterval(async () => {
    fromId.value = roomList.value[roomList.value.length - 1].id + 1
    isAddData.value = true
    await fetch()
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


</script>
<style scoped lang="scss">
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
              width: 70%
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
    height: calc(100vh - 70px - 100px);
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

        height: 90%;

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

            li {
              // margin: 0px;
            }
          }
        }

        .msg-container {
          &.off {
            display: none;
          }

          &.on {
            display: block;
            border: 1px solid #eee;
            border-radius: 10px;
          }

          ::v-deep(.dlc-chat-content) {
            height: calc(100% - 120px);
          }

          ::v-deep(.dlc-send-message) {
            height: 50px;

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
</style>
