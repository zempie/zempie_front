<template>
  <div class="user-menu">
    <NuxtLink id="myChannel" :to="$localePath(`/${user?.nickname}`)">
      <!-- <i class="uil uil-user"></i> -->
      {{ $t('myChannel') }}
    </NuxtLink>
    <NuxtLink id="gameStudio" :to="$localePath('/project/list')">
      <!-- <i class="uil uil-robot"></i> -->
      {{ $t('gameStudio') }}
    </NuxtLink>

    <NuxtLink :to="$localePath(`/myaccount`)">
      <!-- <i class="uil uil-setting"></i> -->
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