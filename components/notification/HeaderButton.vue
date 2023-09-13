<template>
  <client-only>
    <el-dropdown ref="notiDropdown" id="notiList" trigger="click" @visible-change="handleVisible">
      <button class="btn-circle-icon ml10 flex items-center content-center" @click="showAlarmList">
        <i style="font-size:20px;">
          <LazyIconBell />
        </i>
        <span v-if="hasNewNoti"></span>
      </button>
      <template #dropdown>
        <div slot="body" class="header-message" style="max-width:95vw; ">
          <dl>
            <dt> {{ t('notification') }}</dt>
            <dd>
              <a @click="readAll">
                <em>{{ t('mark.all') }}</em></a>
            </dd>
          </dl>
          <ul class="noti-list">
            <li v-if="isNotiLoading" v-for="noti in 4">
              <dl>
                <dd>
                  <UserAvatarSk style="width:50px; height:50px;" />
                </dd>
                <dt>
                  <h3 class="grey-text skeleton-animation" style="height:20px"></h3>
                  <p class="grey-text skeleton-animation" style="height:20px; width: 250px;"></p>
                </dt>
                <dd>
                </dd>
              </dl>
            </li>
            <template v-else>
              <li v-if="notiList?.length" v-for="noti in notiList" :key="noti.id"
                :class="!noti.is_read && 'is-read-active'">
                <dl class="flex items-center" @click.stop="moveAlarm(noti)">
                  <dd>
                    <UserAvatar :user="noti.user" tag="p" :hasRouter="true"
                      style="width:50px; height:50px;border-radius: 50%;" />
                  </dd>
                  <dt class="ml10">
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
<script setup lang="ts">
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
const isMobile = computed(() => useCommon().common.value.isMobile)

watch(
  () => useAlarm().alarm.value.newNoti,
  (val) => {
    if (val) hasNewNoti.value = true
  }
)

watch(
  () => useUser().user.value.info,
  (val) => {

    if (val?.meta.unread_noti_count) hasNewNoti.value = true
  }
)

watch(
  () => useCommon().common.value.isPopState,
  (val) => {
    if (!val) {
      notiDropdown.value.handleClose()
    }
  })

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
  useUser().updateUserKey('meta.unread_noti_count', 0)

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

function handleVisible(visible: boolean) {
  console.log('visible no', visible)
  if (!isMobile.value) return
  if (visible) {
    notiDropdown.value.handleOpen()
    useCommon().setPopState(true)
  } else {
    notiDropdown.value.handleClose()
    useCommon().setPopState(false)
  }
}

</script>
<style scoped lang="scss">
.header-message {
  .noti-list {
    li {
      max-width: 400px;

      dl {
        display: flex;

        dd {
          flex: 0.1;
        }

        dt {
          flex: 0.9;
        }
      }

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
