<template>
  <li v-if="!isLiked" @click="setLike">
    <i class="xi-heart-o like-icon" style="font-size:22px; color:#ff6e17;cursor: pointer;"></i>
    {{ likeCnt }}
  </li>
  <li v-else @click="unsetLike">
    <i class="xi-heart like-icon" style="font-size:22px; color:#ff6e17; cursor: pointer;"></i>
    {{ likeCnt }}
  </li>
</template>

<script setup lang="ts">
import _ from 'lodash'

const props = defineProps({
  feed: Object
})
const emit = defineEmits(['refresh'])

const isLiked = ref(props.feed.liked)
const likeCnt = ref(props.feed.like_cnt)

const isLogin = computed(() => useUser().user.value.isLogin)

const setLike = _.debounce(async () => {
  if (!isLogin.value) {
    useModal().openLoginModal();
    return;
  }
  const { data, error } = await post.like(props.feed.id)
  if (!error.value) {
    isLiked.value = true
    likeCnt.value++;
  }

}, 300)

const unsetLike = _.debounce(async () => {
  if (!isLogin.value) {
    useModal().openLoginModal();
    return;
  }
  const { data, error } = await post.unlike(props.feed.id)
  if (!error.value) {
    isLiked.value = false
    likeCnt.value--;
  }
}, 300)



// @Component({
//     components: {},
//     computed: {...mapGetters(["user"])},
// })
// export default class LikeBtn extends Vue {
//     @Prop() feed!: any;
//     user!: User;
//     clickManager: ClickManager = new ClickManager();
//     isLiked: boolean = this.feed.liked;
//     likeCnt = this.feed.like_cnt;

//     //todo: 하트 상태 변화
//     sendLike(state: boolean) {
//         // ClickManager.

//         if (this.user) {
//             if (state) {
//                 if (!this.clickManager.doubleClickCheck()) {
//                     this.$api.unlike(this.feed.id)
//                         .then((res: any) => {
//                             if (res.success) {
//                                 this.isLiked = false;
//                                 this.likeCnt--;
//                             }
//                         })
//                         .catch((err: any) => {
//                         })
//                         .finally(() => {

//                         })
//                 }

//             }
//             else {
//                 if (!this.clickManager.doubleClickCheck()) {
//                     this.$api.like(this.feed.id)
//                         .then((res: any) => {
//                             if (res.is_liked) {
//                                 this.isLiked = true;
//                                 this.likeCnt++;

//                                 this.$gtag.event('like_feed', {
//                                     'feedId': this.feed.id,
//                                 });

//                             }
//                         })
//                         .catch((err: any) => {
//                         })
//                 }

//             }
//         }
//         else {
//             this.$modal.show('needLogin')
//         }
//     }
// }
</script>

<style scoped lang="scss">
</style>
