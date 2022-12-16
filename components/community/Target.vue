<template>
  <div class="swiper-area">
    <div
      class="community-slide"
      v-for="postedAt in communities"
      :key="postedAt.id"
    >
      <div class="category-select-finish">
        <div>
          <span
            @click="
              router.push($localePath(`/community/${postedAt?.community.id}`))
            "
            >{{ postedAt?.community?.name }}</span
          >
          /
          <em
            @click="
              router.push(
                $localePath(
                  `/community/${postedAt?.community.id}/${postedAt?.channel.title}`
                )
              )
            "
            >{{ postedAt?.channel?.title }}</em
          >
        </div>
      </div>
    </div>
    <div
      class="community-slide"
      v-for="postedAt in games"
      :key="postedAt.id"
    >
      <div class="category-select-finish">
        <div style="margin-left:0px">
          <span
            @click="
              router.push($localePath(`/game/${postedAt?.game.pathname}`))
            "
            >{{ postedAt?.game?.title }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { PropType } from 'vue'
import { IGame } from '~~/types';

const router = useRouter()
const { $localePath } = useNuxtApp()

const props = defineProps({
  communities: Object,
  games: Array as PropType<{id:number, game:IGame}[]>
})

</script>
<style scoped lang="scss">
.swiper-area {
  &::-webkit-scrollbar-thumb {
    background-color: #b1b1b1;
    border-radius: 10px;
    visibility: hidden;
  }
  &::-webkit-scrollbar {
    padding-top: 5px;
    height: 8px;
  }
  &:hover {
    &::-webkit-scrollbar-thumb {
      visibility: visible;
    }
  }

  overflow-x: scroll;
  height: 65px;
  display: flex;
  padding: 20px 20px 0px 20px;

  .community-slide {
    white-space: nowrap;
    &:not(:last-child) {
      margin-right: 10px;
    }
    .category-select-finish {
      &:hover {
        cursor: pointer;
      }
      height: 30px;
      justify-content: space-around;
      display: flex;
      align-items: center;
      padding: 5.5px 10px;
      border: #f9731657 1px solid;
      border-radius: 5px;
      p {
        width: 17px;
        height: 17px;
        margin-right: 5px;
        border-radius: 50%;
      }

      div {
        margin-left: 10px;
        font-size: 12px;
        line-height: 12px;

        span {
          color: #f97316;
          text-overflow: ellipsis;
          // max-width: 50px;
          overflow: hidden;
          white-space: nowrap;
          display: inline-block;
        }

        em {
          font-style: normal;
          color: #5d5ffe;
          // max-width: 40px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          display: inline-block;
        }
      }

      .cross-btn {
        cursor: pointer;
      }
    }
  }
}
</style>
