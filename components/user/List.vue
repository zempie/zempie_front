<template>
  <transition name="component-fade" mode="out-in">
    <!-- <ul v-if="isPending" class="card-member">
      <UserCardSk v-for="user in 4" />
    </ul> -->
    <ClientOnly>
      <ul class="card-follow">
        <UserCard v-for="user in users" :user="user"></UserCard>
      </ul>
    </ClientOnly>
  </transition>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { IUser } from '~~/types';

const props = defineProps({
  users: Array as PropType<IUser[]>,
  isPending: {
    type: Boolean,
    default: true,
  }
})

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
