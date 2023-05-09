<template>
  <div class="coin-card" @click="onClickCoin" :class="{ active: isActive }">
    <div class="img-container">
      <img :src="coin?.img" />
      <p>{{ coin?.zem }} ZEM</p>
    </div>
    <p>₩{{ coin?.price }}</p>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  coin: Object,
  isActive: Boolean
})

const emit = defineEmits(['activate'])

function onClickCoin() {
  if (!props.isActive) {
    emit('activate', props.coin)
  }
}

</script>
<style scoped lang="scss">
.coin-card {
  text-align: center;
  border-radius: 20px;
  border: 1px solid #bbb;
  width: 23%;
  margin: 1%;
  padding-bottom: 5px;
  cursor: pointer;

  &.active,
  &:hover {
    outline: 3px solid #f9741684;
    // box-shadow: 00 0 8px #f9741684;
  }

  .img-container {
    background-color: #ededed;
    border-top-right-radius: 20px;
    border-top-left-radius: 20px;

    img {
      border-top-right-radius: 20px;
      border-top-left-radius: 20px;
      width: 100%;
    }
  }

  p {
    font-size: 18px;
    text-align: center;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

@media all and (max-width: 479px) {
  .coin-card {
    width: 100%;
  }
}

@media all and (min-width: 480px) and (max-width: 767px) {
  .coin-card {
    width: 48%;
  }
}

@media all and (min-width: 768px) and (max-width: 991px) {
  .coin-card {
    width: 48%;
  }
}


@media all and (min-width: 992px) and (max-width: 1199px) {

  .coin-card {
    width: 31.333%;

  }
}
</style>