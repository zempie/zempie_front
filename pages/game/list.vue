<template>
  <div class="content">

    <div class="visual-title">
      <h2><span>Games</span></h2>
    </div>
    <!-- <div class="jam-visual-title"></div> -->
    <div class="tab-search-swiper">

      <swiper class="swiper-area" :slides-per-view="5" :options="TSSswiperOption">
        <swiper-slide>
          <a @click="clickCategory(0);" :class="category === 0 ? 'active' : ''">
            game
            <!-- {{ $t('projectList.banner.text') }} -->
          </a>
        </swiper-slide>
        <swiper-slide>
          <a @click="clickCategory(3);" :class="category === 3 ? 'active' : ''">
            zem
            <!-- {{ $t('gameList.jam') }} -->
          </a>
        </swiper-slide>
      </swiper>
    </div>

    <!-- TODO: 게임 갯수 표현: 게임 100개 이상일때 주석 제거 -->
    <!-- <dl class="area-title">
      <dt>Games <span>{{ games.length }}</span></dt>
    </dl> -->

    <transition name="component-fade" mode="out-in">
      <ul>
        <!-- <transition-group name="list-complete" > -->
        <div class="card-game">
          <GameCardSk v-for="sk in 16" />
        </div>
        <!-- <GameCard v-for="game in games" :key="game.id" :game="game" /> -->
        <!-- </transition-group> -->

        <!--            <li class="more-card" v-if="games && games.length>3">-->
        <!--                <div>-->
        <!--                    <h3><i class="uil uil-plus"></i></h3>-->
        <!--                    <p>모두보기</p>-->
        <!--                </div>-->
        <!--            </li>-->
      </ul>

    </transition>
    <div ref="div"></div>
  </div>
</template>

<script setup lang="ts" >
import { Swiper, SwiperSlide } from 'swiper/vue'

import 'swiper/css';

// metaSetting !: MetaSetting;
// toast = new Toast();

// games: any = [];
const category = ref(0);

// //parameters
// limit: number = 20;
// offset: number = 0;
// sort: string = 'c';
// dir: string = 'asc'

// //state
// isAddData: boolean = false;
// hasData: boolean = true;


// keyword: string | (string | null)[] = '';
const TSSswiperOption = ref({
  slidesPerView: 8,
  spaceBetween: 0,
  breakpoints: {
    300: {
      slidesPerView: 2.5
    },
    480: {
      slidesPerView: 3.5
    },
    768: {
      slidesPerView: 4.5
    },
    992: {
      slidesPerView: 6
    },
    1200: {
      //slidesPerView: 7
    }
  }
})




// async mounted() {
//     // console.log(useScroll)
//   // const { x, y, isScrolling, arrivedState, directions } = useScroll(this.el)


//     // console.log(x,y)
//     await this.$store.dispatch("loginState");
//     this.fetch()
//     this.metaSetting = new MetaSetting({
//         title: `${this.$t('gameList')} | Zempie.com`, //게임 리스트
//         meta: [
//             {name: 'description', content: `${this.$t('gameList.desc')}`},
//             {property: 'og:url', content: `${this.$store.getters.homeUrl}/${this.$i18n.locale}/gameList`},
//             {property: 'og:title', content: `${this.$t('gameList')} | Zempie.com`},
//             {property: 'og:description', content: `${this.$t('gameList.desc')}`},
//         ]
//     });
//     window.addEventListener("scroll", this.scrollCheck);
// }

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

function clickCategory(selected: number) {
  category.value = selected
  // this.initData();
  // this.fetch();

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
.toasted,
.toast-success {
  color: #F97316 !important;
  border-color: #F97316 !important;
}

.section-banner {
  padding: 0;
  display: flex;
  align-content: space-around;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.stats-decoration-title {
  padding: 2px 6px;
  font-size: 16px;
  text-overflow: ellipsis;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  color: #fff;
  border-radius: 6px;
  background-color: #1d2333;
}

.cf-info {
  height: 100%;
}

.cf-img {
  background-color: #f39800;
}

.swiper-slide {
  cursor: pointer;
}


.list-complete-item {
  display: inline-block;
  margin-right: 10px;
}

.list-complete-enter,
.list-complete-leave-to

/* .list-complete-leave-active below version 2.1.8 */
  {
  opacity: 0;
  transform: translateY(30px);
}

.list-complete-enter-active {
  transition: all 1s;
}

.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease;
}

.component-fade-enter-from,
.component-fade-leave-to {
  opacity: 0;
}
</style>
