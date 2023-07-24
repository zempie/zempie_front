<template>
  <a v-if="gameInfo.stage !== eGameStage.DEV && gameInfo.game_type === eGameType.Html" @click="playGame"
    class="btn-default mr10 play-btn">{{ $t('playgame') }}

    <li v-if="gameInfo.game_type === eGameType.Html" style="margin-top: 2px;">
      <i class="uil uil-html5-alt"></i>
    </li>
  </a>
</template>
<script setup lang="ts">
import { PropType } from 'vue';
import { IGame, eGameStage, eGameType } from '~~/types';


const props = defineProps({
  gameInfo: Object as PropType<IGame>,

})

function playGame() {
  window.open(`/play/${props.gameInfo.pathname}`, '_blank')
}

</script>
<style scoped lang="scss">
li {
  list-style: none;
}
</style>