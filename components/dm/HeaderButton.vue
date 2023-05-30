<template>
  <client-only>
    <el-dropdown ref="dmDropdown" id="dmList" trigger="click">
      <button class="btn-circle-icon ml10" @click="showDmList">
        <i class="uil uil-comment-alt"></i>
        <!-- <span></span> -->
      </button>
      <template #dropdown>
        <div slot="body" class="header-message">
          <dl>
            <dt>{{ $t('message') }}</dt>
            <dd>
              <a><i class="uil uil-comment-alt"></i><em>{{ t('mark.all') }}</em></a>
            </dd>
          </dl>
          <ul>
            <li v-for="msg in msgList" :key="msg.id">
              <dl>
                <dd v-if="!msg.is_group_conversation">
                  <UserAvatar :user="msg.other_users[0]" :tag="'span'" :hasRouter="true" />
                </dd>
                <dt v-if="!msg.is_group_conversation">
                  <h3>@{{ msg.other_users[0].nickname }}</h3>
                  <p>{{ msg.last_message.text }}</p>
                </dt>
                <dd>
                  <h4><i class="uis uis-clock" style="color:#c1c1c1;"></i>{{ dateFormat(msg.last_message_sent_at) }}</h4>
                  <em>{{ msg.unread_count }}</em>
                </dd>
              </dl>
            </li>
          </ul>
          <!-- <p><router-link to="#">전체보기</router-link></p> -->
          <p class="view-all pointer" @click="goDmList"><a>{{ t('view.all') }}</a></p>

        </div>
      </template>
    </el-dropdown>
  </client-only>
</template>
<script setup lang="ts">
import { ElDropdown } from "element-plus"
import { dateFormat } from "~~/scripts/utils"
import { IConversation, IMessage } from "~~/types"

const MSG_LIMIT = 5

const { $localePath } = useNuxtApp()
const { t } = useI18n()

const router = useRouter()
const dmDropdown = ref()
const msgList = ref<IConversation[]>()



async function showDmList() {


  //TODO: limit 제한 걸어야됨 임시
  const response = await useCustomFetch<{ result: IConversation[] }>(`/conversations`, getComFetchOptions('get', true))
  if (response) {
    const { result } = response
    msgList.value = result
  }


}

function goDmList() {
  router.push($localePath('/dm/list'))

  dmDropdown.value.handleClose()
}



</script>
<style scoped lang="scss">
.header-message {
  ul {
    li {
      width: 400px;

      dl {
        display: flex;
        align-items: center;
        width: 100%;

        dd {
          width: 20%;
          text-align: right;

          span {
            display: inline-block;
            position: absolute;
            margin: -25px 0 0 -70px;
            width: 50px;
            height: 50px;
            text-align: center;
            font-weight: 500;
            font-size: 16px;
            line-height: 50px;
            color: #ff6e17;
            border-radius: 50%;
            background: rgba(249, 115, 22, 0.15);
            border: 2px solid #fff;
            box-shadow: 0px 4px 9px rgba(0, 0, 0, 0.06);
          }

        }

        dt {
          width: 60%;
        }
      }
    }
  }


}
</style>
