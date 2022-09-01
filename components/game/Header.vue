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
            <h2> {{  gameInfo.title  }}<span></span></h2>
            <h3 @click="moveUserPage" style="cursor:pointer">By

              {{  gameInfo.user?.name  }}
            </h3>

            <div class="tag-item secondary" v-for="hashtag in hashtags" :key="hashtag"><a>{{  hashtag  }}</a>
            </div>
          </dd>
        </dl>
      </dt>

      <dd>
        <div class="like-btn" style="flex-direction: column;">
          <i v-if="!isLike" class="xi-heart-o like-icon" style="font-size:22px; color:#ff6e17;cursor: pointer;"
            @click="setLike">

          </i>
          <i v-else class="xi-heart like-icon" style="font-size:22px; color:#ff6e17; cursor: pointer;"
            @click="unsetLike">
          </i>
          <p style="color:#fff">{{  likeCnt  }}</p>
        </div>

        <a v-if="gameInfo.stage !== eGameStage.DEV" @click="playGame" class="btn-default w150"
          style="margin-left:12px">Play Game</a>
      </dd>
    </dl>
  </div>

</template>

<script setup lang="ts">
import _ from 'lodash'
import { IGame, eGameStage } from '~~/types';
import { useLocalePath } from 'vue-i18n-routing';
import { PropType } from 'vue';

const localePath = useLocalePath();
const router = useRouter()
const hashtags = computed(() => props.gameInfo.hashtags.length > 0 ? props.gameInfo.hashtags.split(",") : undefined)

const props = defineProps({
  gameInfo: Object as PropType<IGame>
})
const isLike = ref(props.gameInfo?.is_like)
const likeCnt = ref(props.gameInfo?.count_heart)


function playGame() {
  window.open(
    `/play/${props.gameInfo.pathname}`, "_blank");
}

const setLike = _.debounce(async () => {
  isLike.value = true;

  const payload = {
    game_id: props.gameInfo.id,
    on: true
  }
  const { data, error, refresh } = await useFetch(`/game/heart`, getZempieFetchOptions('post', true, payload));
  if (!error.value) {
    likeCnt.value++;
  }
}, 300)

const unsetLike = _.debounce(async () => {
  isLike.value = false;

  const payload = {
    game_id: props.gameInfo.id,
    on: false
  }
  const { data, error, refresh } = await useFetch(`/game/heart`, getZempieFetchOptions('post', true, payload));
  if (!error.value) {
    likeCnt.value--;
  }

}, 300)

function moveUserPage() {
  router.push(localePath(`/channel/${props.gameInfo.user.channel_id}`))
}

</script>

<style lang="scss" scoped>
.like-btn {
  height: 65px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

@media all and (max-width: 479px) {
  .visual-info-left {
    width: 100%;
  }

}

@media all and (min-width: 480px) and (max-width: 767px) {
  .visual-info-left {
    width: 100%;
  }


}

@media all and (min-width: 768px) and (max-width: 991px) {}

@media all and (min-width: 992px) and (max-width: 1199px) {}

@media all and (min-width: 1200px) {}
</style>
