<template>
  <div class="content">

    <div class="dm-list">
      <div class="dl-title">
        <div>
          <h2> {{ $t('dm') }}</h2>
        </div>
        <p>
          <!-- <router-link to="#"><i class="uil uil-comment-alt"></i> <span>5</span><em>전부읽음</em></router-link> -->
          <NuxtLink :to="$localePath(`/myaccount`)"><i class="uil uil-setting"></i> <em>{{ t('setting') }}</em></NuxtLink>
        </p>
      </div>

      <dl class="dl-content">

        <dd>
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
                <dt>
                  <h3 class="grey-text w50p skeleton-animation">
                  </h3>
                  <p class="grey-text  skeleton-animation"></p>
                </dt>
                <dd>
                </dd>
              </dl>
            </li>
          </ul>
          <template v-else>
            <ul v-if="msgList" class="msg-list">
              <!-- <el-scrollbar tag="ul" wrap-class="msg-list" height="650px"> -->
              <li v-for="msg in msgList" :key="msg.id" @click="onClickMsg(msg)">
                <dl>
                  <dd v-if="!msg.is_group_conversation" class="mr10">
                    <UserAvatar :user="msg.other_users[0]" tag="p" />
                  </dd>
                  <dt>
                    <h3>@{{ msg.other_users[0].nickname }}</h3>
                    <p>{{ msg.last_message.text }}</p>
                  </dt>
                  <dd>
                    <h4 class="font12"><i class="uis uis-clock" style="color:#c1c1c1;"></i>{{ dateFormat(msg.created_at)
                    }}
                    </h4>
                    <span>1</span>
                  </dd>
                </dl>
              </li>
            </ul>
            <ul v-else class="flex items-center content-center">
              메세지가 없습니다.
            </ul>
          </template>
        </dd>
        <dt>
          <template v-if="selectedMsg">
            <dl>
              <dd>
              </dd>
              <dt>
                <div>
                  <h2>{{ selectedMsg.from_user?.name }}</h2>
                  <p>@{{ selectedMsg.from_user?.nickname }}</p>
                </div>
                <!-- <p>Online</p> -->
              </dt>
              <dd><router-link to="#"><i class="uil uil-ellipsis-h font25"></i></router-link></dd>
            </dl>

            <div class="dlc-chat-content">
              <div class="receiver-chat">
                <h4>2:30 PM</h4>
                <ul>
                  <li><span>전송한 메세지 내용 표시. 전송한 메세지가 width 길이보다 길 경우</span></li>
                </ul>
              </div>
              <div class="sender-chat">
                <h4>2:30 PM</h4>
                <ul>
                  <li><span>안녕</span></li>
                  <li><span>어떻게 지내고 있어? 나는 잘 지내고 있어. 날씨가 많이 춥지?😎</span></li>
                </ul>
              </div>
              <dl>
                <dd></dd>
                <dt>2021년11월09일</dt>
                <dd></dd>
              </dl>
              <div class="receiver-chat">
                <h4>2:30 PM</h4>
                <ul>
                  <li><span>전송한 메세지 내용 표시. 전송한 메세지가 width 길이보다 길 경우</span></li>
                </ul>
              </div>
              <div class="sender-chat">
                <h4>2:30 PM</h4>
                <ul>
                  <li><span>안녕</span></li>
                  <li><span>어떻게 지내고 있어? 나는 잘 지내고 있어. 날씨가 많이 춥지?😎</span></li>
                  <li><span>어떻게 지내고 있어?</span></li>
                  <li><span>밥 먹었어?</span></li>
                </ul>
              </div>
            </div>
            <div class="dlc-send-message">
              <div>
                <input v-model="inputMsg" type="text" name="" title="" placeholder="댓글달기" />
                <router-link to="#"><i class="uil uil-scenery font25 mr5"></i></router-link>
                <router-link to="#"><i class="uil uil-camera font28"></i></router-link>
              </div>
              <p><a to="#"><img src="/images/send_icon.png" alt="" title="" /></a></p>
            </div>
          </template>
          <div v-else class="dlc-chat-emptied">
            <p><i class="uil uil-comment-alt-dots" style="font-size:40px; color:#fff;"></i></p>
            <h2>아무 메세지도 선택하지 않으셨습니다.</h2>
            <h3>메세지를 선택하거나, 새로운 메세지를 작성하세요.</h3>
            <div><button @click="showNewMsg" class="btn-default" style="width:100%;">새 메세지</button></div>
          </div>
        </dt>
      </dl>
    </div>
    <ClientOnly>
      <el-dialog v-model="openNewMsg" class="modal-area-type new-msg-modal" :show-close="false" width="380px">
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
                  placeholder="검색어를 입력하세요." />
              </div>
            </div>
            <ul v-if="followPending" class="user-list">
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
            <ul v-else class="user-list">
              <!-- <el-scrollbar tag="ul" wrap-class="msg-list" height="650px"> -->
              <li v-if="userList?.length" v-for="user in userList" :key="user.id" class="pointer"
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
                검색된 계정이 없습니다.
              </li>
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
import { offset } from 'dom7'

