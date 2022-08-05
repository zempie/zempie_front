<template>
  <!-- <a class="btn-sub w120 mr10" v-if="$route.meta.title === 'ManageJoinedGroup'" @click="unsubscribe">
    {{ $t('isSubscribing') }}</a> -->
  <a class="btn-default w120 mr10" :community="community" @click.stop="subscribe">{{
      $t('subscribe.btn')
  }}</a>

  <!-- <a class="btn-sub w120 mr10" v-else @click="unsubscribe">{{ $t('isSubscribing') }}</a> -->
</template>

<script setup lang="ts">

const props = defineProps({
  community: Object
})

async function subscribe() {
  const { data, error } = await community.subscribe(props.community.id, useUser().user.value.info.id)

}



    // subscribe() {
    //     if (this.user) {
    //         this.$api.subscribe({user_id: this.user.id, community_id: this.community.id})
    //             .then((res: AxiosResponse) => {
    //                 this.$emit('reFetch')
    //             }).catch((err: AxiosError) => {
    //             if (err.message) {
    //                 alert(err.message)
    //             }
    //         })
    //     }
    //     else {
    //         this.$store.commit('needLogin', true)
    //         this.$modal.show('needLogin')
    //     }
    // }

    // unsubscribe() {
    //     this.$emit('unsubscribe', this.community.id)

    // }
</script>

<style scoped lang="scss">
</style>