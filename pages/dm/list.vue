<template>
  <div class="content">

    <div class="dm-list">
      <div class="dl-title">
        <div>
          <h2> {{ $t('dm') }}</h2>
        </div>
        <p>
          <router-link to="#"><i class="uil uil-comment-alt"></i> <span>5</span><em>전부읽음</em></router-link>
          <router-link to="#"><i class="uil uil-setting"></i> <em>세팅</em></router-link>
        </p>
      </div>

      <dl class="dl-content">
        <dd>
          <div>
            <div class="input-search-default" @input="onInputMsg">
              <p><i class="uil uil-search"></i>
              </p>
              <div><input v-model="dmKeyword" type="text" name="" title="keywords" placeholder="검색어를 입력하세요." /></div>
            </div>
          </div>
          <ul class="msg-list">
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
                  <h4 class="font12"><i class="uis uis-clock" style="color:#c1c1c1;"></i>{{ dateFormat(msg.created_at) }}
                  </h4>
                  <span>1</span>
                </dd>
              </dl>
            </li>
          </ul>
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
                <input type="text" name="" title="" placeholder="댓글달기" />
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
            <ul class="user-list">
              <!-- <el-scrollbar tag="ul" wrap-class="msg-list" height="650px"> -->
              <li v-for="user in userList" :key="user.id" class="pointer" @click="onClickUser(user)">
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
import { IConversation, IMessage, IUser } from '~~/types'
import { debounce } from '~~/scripts/utils'

const MSG_LIMIT = 5

const { $localePath } = useNuxtApp()
const { t } = useI18n()

const userInfo = computed(() => useUser().user.value.info)

const router = useRouter()
const dmDropdown = ref()
const msgList = ref<IConversation[]>()
const selectedMsg = ref<IMessage>()
const dmKeyword = ref('')

const openNewMsg = ref(false)
const userKeyword = ref('')
const userList = ref<IUser[]>()

await fetch()

async function fetch() {

  //TODO: limit 제한 걸어야됨 임시
  const response = await useCustomFetch<{ result: IConversation[] }>(`/conversations`, getComFetchOptions('get', true))
  if (response) {
    const { result } = response
    msgList.value = result
  }

}
function onClickMsg(msg: IConversation) {
  selectedMsg.value = msg
}


const onInputMsg = debounce(async () => {
  await fetch()
}, 300)

const onInputUser = debounce(async () => {
  await getUsers()
}, 300)

async function getUsers() {
  if (userKeyword.value) {
    //TODO: 무한 스크롤 처리 해야됨 
    const { data, error } = await useCustomAsyncFetch<{ totalCount: number, result: IUser[] }>(`/search?username=${userKeyword.value}`, getComFetchOptions('get', false))

    if (data.value) {
      const { result } = data.value
      userList.value = result
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

  //TODO: 무한 스크롤 처리 해야됨 
  const { data, error } = await useCustomAsyncFetch<{ totalCount: number, result: IUser[] }>(`/user/${userInfo.value?.id}/list/following`, getComFetchOptions('get', false))

  if (data.value) {
    const { result } = data.value
    userList.value = result
  }
}


function onClickUser() {
  openNewMsg.value = false

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
