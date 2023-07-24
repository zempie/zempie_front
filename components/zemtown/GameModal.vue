<template>
  <div class="zemtown-modal">
    <div v-if="isOpen" class="info-container">
      <div class="user-header">
        <NuxtLink class="user-link font20 mb10" :to="$localePath('/')">{{ }}</NuxtLink>
        <NuxtLink class="user-link mt5 mb10" :to="$localePath('/')">{{}}</NuxtLink>
      </div>
      <div class="user-body">

        <img :src="game?.url_thumb" />
      </div>
      <div class="user-actions">

        <button class="action-btn btn-default">play</button>
        <NuxtLink class="action-btn btn-default" :to="$localePath(`/game/${props.game?.pathname}`)">게임페이지이동</NuxtLink>

      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { PropType } from 'vue';
import { IGame } from '~~/types';

const { $localePath } = useNuxtApp()


const props = defineProps({
  game: Object as PropType<IGame>,
  isOpen: {
    type: Boolean,
    dafault: false
  }
})

const emit = defineEmits(['closeModal'])

function logout() {
  useUser().logout()
  emit('closeModal')
}
</script>ㅋ
<style scoped lang="scss">
.info-container {

  max-width: 450px;
  width: 50%;
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