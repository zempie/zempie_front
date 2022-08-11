<template>
  <NuxtLayout name="user-setting">
    dslkfl;skdf;lskdfl;kd;l
    <dl class="area-title">
      <dt>Manage Group</dt>
    </dl>
    <Transition name="component-fade" mode="out-in">
      <ul class="card-manage-group" v-if="communities?.length">

        <CommunityCard v-show="!pending" v-for="community in communities" :community="community" :key="community?.id">
          <template v-slot:subBtn>
            <CommunitySubscribeBtn :community="community" class="w100p" @fetch="refresh" />
          </template>
        </CommunityCard>
        <CommunityCard v-for="community in communities" :key="community?.id" :community="community">
          <template v-slot:subBtn>
            <CommunitySubscribeBtn :community="community" @fetch="refresh" />
          </template>
        </CommunityCard>
      </ul>

      <div class="no-result" v-else>
        <h1> {{ $t('noJoined.community') }} </h1>
        <img src="/images/not-found.png" width="100px" height="100px" />
      </div>

    </Transition>
    <!-- <modal :clickToClose="false" class="modal-area-type" name="deleteConfirm" width="90%" height="auto"
               :maxWidth="380"
               :scrollable="true"
               :adaptive="true">
            <div class="modal-alert">
                <dl class="ma-header">
                    <dt>{{ $t('information') }}</dt>
                    <dd>
                        <button @click="$modal.hide('deleteConfirm')"><i class="uil uil-times"></i></button>
                    </dd>
                </dl>
                <div class="ma-content">
                    <h2> {{$t('leave.community.text1')}}<br/>※ {{$t('leave.community.text2')}}</h2>
                    <div>
                        <button class="btn-default w48p" @click="yesUnsubscribe">{{ $t('yes') }}</button>
                        <button class="btn-gray w48p" @click="$modal.hide('deleteConfirm')">{{ $t('no') }}</button>
                    </div>
                </div>
            </div>
        </modal> -->
  </NuxtLayout>
</template>

<script setup lang="ts">

const userInfo = computed(() => useUser().user.value.info)

const { data: communities, error, pending, refresh } = await user.joinedCommunity(userInfo.value?.id)


// import {Component, Prop, Vue} from "vue-property-decorator";

// import CommunityCard from "@/components/community/_communityCard.vue";

// import SubscribeBtn from "@/components/community/_subscribeBtn.vue";
// import {AxiosError, AxiosResponse} from "axios";
// import {mapGetters} from "vuex";
// import {User} from "@/types";

// @Component({
//     components: {CommunityCard, SubscribeBtn},
//     computed: {...mapGetters(["user"])},
// })
// export default class ManageJoinedGroup extends Vue {
//     communityList: any = [];
//     user!: User;
//     unCommunityId: string = ''

//     mounted() {
//         this.fetch();
//     }

//     fetch() {

//         this.$api.joinedCommunityList(this.$store.getters.user.id)
//             .then((res: any) => {
//                 this.communityList = res;
//             })
//             .catch((err: any) => {

//             })


//     }

//     unsubscribe(communityId: string) {
//         this.$modal.show('deleteConfirm')
//         this.unCommunityId = communityId;
//     }

//     yesUnsubscribe() {
//         this.$api.unsubscribe({user_id: this.user.id, community_id: this.unCommunityId})
//             .then((res: any) => {
//                 this.fetch();
//             })
//             .catch((err: any) => {
//                 if (err.message) {
//                     alert(err.message)
//                 }
//             })
//             .finally(() => {
//                 this.$modal.hide('deleteConfirm')
//             })
//     }

// }
</script>

<style lang="scss" scoped>
.no-result {
  display: flex;
  align-content: center;
  justify-content: center;
  flex-direction: column;
  flex-wrap: wrap;

  h1 {
    color: #333;
    font-size: 18px;
    margin-bottom: 10px;
  }

  img {
    margin: 0 auto
  }
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
