<template>
  <div class="user-menu">
    <NuxtLink id="myChannel" :to="$localePath(`/${user?.nickname}`)">
      {{ $t('myChannel') }}
    </NuxtLink>
    <NuxtLink id="gameStudio" :to="$localePath('/project/list')">
      {{ $t('gameStudio') }}
    </NuxtLink>

    <NuxtLink :to="$localePath(`/myaccount`)">
      {{ $t('my.account') }}
    </NuxtLink>
  </div>
</template>
<script setup lang="ts">
import { PropType } from 'vue';
import { IUser } from '~~/types';

const { $localePath } = useNuxtApp()

defineProps({
  user: Object as PropType<IUser>

})

</script>
<style scoped lang="scss"></style>