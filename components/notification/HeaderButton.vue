<template>
  <client-only>
    <el-dropdown ref="notiDropdown" id="notiList" trigger="click">
      <button class="btn-circle-icon ml10" @click="showAlarmList">
        <i class="uil uil-bell" style="font-size:21px;"></i>
        <span v-if="hasNewNoti"></span>
      </button>
      <template #dropdown>
        <div slot="body" class="header-message">
          <dl>
            <dt>Notifications</dt>
            <dd>
              <a @click="readAll"><i class="uil uil-comment-alt"></i><em>{{ t('mark.all') }}</em></a>
            </dd>
          </dl>
          <ul>
            <li v-if="isNotiLoading" v-for="noti in 4">
              <dl>
                <dd>
                  <UserAvatarSk style="width:50px; height:50px;" />
                </dd>
                <dt>
                  <h3 class="grey-text skeleton-animation" style="height:20px"></h3>
                  <p class="grey-text skeleton-animation" style="height:20px; width: 300px;"></p>
                </dt>
                <dd>
                </dd>
              </dl>
            </li>
            <template v-else>
              <li v-if="notiList?.length" v-for="noti in notiList" :key="noti.id"
                :class="!noti.is_read && 'is-read-active'">
                <dl @click.stop="moveAlarm(noti)">
                  <dd>
                    <UserAvatar :user="noti.user" :tag="'span'" :hasRouter="true" />
                  </dd>
                  <dt>
                    <h3><span @click.stop="moveUserPage(noti.user.nickname)">{{
                      noti.user.nickname
                    }}&nbsp;</span>{{ noti.type_text }}
                    </h3>
                    <h4>{{ noti.content.slice(0, 40) }}</h4>
                    <p><i class="uis uis-clock" style="color:#c1c1c1;"></i>{{ dateFormat(noti.created_at) }}</p>
                  </dt>
                  <dd>
                  </dd>
                </dl>
              </li>
              <li v-else>
                <dl>
                  {{ t('no.alarm') }}
                </dl>
              </li>
            </template>
          </ul>
          <p class="view-all" @click="goNotiList"><a>{{ t('view.all') }}</a></p>
        </div>
      </template>
    </el-dropdown>
  </client-only>
</template>
<script setup lang='ts'>
import { ElDropdown } from 'element-plus'
import { INotification, eNotificationType } from '~~/types';
import { dateFormat } from '~/scripts/utils'
import shared from '~/scripts/shared'

const { $localePath } = useNuxtApp()
const { t, locale } = useI18n()
const router = useRouter()

const NOTI_LIMIT = 5

const hasNewNoti = ref(false)
const isNotiLoading = ref(false)
const notiList = ref<INotification[]>()
const needAlarmRefresh = ref(false)
const notiDropdown = ref()

watch(
  () => useAlarm().alarm.value.newNoti,
  (val) => {
    if (val) hasNewNoti.value = true
  }
)

watch(
  () => useUser().user.value.info,
  (val) => {

    if (val?.new_noti_count) hasNewNoti.value = true
  }
)


async function showAlarmList() {

  if (notiList.value && !hasNewNoti.value) return
  if (needAlarmRefresh.value) return

  isNotiLoading.value = true

  const { count, result } = await useCustomFetch<{ count: number, result: INotification[] }>(createQueryUrl('/notification', { offset: 0, limit: NOTI_LIMIT }), getComFetchOptions('get', true))

  notiList.value = result.map((noti: INotification) => {
    return {
      ...noti,
      type_text: shared.notiText(noti.type)
    }

  })
  isNotiLoading.value = false
  needAlarmRefresh.value = false

  useAlarm().resetNewNoti()
  useUser().updateUserKey('new_noti_count', 0)

  hasNewNoti.value = false
}


async function readAll() {
  await useCustomFetch('/notification/read-all', getComFetchOptions('put', true))
  notiList.value.map((noti) => {
    return noti.is_read = true
  })

}

async function moveAlarm(noti: INotification) {

  await useCustomFetch('/notification', getComFetchOptions('put', true, { id: noti.id }))

  notiList.value.map((elem) => {
    if (elem.id === noti.id) {
      return elem.is_read = true
    }
  })
  shared.moveNoti(noti)
  notiDropdown.value.handleClose()
  needAlarmRefresh.value = true
}


function goNotiList() {
  router.push($localePath('/notifications'))
  notiDropdown.value.handleClose()
}

function moveUserPage(nickname: string) {
  router.push($localePath(`/${nickname}`))
  notiDropdown.value.handleClose()

}
</script>
<style scoped lang='scss'>
.header-message {
  ul {
    li {
      width: 400px;

      &.is-read-active {
        border-left: 3px solid #ff6e17;
      }

      h3 {
        span {
          &:hover {
            color: #ff6e17
          }
        }
      }

      h4 {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }

  .view-all {
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
