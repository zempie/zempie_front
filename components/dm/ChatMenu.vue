<template>
  <ClientOnly>
    <el-dropdown trigger="click">
      <button class="room-btn pointer"> <i class="uil uil-ellipsis-h font25"></i></button>
      <template #dropdown>
        <div class="more-list fixed" style="min-width: 150px">
          <a @click="opLeaveChatModal = true" id="editFeed" class="pointer">{{ t('remove.chat') }}</a>
          <template v-if="!selectedRoom?.is_group_room">
            <a @click="onBlockUser" class="pointer">{{ t('block.user') }}</a>
            <a @click="opReportModal = true" class="pointer">{{ t('report.user') }}</a>
          </template>
          <a v-else @click="opSetGroupChatName = true" class="pointer">{{ t('set.group.chat.name') }}</a>
        </div>
      </template>
    </el-dropdown>

    <el-dialog v-model="opLeaveChatModal" class="modal-area-type" width="380px">
      <div class="modal-alert">
        <dl class="ma-header">
          <dt>{{ t('leave.chat') }}</dt>
          <dd>
            <button class="pointer" @click="opLeaveChatModal = false">
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
            <button class="btn-default w48p" @click="opLeaveChatModal = false">
              {{ $t('no') }}
            </button>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog v-model="opSetGroupChatName" class="modal-area-type" width="380px">
      <div class="modal-alert">
        <dl class="ma-header">
          <dt>{{ t('set.group.chat.name') }}</dt>
          <dd>
            <button class="pointer" @click="opSetGroupChatName = false">
              <i class="uil uil-times"></i>
            </button>
          </dd>
        </dl>
        <div class="ma-content">
          <div class="flex column mt10">
            <p class="mb20 text-left">{{ t('set.group.chat.name.info') }}</p>
            <input type="text" v-model="groupName" :placeholder="t('set.name')" class="w100p" @input="onChangeName" />
            <small v-if="groupNameErr" class="text-red text-left">그룹명은 50자 이내만 가능합니다.</small>
          </div>
          <div>
            <button class="btn-gray w48p" @click="opSetGroupChatName = false">
              {{ $t('cancel') }}
            </button>
            <button class="btn-default w48p" @click="setGroupName">
              {{ $t('save') }}
            </button>
          </div>
        </div>
      </div>
    </el-dialog>

    <UserReportModal :openModal="opReportModal" @closeModal="opReportModal = false"
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

const opLeaveChatModal = ref(false)
const opReportModal = ref(false)
const opSetGroupChatName = ref(false)

const groupName = ref(props.selectedRoom.name)
const groupNameErr = ref(false)


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


async function onBlockUser() {
  await useUser().blockUser(props.selectedRoom?.joined_users[0].id)
}


function onChangeName() {

  if (groupName.value.length > MAX_NAME_LIMIT) {
    groupNameErr.value = true
    groupName.value = groupName.value.slice(0, 50)
  } else {
    groupNameErr.value = false
  }
}

async function setGroupName() {
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
    opSetGroupChatName.value = false
  }

}

</script>
<style scoped lang="scss">
.ma-content {
  align-items: flex-start;
}
</style>