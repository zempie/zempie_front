<template>
  <node-view-wrapper class="image-container">
    <div ref="imgContainer" v-on-click-outside="clickOutside">
      <div v-if="showIcon" class="bubble-menu">
        <button :class="isLeftAlign ? 'active' : ''" @click="leftAlign">
          <i class="uil uil-align-left"></i>
        </button>
        <button :class="isCenterAlign ? 'active' : ''" @click="centerAlign">
          <i class="uil uil-align-center"></i>
        </button>
        <button :class="isRigthAlign ? 'active' : ''" @click="rightAlign">
          <i class="uil uil-align-right"></i>
        </button>
      </div>
      <img
        class="drag-handle"
        v-bind="node.attrs"
        ref="resizableImg"
        :draggable="isDraggable"
        :data-drag-handle="isDraggable"
        @click="onImageMouseClick"
      />
    </div>
    <i
      v-if="showIcon"
      :class="['uil uil-expand-arrows resize-icon', align]"
      ref="icon"
      @mousedown="onMouseDown"
    ></i>
  </node-view-wrapper>
</template>

<script setup>
import { NodeViewWrapper, NodeViewContent, nodeViewProps } from '@tiptap/vue-3'

import { vOnClickOutside } from '@vueuse/components'
const isResizing = ref(false)
const lastMovement = ref({})
const resizableImg = ref()
const icon = ref()
const showIcon = ref(false)

const nextX = ref(0)
const nextY = ref(0)

const isLeftAlign = ref(false)
const isCenterAlign = ref(true)
const isRigthAlign = ref(false)
const imgContainer = ref()
const align = ref('center')

const props = defineProps(nodeViewProps)

const isDraggable = computed(() => {
  return props.node?.attrs?.isDraggable
})

function clickOutside() {
  showIcon.value = false
  if (resizableImg.value) resizableImg.value.style.outline = 'none'
}

function leftAlign() {
  isLeftAlign.value = true
  isCenterAlign.value = false
  isRigthAlign.value = false
  imgContainer.value.style.textAlign = 'left'
  align.value = 'left'
  props.updateAttributes({ class: align.value })
}

function centerAlign() {
  isLeftAlign.value = false
  isCenterAlign.value = true
  isRigthAlign.value = false
  imgContainer.value.style.textAlign = 'center'
  align.value = 'center'

  props.updateAttributes({ class: align.value })
}

function rightAlign() {
  isLeftAlign.value = false
  isCenterAlign.value = false
  isRigthAlign.value = true
  imgContainer.value.style.textAlign = 'right'
  align.value = 'right'
  props.updateAttributes({ class: align.value })
}

function onImageMouseClick() {
  showIcon.value = true
  resizableImg.value.style.outline = '2px dashed #f97316'
}

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
  window.removeEventListener('mouseover', onMouseOver)

  showIcon.value = false
  resizableImg.value.style.outline = 'none'
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

  nextX.value = e.x - lastMovement.value.x

  nextY.value = e.y - lastMovement.value.y

  let width = resizableImg.value.width + nextX.value

  if (window.innerWidth > 730) {
    if (width > 650) width = 650
  } else if (window.innerWidth > 479) {
    if (width > 450) width = 450
  } else {
    if (width > window.innerWidth) width = window.innerWidth - 20
  }

  const height = resizableImg.value.height + nextY.value

  lastMovement.value = { x: e.x, y: e.y }
  resizableImg.value.style.outline = '2px dashed #f97316'

  props.updateAttributes({ width, height })
}

function onMouseOver() {
  showIcon.value = true
  resizableImg.value.style.outline = '2px dashed #f97316'
}
</script>

<style lang="scss" scoped>
.image-container {
  overflow: hidden;
  position: relative;

  .drag-handle {
    &.center {
      display: block;
      margin: 10px auto;
    }
    &.left {
      display: block;
      text-align: left;
    }
    &.right {
      float: right;
    }
  }
  .bubble-menu {
    text-align: center;
    button {
      cursor: pointer;
      background-color: #fff;
      color: #f97316;
      border: 1px solid;
      margin: 3px;
      border-radius: 3px;
      &.active {
        background-color: #f97316;
        color: #fff;
      }
    }
  }
  .hidden {
    visibility: visible !important;
  }
  img {
    outline: 10px transparent;
    &:hover {
      // outline: 2px dashed #f97316;
    }
    margin: 10px;
  }
  .resize-icon {
    font-size: 16px;
    color: #f97316;
    bottom: 0px;
    position: absolute;
    right: 177px;
    // &.center {
    //   display: block;
    //   margin: 10px auto;
    // }
    // &.left {
    //   display: block;
    //   text-align: left;
    // }
    // &.right {
    //   float: right;
    // }
  }
}
</style>
