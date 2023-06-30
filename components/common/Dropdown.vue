<template>
  <div class="custom-dropdown" ref="dropdownContainer">
    <button class="msg-menu-btn" @click="toggleDropdown"> <i class="uil uil-ellipsis-h font25"></i></button>
    <ul v-if="isDropdownOpen" class="more-list">
      <slot name="options"></slot>
    </ul>
  </div>
</template>
<script setup lang="ts">
const isDropdownOpen = ref(false)
const dropdownContainer = ref()

defineProps({
  options: Array<String>
})

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
})
onBeforeMount(() => {
  document.removeEventListener("click", handleClickOutside);
})

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}


function handleClickOutside(event) {
  const container = dropdownContainer.value;

  if (!container?.contains(event.target)) {
    isDropdownOpen.value = false;
  }
}

</script>
<style scoped lang="scss">
.custom-dropdown {
  position: relative;
  display: inline-block;
  font-size: 12px;
  line-height: 20px;
  min-width: 10px;
  word-wrap: break-word;
  visibility: visible;

}

.selected-option {
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;

}

.more-list {
  min-width: 100px;
  position: absolute;
  background-color: #fff;
  list-style: none;
  padding: 10px;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  right: 10px;
  top: 23px;



}
</style>