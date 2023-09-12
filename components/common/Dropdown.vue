<template>
  <div class="custom-dropdown" ref="dropdownContainer">
    <slot v-if="isCustomBtn" name="btn"></slot>
    <button v-else class="menu-btn" @click="toggleDropdown">
      <IconEllipsisH :color="color" />
    </button>
    <ul v-if="isDropdownOpen" class="more-list" @click="onClickOption">
      <slot name="options"></slot>
    </ul>
  </div>
</template>
<script setup lang="ts">
const isDropdownOpen = ref(false)
const dropdownContainer = ref()
const isMobile = computed(() => useCommon().common.value.isMobile)

defineProps({
  options: Array<String>,
  isCustomBtn: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: '#fff'
  }
})

defineExpose({ toggleDropdown })

watch(
  () => useCommon().common.value.isPopState,
  (val) => {
    if (!val) {
      closeDropdown()
    }
  })

onMounted(() => {
  // page에서 작동을 안해서 임시 추가
  useRouterLeave()
  document.addEventListener("click", handleClickOutside);
})
onBeforeMount(() => {
  document.removeEventListener("click", handleClickOutside);
})

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;

  if (isMobile.value && !isDropdownOpen.value) {
    useCommon().setPopState(true)
  }
}

function closeDropdown() {
  isDropdownOpen.value

  if (isMobile.value) {
    useCommon().setPopState(false)
  }
}

function handleClickOutside(event) {
  const container = dropdownContainer.value;

  if (!container?.contains(event.target)) {
    isDropdownOpen.value = false;
  }
}

function onClickOption() {
  isDropdownOpen.value = false;
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
  cursor: pointer;

}

.selected-option {
  padding: 10px;
  border-radius: 8px;
}

.menu-btn {
  background: none;
  border: none;
  cursor: pointer;

}

.more-list {
  min-width: 130px;
  position: absolute;
  background-color: #fff;
  list-style: none;
  padding: 10px;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  right: 10px;
  top: 23px;
  width: auto;

}
</style>