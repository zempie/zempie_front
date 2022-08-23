<template>
  <div v-if="gameInfo" class="visual-info-left" style="background-color:#f973165c;">
    <dl>
      <dt>
        <dl>
          <dt>
            &nbsp;
            <div
              :style="`background:url(${gameInfo?.url_thumb}) center center / cover no-repeat; background-size:cover;`">
              <!--                                <span></span>-->
            </div>
          </dt>
          <dd>
            <h2> {{ gameInfo.title }}<span></span></h2>
            <h3>by@ {{ gameInfo.user?.name }}</h3>

            <div class="tag-item secondary" v-for="hashtag in hashtags" :key="hashtag"><a>{{ hashtag }}</a>
            </div>
          </dd>
        </dl>
      </dt>

      <dd>
        <div class="like-btn" style="flex-direction: column;">
          <!-- <i
                            v-if="!isLike"
                            class="xi-heart-o like-icon"
                            style="font-size:22px; color:#ff6e17;cursor: pointer;" @click="sendLike(true)">

                        </i>
                        <i
                            v-else class="xi-heart like-icon"
                            style="font-size:22px; color:#ff6e17; cursor: pointer;" @click="sendLike(false)">
                        </i>
                        <p style="color:#fff">{{ likeCnt }}</p> -->
        </div>

        <a v-if="gameInfo.stage !== eGameStage.DEV" @click="playGame" class="btn-default w150"
          style="margin-left:12px">Play Game</a>
      </dd>
    </dl>
  </div>

</template>

<script setup lang="ts">
import { IGame, eGameStage } from '~~/types';
import { PropType } from 'vue';

const hashtags = computed(() => props.gameInfo.hashtags.length > 0 ? props.gameInfo.hashtags.split(",") : undefined)

const props = defineProps({
  gameInfo: Object as PropType<IGame>
})


function playGame() {
  window.open(
    `/play/${props.gameInfo.pathname}`, "_blank");
}
</script>

<style lang="scss" scoped>
</style>
