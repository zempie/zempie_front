<script setup lang="ts">
import { ElLoading } from 'element-plus'

const loading = ref()

const props = defineProps({
  isLoading: Boolean
})

watch(
  () => props.isLoading,
  (state) => {
    if (state) {
      loading.value = ElLoading.service({
        lock: true,
        text: 'Loading',
        customClass: 'loading-spinner',
        background: 'rgba(0, 0, 0, 0.7)',
      })
    } else {
      loading.value.close()
    }

  })

</script>
<style scoped lang="scss"></style>