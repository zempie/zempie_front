<template>
  <div class="zemtown-modal">
    <div v-if="isOpen" class="info-container">

      <div class="zemtown-header mb10">
        <h2 class="font20  text-center flex content-center">{{ game.title }}</h2>

        <div class="thumbnail">
          <img :src="game?.url_thumb" style="max-width:150px" />
        </div>
      </div>
      <div class="zemtown-body text-center flex content-center">
        {{ game.description }}
      </div>
      <div class="actions mt10">
        <GamePlayBtn :gameInfo="game" class="action-btn" />
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
  color: #000;

  .thumbnail {
    display: flex;
    justify-content: center;

    img {
      border-radius: 10px;
      margin: 20px 0px;
    }
  }

  .zemtown-body {



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

  .actions {
    display: flex;
    justify-content: space-between;

    :deep(.play-btn) {
      display: flex;
      align-items: center;
      justify-content: center;

      li {
        margin-left: 10px;
      }
    }

    .action-btn {
      width: 48%;
    }
  }
}
</style>
