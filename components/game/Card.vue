<template>
  <li style="position: relative ">
    <!-- <img v-if="gameInfo?.game_jam?.is_awarded" src="/images/medal2.png"
      style="position: absolute; right:10px; top:10px" /> -->

    <div @click="moveGamePage"
      :style="`background: url( ${thumbnail} ) center center / cover no-repeat; background-size: cover;`"></div>
    <dl>
      <dt>
        <UserAvatar :user="gameInfo?.user" :tag="'p'"></UserAvatar>
      </dt>
      <dd>
        <h2 @click="playGame">
          {{ gameInfo?.title }}
        </h2>
        <p>{{ gameInfo.user?.name }}</p>
        <ul>
          <li>
            <img src="/images/zempie_game_icon.svg" alt="" />
          </li>
        </ul>
      </dd>
    </dl>
  </li>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { IGame } from '~~/types';

import { useLocalePath } from "vue-i18n-routing";

const localePath = useLocalePath();
const $router = useRouter();

const props = defineProps({
  gameInfo: Object as PropType<IGame>
})


const thumbnail = computed(() => props.gameInfo?.url_thumb_webp || props.gameInfo?.url_thumb || '/images/default.png')


// thumbnail: any = "";

// mounted() {
//     this.thumbnail = this.game.url_thumb_webp || this.game.url_thumb;
// }

// enterCard() {
//     this.thumbnail =
//         this.game.url_thumb_gif ||
//         this.game.url_thumb_webp ||
//         this.game.url_thumb;
// }

// leaveCard() {
//     this.thumbnail = this.game.url_thumb_webp || this.game.url_thumb;
// }

function playGame() {
  window.open(`/play/${props.gameInfo.pathname}`, "_blank");
}

function moveGamePage() {
  useGame().setGame(props.gameInfo)
  $router.push(localePath(`/game/${props.gameInfo?.pathname}`))

}
</script>

<style scoped lang="scss">
.thumbnail:hover,
.thumbnail {
  transition: 0.5s;
}
</style>
