<template>
  <li v-if="users?.length" v-for="user in users" :key="user.id" class="pointer mb10" @click="onClickUser(user)">
    <dl class="row items-center">
      <dd class="mr10">
        <UserAvatar :user="user" tag="p" style="width:45px; height:45px; border-radius: 50%;" />
      </dd>
      <div class="row justify-between w100p mt0">
        <dt class="w50p">
          <h3 class="font16 text-left ">{{ user.name }}</h3>
          <p class="font13 nickname text-left text-ellipsis">@{{ user.nickname }}</p>
        </dt>
        <UserFollowBtn v-if="isLogin" :user="user" />
      </div>
    </dl>
  </li>
</template>
<script setup lang="ts">
import { IUser } from '~~/types';

const props = defineProps({
  users: Array<IUser>
})

const emit = defineEmits(['onClickUser'])

const isLogin = computed(() => useUser().user.value.isLogin)

function onClickUser(user: IUser) {
  emit('onClickUser', user)
}

</script>
<style scoped lang="scss">
li {
  padding: 13px;
  border: 1px solid #ededed;
  border-radius: 10px;
  text-align: left;

  &:hover {
    color: #000 !important;
  }

  dt {
    display: flex;
    flex-direction: column;
    justify-content: center;

    h3 {
      font-weight: 600;
      color: #000;
    }

    .nickname {
      color: #888
    }
  }


}
</style>