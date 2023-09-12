<template>
  <ClientOnly>
    <el-dropdown trigger="click">
      <button class="room-btn pointer"> <i class="uil uil-ellipsis-h font25"></i></button>
      <template #dropdown>
        <div class="more-list fixed" style="min-width: 150px">
          <a @click="openLeaveChatModal" id="editFeed" class="pointer">{{ t('remove.chat') }}</a>
          <template v-if="!selectedRoom?.is_group_room">
            <a @click="onBlockUser" class="pointer">{{ t('block.user') }}</a>
            <a @click="openReportModal" class="pointer">{{ t('report.user') }}</a>
          </template>
          <a v-else @click="openSetGroupChatName" class="pointer">{{ t('set.group.chat.name') }}</a>
        </div>
      </template>
    </el-dropdown>

    <el-dialog v-model="opLeaveChatModal" class="modal-area-type" width="380px">
      <div class="modal-alert">
        <dl class="ma-header">
          <dt>{{ t('leave.chat') }}</dt>
          <dd>
            <button class="pointer" @click="closeLeaveChatModal">
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
            <button class="btn-default w48p" @click="closeLeaveChatModal">
              {{ $t('no') }}
            </button>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog v-model="opSetGroupChatName" class="modal-area-type" width="380px" @close="closeModal">
      <div class="modal-alert">
        <dl class="ma-header">
          <dt>{{ t('set.group.chat.name') }}</dt>
          <dd>
            <button class="pointer" @click="closeSetGroupChatName">
              <i class="uil uil-times"></i>
            </button>
          </dd>
        </dl>
        <div class="ma-content">
          <div class="flex column mt10">
            <p class="mb20 text-left">{{ t('set.group.chat.name.info') }}</p>
            <input type="text" v-model="groupName" :placeholder="t('set.name')" class="w100p" @input="onChangeName" />
            <small v-if="isGroupNameErr" class="text-red text-left">{{ groupNameErr }}</small>
          </div>
          <div>
            <button class="btn-gray w48p" @click="closeSetGroupChatName">
              {{ $t('cancel') }}
            </button>
            <button class="btn-default w48p" @click="setGroupName">
              {{ $t('save') }}
            </button>
          </div>
        </div>
      </div>
    </el-dialog>

    <UserReportModal :openModal="opReportModal" @closeModal="closeReportModal"
      :user="props.selectedRoom?.joined_users[0]" />
  </ClientOnly>
</template>
<script setup lang="ts">
import { PropType } from 'vue';
import { ElDropdown, ElDialog } from 'element-plus';
import { IChat, IMessage, IUser, eChatType } from '~~/types'

const props = defineProps({
  selectedRoom: Object as PropType<IChat>,
})
const emit = defineEmits(['deletedRoom', 'updateGroupName'])

const MAX_NAME_LIMIT = 50
const { t, locale } = useI18n()

const isMobile = computed(() => useCommon().common.value.isMobile)

const opLeaveChatModal = ref(false)
const opReportModal = ref(false)
const opSetGroupChatName = ref(false)

const groupName = ref(props.selectedRoom.name)
const isGroupNameErr = ref(false)
const groupNameErr = ref('')

watch(
  () => useCommon().common.value.isPopState,
  (val) => {
    if (!val) {
      closeLeaveChatModal()
      closeSetGroupChatName()
      closeReportModal()
    }
  })

async function leaveChat() {

  try {
    const { data, error } = await useCustomAsyncFetch<{ message: IMessage }>(`/chat/rooms/${props.selectedRoom.id}`, getComFetchOptions('delete', true))

    if (data.value) {
      emit('deletedRoom', props.selectedRoom)
    }
  } finally {
    closeLeaveChatModal()
  }

}


async function onBlockUser() {
  await useUser().blockUser(props.selectedRoom?.joined_users[0].id)
}


function onChangeName() {

  if (isEmptyGroupName()) return

  if (groupName.value.length > MAX_NAME_LIMIT) {
    isGroupNameErr.value = true
    groupNameErr.value = t('group.name.err.msg1')
    groupName.value = groupName.value.slice(0, 50)
  } else {
    isGroupNameErr.value = false
  }
}

function isEmptyGroupName() {
  if (groupName.value.length === 0) {
    isGroupNameErr.value = true
    groupNameErr.value = t('group.name.err.msg2')
    return true
  }
  return false
}

async function setGroupName() {
  if (isEmptyGroupName()) return
  if (isGroupNameErr.value) return

  try {
    const payload = {
      room_id: props.selectedRoom.id,
      name: groupName.value
    }
    const { data, error } = await useCustomAsyncFetch(`/chat/room/${props.selectedRoom.id}/name`, getComFetchOptions('post', true, payload))

    if (data.value) {
      emit('updateGroupName', groupName.value)

    }
  } finally {
    closeSetGroupChatName()
  }

}

function closeModal() {
  groupName.value = ''
  isGroupNameErr.value = false
  groupNameErr.value = ''
}

function openLeaveChatModal() {
  opLeaveChatModal.value = true
  if (isMobile.value) {
    useCommon().setPopState(true)
  }
}

function closeLeaveChatModal() {
  opLeaveChatModal.value = false
  if (isMobile.value) {
    useCommon().setPopState(false)
  }
}

function openSetGroupChatName() {
  opSetGroupChatName.value = true
  if (isMobile.value) {
    useCommon().setPopState(true)
  }
}

function closeSetGroupChatName() {
  opSetGroupChatName.value = false
  if (isMobile.value) {
    useCommon().setPopState(false)
  }
}

function openReportModal() {
  opReportModal.value = true
  if (isMobile.value) {
    useCommon().setPopState(true)
  }
}
function closeReportModal() {
  opReportModal.value = false
  if (isMobile.value) {
    useCommon().setPopState(false)
  }
}

</script>
<style scoped lang="scss">
.ma-content {
  align-items: flex-start;
}
</style>