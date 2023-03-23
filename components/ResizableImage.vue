<template>
  <node-view-wrapper class="image-container">
    <div ref="imgContainer" v-on-click-outside="clickOutside">
      <div v-if="showIcon" class="bubble-menu">
        <button :class="isLeftAlign && 'active'" @click="leftAlign">
          <i class="uil uil-align-left"></i>
        </button>
        <button :class="isCenterAlign && 'active'" @click="centerAlign">
          <i class="uil uil-align-center"></i>
        </button>
        <button :class="isRigthAlign && 'active'" @click="rightAlign">
          <i class="uil uil-align-right"></i>
        </button>
      </div>
      <div :class="['resize-container', { 'icon-active': showIcon }, align]" ref="resiezeContainer">
        <img v-bind="node.attrs" ref="resizableImg" :alt="node.alt" :draggable="isDraggable"
          :data-drag-handle="isDraggable" @click="onImageMouseClick" @keyup.enter="onUpEnter" />
        <template v-if="showIcon">
          <div class="resize-icon top-left" @mousedown="onMouseNW"></div>
          <div class="resize-icon top-right" @mousedown="onMouseNE"></div>
          <div class="resize-icon bottom-left" @mousedown="onMouseSW"></div>
          <div class="resize-icon bottom-right" @mousedown="onMouseSE"></div>
        </template>
      </div>
    </div>
  </node-view-wrapper>
</template>

<script setup>
import { NodeViewWrapper, NodeViewContent, nodeViewProps } from '@tiptap/vue-3'

import { vOnClickOutside } from '@vueuse/components'

const MIN_WIDTH = 30
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
const resiezeContainer = ref()

const props = defineProps(nodeViewProps)

const isDraggable = computed(() => {
  if (resiezeContainer.value) {
    resiezeContainer.value.style.width = props.node?.attrs.width + 'px'
  }
  return props.node?.attrs?.isDraggable
})

function onUpEnter() {
  console.log('enter')
}
function clickOutside() {
  showIcon.value = false
  // if (resizableImg.value) resizableImg.value.style.outline = 'none'
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

  // imgContainer.value.style.textAlign = 'center'
  align.value = 'center'

  props.updateAttributes({ class: align.value })
}

function rightAlign() {
  isLeftAlign.value = false
  isCenterAlign.value = false
  isRigthAlign.value = true
  // imgContainer.value.style.textAlign = 'right'
  align.value = 'right'
  props.updateAttributes({ class: align.value })
}

function onImageMouseClick() {
  // if (resizableImg.value.getAttribute('class').includes('right')) {
  //   align.value = 'right'
  // } else if (resizableImg.value.getAttribute('class').includes('left')) {
  //   align.value = 'left'
  // } else if (resizableImg.value.getAttribute('class').includes('center')) {
  //   align.value = 'center'
  // }
  showIcon.value = true
}

let throttledFn = null;


function onMouseDown(e, onMouseMoveFn) {


  e.preventDefault();
  isResizing.value = true;
  throttledFn = throttle(onMouseMoveFn)
  window.addEventListener('mousemove', throttledFn);
  window.addEventListener('mouseup', onMouseUp);
}



function onMouseSE(e) {
  onMouseDown(e, onMouseMoveRight)
}
function onMouseSW(e) {
  onMouseDown(e, onMouseMoveLeft)
}

function onMouseNW(e) {
  onMouseDown(e, onMouseMoveLeft)

}
function onMouseNE(e) {
  onMouseDown(e, onMouseMoveRight)


}
function onMouseUp(e) {
  e.preventDefault()

  isResizing.value = false
  lastMovement.value = {}

  window.removeEventListener('mousemove', throttledFn)
  window.removeEventListener('mousemove', onMouseMoveLeft)

  window.removeEventListener('mouseup', onMouseUp)

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

function onMouseMoveLeft(e) {

  e.preventDefault();
  console.log('left')
  if (!isResizing.value) {
    return;
  }

  if (!Object.keys(lastMovement.value).length) {
    lastMovement.value = { x: e.x, y: e.y };
    return;
  }

  if (e.x === lastMovement.value.x && e.y === lastMovement.value.y) {
    return;
  }

  nextX.value = lastMovement.value.x - e.x; // invert the nextX value calculation

  nextY.value = e.y - lastMovement.value.y;

  let width = resizableImg.value.width + nextX.value;

  if (width < MIN_WIDTH) {
    width = MIN_WIDTH
  }

  if (window.innerWidth > 730) {
    if (width > 650) width = 650;
  } else if (window.innerWidth > 479) {
    if (width > 450) width = 450;
  } else {
    if (width > window.innerWidth) width = window.innerWidth - 20;
  }

  const height = props.node?.attrs.height;

  lastMovement.value = { x: e.x, y: e.y };

  props.updateAttributes({ width, height });
}

function onMouseMoveRight(e) {
  console.log('right')
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

  if (width < MIN_WIDTH) {
    width = MIN_WIDTH
  }
  if (window.innerWidth > 730) {
    if (width > 650) width = 650
  } else if (window.innerWidth > 479) {
    if (width > 450) width = 450
  } else {
    if (width > window.innerWidth) width = window.innerWidth - 20
  }

  const height = props.node?.attrs.height


  lastMovement.value = { x: e.x, y: e.y }
  resizableImg.value.style.outline = '2px dashed #f97316'

  props.updateAttributes({ width, height })
}

</script>

<style lang="scss" scoped>
.image-container {
  display: flow-root;
  width: 100%;
  position: relative;
  padding: 10px 3px 10px 3px;

  .resize-container {
    position: relative;

    &.icon-active {
      border: 2px dashed #f97316;
    }

    img {
      width: 100%;
    }

    .resize-icon {
      width: 10px;
      height: 10px;
      position: absolute;
      border: 2px solid #f97316;
      background-color: #fff;
      z-index: 999;

      &.top-left {
        top: -4px;
        left: -4px;
        cursor: nwse-resize !important;
      }

      &.top-right {
        top: -4px;
        right: -4px;
        cursor: nesw-resize !important;
      }

      &.bottom-left {
        bottom: -6px;
        left: -4px;
        cursor: nesw-resize !important;
      }

      &.bottom-right {
        right: -4px;
        bottom: -6px;
        cursor: nwse-resize !important;
      }

    }



    &.center {
      margin: 0px auto;
    }

    &.left {
      text-align: left;
    }

    &.right {
      margin-right: 10px;
      float: right;
    }
  }

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
    opacity: 1;
    position: absolute;
    left: 50%;
    top: -25px;
    height: 31px;
    transform: translateX(-50%);


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
    cursor: pointer;


    &:hover {
      outline: 2px dashed #f97316;
    }

  }

  .resize-icon {
    font-size: 16px;
    color: #f97316;
  }
}
</style>