const MSG_LIMIT = 5

const { $localePath } = useNuxtApp()
const { t } = useI18n()

const userInfo = computed(() => useUser().user.value.info)

const router = useRouter()
const dmDropdown = ref()
const msgList = ref<IChat[]>()
const selectedMsg = ref<IMessage>()
const dmKeyword = ref('')

const inputMsg = ref('')

const openNewMsg = ref(false)
const userKeyword = ref('')
const userList = ref<IUser[]>()

const msgOffset = ref(0)
const msgLimit = ref(15)

const roomPending = ref(true)
const followPending = ref(true)

onMounted(async () => {
  await fetch()
})
async function fetch() {
  let isPending = true

  //TODO: limit 제한 걸어야됨 임시
  try {
    const { data, error, pending } = await useCustomAsyncFetch<{ result: IChat[] }>(`/chat/rooms`, getComFetchOptions('get', true))

    if (data.value) {
      const { result } = data.value
      msgList.value = result
      console.log(pending)
      isPending = pending.value
    } else if (error.value) {
      isPending = pending.value
    }
  }
  finally {
    roomPending.value = isPending
  }
}
function onClickMsg(msg: IChat) {
  // selectedMsg.value = msg
}


const onInputMsg = debounce(async () => {
  await fetch()
}, 300)

const onInputUser = debounce(async () => {
  await getUsers()
}, 300)

async function getUsers() {
  let isPending = true

  if (userKeyword.value) {
    //TODO: 무한 스크롤 처리 해야됨 
    try {
      const { data, error, pending } = await useCustomAsyncFetch<{ totalCount: number, result: IUser[] }>(`/search?username=${userKeyword.value}`, getComFetchOptions('get', false))

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


async function getMessages() {

  const payload = {
    offset: msgOffset.value,
    limit: msgLimit.value
  }

  const { data, error } = await useCustomAsyncFetch(`/chat/message`, getComFetchOptions('get', true, payload))

}

async function sendMsg() {
  const payload = {
    room_id: 0,
    receiver_ids: [
      37
    ],
    type: 0,
    contents: inputMsg.value
  }

  const { data, error } = await useCustomAsyncFetch(`/chat`, getComFetchOptions('post', true, payload))

}

async function deleteChat() {
  const { data, error } = await useCustomAsyncFetch(`/chat/room_leave`, getComFetchOptions('delete', true)
  )
}


async function deleteMsg() {
  const { data, error } = await useCustomAsyncFetch(`/chat`, getComFetchOptions('delete', true)
  )
}

async function findRoom(user_ids: Number[]) {

  const payload = {
    user_ids
  }

  const { data, error } = await useCustomAsyncFetch(`/chat/find_rooms/user`, getComFetchOptions('get', true, payload))

}



</script>
<style scoped lang="scss">
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


  .dlc-send-message {
    div {
      justify-content: space-between;
    }

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
</style>
