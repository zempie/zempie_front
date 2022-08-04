<template>
    <!-- <img src="~/assets/images/300_300_default_profile.png" /> -->
    <div v-if="tag === 'div'" :class="user && user.uid ? 'user-avatar' : ''"
        :style="`background: url('${profile_url}') center center  / cover no-repeat; background-size: cover;`"></div>

    <span v-else-if="tag === 'span'"
        :style="`background: url('${profile_url}') center center  / cover no-repeat; background-size: cover;`"></span>
    <!-- 
   <p
        :class="user && user.uid ? 'user-avatar' : ''"
        @click="moveUserPage"
        v-else-if="tag === 'p'"
        :style="`background: url('${picture}') center center  / cover no-repeat; background-size: cover;`"></p> -->
</template>

<script setup lang="ts">

const $router = useRouter();

const props = defineProps({
    user: Object,
    tag: {
        default: 'div',
        type: String
    }

})
const profile_url = ref('')

onMounted(() => {
    profile_url.value = props.user?.picture ? props.user.picture + `?t=${Date.now()}` : `/images/300_300_default_profile.png`
})
    // @Prop() user!: any;
    // @Prop() tag !: string;

    // picture = ''

    // async mounted() {
    //     await this.$store.dispatch("loginState");
    //     if (this.user) {

    //         this.picture = this.user.picture ? this.user.picture + `?t=${Date.now()}` : '/img/300_300_default_profile.png'
    //     }else{
    //         this.picture = '/img/300_300_default_profile.png'
    //     }
    // }

    // moveUserPage() {
    //     if(this.user.channel_id)
    //     this.$router.push(`/${this.$i18n.locale}/channel/${this.user.channel_id}/timeline`)
    // }

</script>

<style scoped lang="scss">
.user-avatar {
    cursor: pointer;
}
</style>
