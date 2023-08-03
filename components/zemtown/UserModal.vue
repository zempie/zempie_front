<template>
  <div class="zemtown-modal">
    <div v-if="isOpen" class="info-container">
      <div class="user-header">
        <NuxtLink class="user-link font20 mb10" :to="$localePath('/')">{{ user?.nickname }}</NuxtLink>
        <NuxtLink class="user-link mt5 mb10" :to="$localePath('/')">{{ user?.email }}</NuxtLink>
      </div>
      <div v-if="isMine" class="user-body">
        <UserMenuProfile :user="user" />
        <a @click="logout">{{
          $t('logout')
        }}</a>
      </div>
      <div v-else class="user-actions">
        <UserFollowBtn :user="user" class="action-btn" />
        <DmSendBtn :user="user" class="action-btn" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { PropType } from 'vue';
import { IUser } from '~~/types';

const { $localePath } = useNuxtApp()


const props = defineProps({
  user: Object as PropType<IUser>,
  isOpen: {
    type: Boolean,
    dafault: false
  }
})

const isMine = computed(() => {
  return props.user?.uid === useUser().user.value.info?.uid
})

const emit = defineEmits(['closeModal'])

function logout() {
  useUser().logout()
  emit('closeModal')
}
</script>
<style scoped lang="scss">
.info-container {

  max-width: 450px;
  background-color: #e99415;
  min-height: 100px;
  display: flex;
  margin: 0 auto;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 30px 20px;

  .user-header {
    display: flex;
    flex-direction: column;

    .user-link {
      color: #000;
    }
  }

  .user-body {
    border-top: 1px solid #000;

    a {
      color: #000 !important;
      cursor: pointer;

    }

    :deep(.user-menu) {
      display: flex;
      flex-direction: column;

      a {
        color: #000 !important;
        cursor: pointer;
      }


      a:nth-child(1) {
        margin-top: 10px;
      }

      a {
        margin-bottom: 10px;
      }
    }
  }

  .user-actions {
    display: flex;
    justify-content: space-between;

    .action-btn {
      width: 48%;
    }
  }
}
</style>
