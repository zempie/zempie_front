<template>
  <div class="content" style="height: 100vh">
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
            <ul v-else-if="!followPending" class="user-list" ref="userListEl">
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


definePageMeta({
  title: 'dm',
  name: 'dm',
  middleware: 'auth',
  layout: 'header-only',
})

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

  .new-msg-btn-icon {
    &.inactive {
      opacity: 0.3;
      pointer-events: none;
      cursor: not-allowed
    }
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

::v-deep(.new-msg-modal) {
  max-height: 90vh;
}

.new-msg-modal {

  .ma-content {
    .input-search-default {
      justify-content: left
    }

    .user-list {
      max-height: 500px;
      overflow-y: scroll;
      padding-top: 20px;

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
</style>
