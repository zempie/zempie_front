<template>
  <div class="content" ref="el">
    <ClientOnly>
      <div class="visual-title">
        <h2><span>Games</span></h2>

      </div>
      <!-- <div class="jam-visual-title"></div> -->
      <div class="tab-search-swiper">

        <div class="swiper-area uppercase">
          <div class="swiper-slide">
            <a @click="clickCategory(0);" :class="category === 0 ? 'active' : ''">
              game
              <!-- {{ $t('projectList.banner.text') }} -->
            </a>
          </div>
          <div class="swiper-slide">
            <a @click="clickCategory(3);" :class="category === 3 ? 'active' : ''">
              zem
              <!-- {{ $t('gameList.jam') }} -->
            </a>
          </div>
        </div>
      </div>

      <!-- TODO: 게임 갯수 표현: 게임 100개 이상일때 주석 제거 -->
      <!-- <dl class="area-title">
      <dt>Games <span>{{ games.length }}</span></dt>
    </dl> -->
      <ul>
        <div class="card-game">
          <TransitionGroup name="fade">
            <GameCardSk v-if="isPending" v-for="sk in 16" :key="sk" />
            <GameCard v-else v-for="game in games" :gameInfo="game" :key="game.id" />
          </TransitionGroup>
        </div>
      </ul>
    </ClientOnly>

  </div>
</template>

<script setup lang="ts" >
import _ from 'lodash'

const LIMIT_SIZE = 20
const el = ref<HTMLElement>(null)
const category = ref(0);
const limit = ref(LIMIT_SIZE)
const offset = ref(0)
// sort: string = 'c';
// dir: string = 'asc'

const isAddData = ref(false);
const games = ref([])
const isPending = ref(true)




await fetch()

onMounted(() => {
  scroll()
})


function scroll() {
  window.onscroll = () => {
    if (document.documentElement.scrollTop + window.innerHeight >= document.documentElement.scrollHeight) {
      if (isAddData.value) {
        offset.value += limit.value;
        fetch()
      }
    }
  }
}

async function fetch() {
  const payload = {
    limit: limit.value,
    offset: offset.value,
    category: category.value
  }

  const { data } = await game.list(payload)
  const { result } = data.value


  if (isAddData.value) {
    if (result.games.length > 0) {
      games.value = [...games.value, ...result.games]
    }
    else {
      isAddData.value = false
    }
  }
  else {
    games.value = result.games;
    if (result.games.length < LIMIT_SIZE) {
      isAddData.value = false;
    } else {
      isAddData.value = true
    }

  }
  isPending.value = false
}
// beforeDestroy() {
//     this.$store.dispatch('resetResearchData')
//     this.initData();
//     window.removeEventListener("scroll", this.scrollCheck);
// }

// fetch() {
//     const obj = {
//         limit: this.limit,
//         offset: this.offset,
//         category: this.category,
//         sort: this.sort,
//         dir: this.dir
//     };

//     this.$api.gameList(obj)
//         .then((res: any) => {
//             if (this.isAddData) {
//                 if (res.result.games.length > 0) {
//                     this.games = [...this.games, ...res.result.games]
//                 }
//                 else {
//                     this.hasData = false
//                     window.removeEventListener("scroll", this.scrollCheck);
//                 }
//             }
//             else {
//                 this.games = res.result.games;
//                 this.isAddData = true
//             }

//         })


// }

const clickCategory = _.debounce((selected: number) => {
  category.value = selected
  initData()
  fetch()
}, 300)

function initData() {
  limit.value = LIMIT_SIZE;
  offset.value = 0;
  isAddData.value = false
  games.value = []
}


    // initData() {
    //     window.addEventListener("scroll", this.scrollCheck);
    //     this.isAddData = false
    //     this.hasData = false
    //     this.limit = 20;
    //     this.offset = 0;
    //     this.games = [];
    //     this.sort = 'c';
    //     this.dir = 'asc';
    // }

    // scrollCheck() {
    //  if((this.$refs.div as any).offsetTop <= document.documentElement.scrollTop + document.documentElement.offsetHeight) {
    //      this.offset += this.limit;
    //      this.fetch();
    //  }
    //   // console.log( , )
    //     // if (scrollDo
    //     // ne(document.documentElement)) {
    //     //
    //     //     this.offset += this.limit;
    //     //     this.fetch();
    //     // }
    // }


</script>

<style scoped>
.swiper-slide {
  cursor: pointer;
}

.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.fade-leave-active {
  position: absolute;
}
</style>
