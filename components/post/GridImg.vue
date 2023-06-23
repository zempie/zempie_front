<template>
  <div :class="images?.length > 2 ? 'mul-grid' : images?.length === 1 ? 'single' : 'grid'">
    <div class="img-container" v-for="(img, idx) in images" :key="idx">
      <span v-if="isDelete" @click="deleteImage(idx)" class="pointer zem-color"><i
          class="uil uil-times-circle"></i></span>
      <img :src="img.url" />
    </div>
  </div>
</template>
<script setup lang="ts">

defineProps({
  images: Array,
  isDelete: {
    type: Boolean,
    default: false,
  }
})

const emit = defineEmits(['deleteImg'])

function deleteImage(idx: number) {
  emit('deleteImg', idx)
}

</script>
<style scoped lang="scss">
.single {
  .img-container {
    position: relative;

    span {
      position: absolute;
      top: 5px;
      right: 5px;
      font-size: 20px;
      color: #333;

      &:hover {
        color: #f97316;
      }
    }

    img {
      display: flex;
      width: 100%;
      object-fit: cover;
      max-height: 500px;
      border-radius: 10px;
    }
  }
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(150px, 2fr));
  grid-template-rows: repeat(1, minmax(150px, 2fr));
  grid-column-gap: 10px;
  grid-row-gap: 10px;

  .img-container {
    position: relative;

    span {
      position: absolute;
      top: 5px;
      right: 5px;
      font-size: 20px;
      color: #333;

      &:hover {
        color: #f97316;

      }
    }

    img {
      display: flex;
      width: 100%;
      object-fit: cover;
      height: 150px;
      border-radius: 10px;
    }
  }
}

.mul-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(150px, 2fr));
  grid-template-rows: repeat(2, minmax(150px, 2fr));
  grid-column-gap: 10px;
  grid-row-gap: 10px;


  .img-container {
    position: relative;

    span {
      position: absolute;
      top: 5px;
      right: 5px;
      font-size: 20px;
      color: #333;

      &:hover {
        color: #f97316;

      }
    }

    img {
      display: flex;
      width: 100%;
      object-fit: cover;
      height: 150px;
      border-radius: 10px;
    }
  }
}
</style>