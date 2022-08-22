<template>
  <div id="gamePage">
    <ClientOnly>
      <iframe ref="game" class="iframe" :style="`height:${iframeHeight};`"
        :src="`${config.LAUNCHER_URL}/game/${gamePath}`"></iframe>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { getIdToken } from 'firebase/auth'

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig();

const { $firebaseAuth } = useNuxtApp()

const url = ref('');
const iframeHeight = ref('');
const game = ref<HTMLIFrameElement>()
const gameData = ref()
const initLauncher = ref(false)
const gamePath = computed(() => route.params.id)


definePageMeta({
  layout: 'layout-none',
});

const { data, error, pending } = await useFetch<{ result: { game: {}, my_emotions: {}, my_heart: boolean } }>(`/game/${gamePath.value}`, getZempieFetchOptions('get', false))

onMounted(async () => {
  if (data.value) {
    const { game, my_emotions, my_heart } = data.value.result
    gameData.value = game
    // url.value = `/${config.LAUNCHER_URL}/game/${gamePath.value}`;

    window.addEventListener("message", onMessage);
    window.addEventListener("resize", onResize);
    onResize();
  }
})

function onResize() {
  iframeHeight.value = `${window.innerHeight}px`;
}


// import { Vue, Component, Watch, Prop } from "vue-property-decorator";
// import firebase from "firebase/app";
// import { LoginState } from "@/store/modules/user";
// import MetaSetting from "@/script/metaSetting";

// export default class Play extends Vue {

//   metaSetting !: MetaSetting;
//   gameData: any;
//   initLauncher: boolean = false;

//   async mounted() {
//     this.gameData = this.$store.getters.gameByPathname(this.pathname);

//     if (!this.gameData) {
//       //todo 게임 요청
//       const result = await this.$api.game(this.pathname);
//       this.metaSetting = new MetaSetting({
//         title: `${result.game?.title} | Zempie.com`, //게임 리스트
//         meta: [
//           { name: 'description', content: result.game?.description },
//           { property: 'og:url', content: `${this.$store.getters.homeUrl}/play/${result.game?.pathname}` },
//           { property: 'og:title', content: `${result.game?.title} | Zempie.com` },
//           { property: 'og:description', content: result.game?.description },
//           { property: 'og:image', content: result.game?.url_thumb },

//         ]
//       });
//       if (!result && result.error) {
//         console.error((result && result.error) || "error");
//       } else {
//         this.gameData = result.game;
//         // const title = this.gameData?.title;
//         // const description = this.gameData?.description;
//         // const thumb = this.gameData?.url_thumb;
//         // const author = this.gameData?.user.name;

//       }
//     }

//     this.url = `${process.env.VUE_APP_LAUNCHER_URL}game/${this.gameData.pathname}`;
//     // document.title = this.gameData.title;

//     // this.url = `game/${this.gameData.pathname}`;

// window.addEventListener("message", this.onMessage);
// window.addEventListener("resize", this.onResize);
// this.onResize();

//     // this.tagEvent();
//   }

//   beforeDestroy() {
//     window.removeEventListener("message", this.onMessage);
//     window.removeEventListener("resize", this.onResize);

//     // if (this.metaSetting) {
//     //     this.metaSetting.reset();
//     //     this.metaSetting = null;
//     // }
//   }


//   @Watch("$store.getters.idToken")
function onChangedToken() {
  toMessage({
    type: "@updateToken",
    token: useCookie(config.COOKIE_NAME).value
  });
}

async function onMessage(msg: MessageEvent) {
  console.log(msg)
  const { type, channel_id } = msg.data;

  switch (type) {
    case "@initLauncher": {
      initLauncher.value = true;
      toMessage({ type: "@initParent" });
      onChangedToken();
      break;
    }
    case "@refreshToken": {
      if (useCookie(config.COOKIE_NAME).value) {
        const idToken = await getIdToken($firebaseAuth);
        console.log(idToken)
      }
      break;
    }
    case "@requestLogin": {
      this.$store.commit("redirectRouter", route.fullPath);
      await router.replace("/login");
      break;
    }
    case "@exit": {
      this.exit();
      break;
    }
    case "@moveChannel": {
      await router.push(`/${this.$i18n.locale}/channel/${channel_id}`);
      break;
    }
  }
}

function toMessage(message: any) {
  const iframe = game.value
  if (iframe.contentWindow) {
    iframe.contentWindow.postMessage(message, "*");
  }
}

function exit() {
  if (this.$store.getters.fromRouterName) {
    router.back();
  } else {
    router.push(`/${this.$i18n.locale}`);
  }
}

// }
</script>
<style lang="scss" scoped>
.iframe {
  border: 0;
  display: block;
  width: 100%;
  height: 100vh;
}

.exitButton {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 30px;
  height: 30px;
  line-height: 30px;
  padding: 0;
  background-color: initial;
  border: 0;
  color: #727272;
  border-radius: 5px;
  outline: 0;

  &:hover {
    background-color: #ececec;
  }

  &:active {
    background-color: #dddddd;
  }

  i {
    font-size: 24px;
  }
}
</style>
