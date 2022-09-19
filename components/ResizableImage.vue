<template>
  <node-view-wrapper as="div" class="image-container">
    <img
      v-bind="node.attrs"
      ref="resizableImg"
      :draggable="isDraggable"
      :data-drag-handle="isDraggable"
    />
    <i
      class="uil uil-arrow-resize-diagonal"
      ref="icon"
      @mousedown="onMouseDown"
    ></i>
  </node-view-wrapper>
</template>

<script setup>
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
const isResizing = ref(false)
const lastMovement = ref({})
const resizableImg = ref()
const icon = ref()

const props = defineProps(nodeViewProps)

const isDraggable = computed(() => {
  return props.node?.attrs?.isDraggable
})

function onMouseDown(e) {
  e.preventDefault()

  isResizing.value = true

  window.addEventListener('mousemove', throttle(onMouseMove))

  window.addEventListener('mouseup', onMouseUp)
}

function onMouseUp(e) {
  isResizing.value = false

  lastMovement.value = {}

  window.removeEventListener('mousemove', throttle(onMouseMove))

  window.removeEventListener('mouseup', onMouseUp)
}

function throttle(fn, wait = 60, leading = true) {
  let prev, timeout, lastargs

  return (...args) => {
    lastargs = args

    if (timeout) return

    timeout = setTimeout(
      () => {
        timeout = null

        prev = Date.now()

        // let's do this ... we'll release the stored args as we pass them through

        fn.apply(this, lastargs.splice(0, lastargs.length))

        // some fancy timing logic to allow leading / sub-offset waiting periods
      },

      leading ? (prev && Math.max(0, wait - Date.now() + prev)) || 0 : wait
    )
  }
}

function onMouseMove(e) {
  e.preventDefault()

  if (!isResizing.value) {
    return
  }

  if (!Object.keys(lastMovement.value).length) {
    lastMovement.value = { x: e.x, y: e.y }

    return
  }

  if (e.x === lastMovement.value.x && e.y === lastMovement.value.y) {
    return
  }

  let nextX = e.x - lastMovement.value.x

  let nextY = e.y - lastMovement.value.y

  const width = resizableImg.value.width + nextX

  const height = resizableImg.value.height + nextY

  lastMovement.value = { x: e.x, y: e.y }

  props.updateAttributes({ width, height })
}
</script>

<style lang="scss" scoped>
.image-container:hover {
  .hidden {
    visibility: visible !important;
  }
}

.image-container {
  overflow: hidden;

  position: relative;
}

.resize-icon {
  position: absolute;

  bottom: 0;
}
</style>
