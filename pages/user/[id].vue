<template>
  <div>
    <p>Query params page: {{ $route.params.id }}</p>
    <ul>
      <UserInfo :user="data" />
    </ul>
  </div>
</template>
<script setup lang="ts">
import UserInfo from '~/components/_userInfo.vue'

const $route = useRoute();

const result = await useFetchData('get', `/user/${$route.params.id}`)
const { data } = result

</script>