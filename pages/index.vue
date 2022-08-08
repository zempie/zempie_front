<template>
  <div class="wrap">

    <div class="main-bg">
      <div class="main-copy">
        <p>
          <img src="/images/main_copy.svg" width="500" alt="" title="" />
        </p>
      </div>

      <div class="main-visual">


        <h2>
          <span style="font: 36px/46px 'Jalnan'">Recent games</span>
        </h2>

        <ul style="margin: 40px 0px">
          <span class="card-game">
            <GameCardSk v-for="game in 8" />
          </span>
        </ul>

      <div class="main-visual">
        <h2><span style="font: 36px/46px 'Jalnan'">Communities</span></h2>

        <div class="card-timeline">
          <CommunityCard v-for="commi in 4" />
        </div>
      </div>

      <div class="main-visual">
        <h2><span style="font: 36px/46px 'Jalnan'">Recent posts</span></h2>

        <ul style="margin-top: 40px" class="post-container">
          <li class="thumbmail" v-for="post in 8"></li>
        </ul>
      </div>
      <!-- <div class="main-upload">
        <p></p>
      </div> -->

      <div class="main-visual">
        <h2><span style="font: 36px/46px 'Jalnan'">Communities</span></h2>

        <div class="card-timeline">
          <CommunityCardSk v-show='cPending' v-for="commi in 4" />
          <CommunityCard v-show="!cPending" v-for="community in communities" :community="community"
            :key="community.id" />



        </div>
      </div>

      <div class="main-visual">
        <h2><span style="font: 36px/46px 'Jalnan'">Recent posts</span></h2>

        <ul style="margin-top: 40px" class="post-container">
          <li class="thumbmail" v-for="post in 8"></li>
        </ul>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script lang="ts" setup>
const GAME_COUNT = 8;
const COMMUNITY_COUNT = 4;
const POST_COUNT = 8;

const { data, pending, error } = await game.list({ limit: GAME_COUNT, offset: 0 })
const { data: communities, pending: cPending, error: cError } = await community.list({ limit: COMMUNITY_COUNT })


</script>

<style scoped lang="scss">
.mv-animal02 {
  z-index: 998 !important;
}

.mv-play {
  top: 0px;
}

.main-bg {
  background: url('/images/main_bg01_fixed.png') center 70px no-repeat;
  background-size: cover;
  padding-bottom: 100px;
}


.main-visual>h3 {
  background: none !important;
  height: auto !important;
}

.post-container {
  display: flex;
  flex-wrap: wrap;
  width: 1225px;
  margin: auto;
  justify-content: center;
  .thumbmail {
    background-color: #ededed;
    height: 240px;
    margin: 3px;
    width: 24%;
    transition: all 0.4s ease-in-out;
  }
}

.card-timeline {
  margin: 40px 0px;
}

@media all and (max-width: 479px) {
  .main-visual {
    width: 100%;
    .card-game,
    .card-timeline {
      width: 100%;
      margin: 0 auto;
      li {
        border-radius: 0%;
      }
    }
  }

  .post-container {
    width: 100%;
    margin: 0 auto;

    .thumbmail {
      width: 100%;
      margin: 2% 0 2% 0;
    }
  }
}

@media all and (min-width: 480px) and (max-width: 767px) {
  .post-container {
    width: 470px;

    .thumbmail {
      width: 48%;
      margin: 1%;
    }
  }
}

@media all and (min-width: 768px) and (max-width: 991px) {
  .post-container {
    width: 770px;

    .thumbmail {
      width: 31.333%;
      margin: 1%;
    }
  }
}

@media all and (min-width: 992px) and (max-width: 1199px) {
  .post-container {
    width: 993px;

    .thumbmail {
      width: 31.333%;
      margin: 1%;
    }
  }
}





.ProseMirror {
  >*+* {
    margin-top: 0.75em;
  }

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }
}

.content {
  padding: 1rem 0 0;

  h3 {
    margin: 1rem 0 0.5rem;
  }

  pre {
    border-radius: 5px;
    color: #333;
  }

  code {
    display: block;
    white-space: pre-wrap;
    font-size: 0.8rem;
    padding: 0.75rem 1rem;
    background-color: #e9ecef;
    color: #495057;
  }
}
</style>
