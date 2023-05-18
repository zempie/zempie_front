<template>
  <dl @click="isLogin || useModal().openLoginModal()">
    <UserAvatar :user="user" :tag="'p'" class="user" />
    <dt>
      <div class="chip-container ">
        <div class="chip" v-if="parentComment">
          {{ '@' + parentComment?.user?.nickname }}
        </div>
        <input type="text" v-model="content" :placeholder="parentComment ? '' : $t('comment.input.placeholder')"
          :readonly="!isLogin" @input="onInputComment" @keydown.delete="backspaceDelete"
          @keyup.enter="isEdit ? editComment() : sendComment()" ref="commentInput" />
      </div>
    </dt>
    <dd>
      <a @click="isEdit ? editComment() : sendComment()" :class="isActive ? 'active' : 'inactive'">
        <i class="uil uil-message"></i></a>
    </dd>
  </dl>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { PropType } from 'vue'
import { IComment } from '~~/types'

const props = defineProps({
  postId: String,
  comment: Object,
  isEdit: {
    type: Boolean,
    default: false,
  },
  recomment: Object as PropType<IComment>
})

const content = ref(props.comment?.content || null)
const commentInput = ref()
const isActive = ref(false)
const parentComment = ref(props.recomment)
const isPrivate = ref(false)


const user = computed(() => useUser().user.value.info)
const isLogin = computed(() => useUser().user.value.isLogin)

const emit = defineEmits(['addComment', 'editComment'])


watch(() =>
  (props.recomment), (recomment) => {
    if (recomment) {
      parentComment.value = recomment
    }
    commentInput.value.focus()
  })

async function editComment() {
  if (!isActive.value) return

  const payload = {
    comment_id: props.comment.id,
    post_id: props.postId,
    content: content.value,
  }
  const { data, error, pending } = await useCustomAsyncFetch(
    `/post/${props.postId}/comment/${props.comment.id}`,
    getComFetchOptions('post', true, payload)
  )
  if (!error.value) {
    emit('editComment', data.value)
  }
}


const sendComment = _.debounce(async () => {
  if (!content.value) return

  const payload = {
    type: 'COMMENT',
    post_id: props.postId,
    content: content.value,
    is_private: isPrivate.value,
  }

  if (parentComment.value) {
    payload['parent_id'] = parentComment.value.id
    payload.content = `@${parentComment.value.user.nickname} ` + payload.content
  }

  const { data, error } = await useCustomAsyncFetch(
    `/post/${props.postId}/comment`,
    getComFetchOptions('post', true, payload)
  )

  if (!error.value) {
    content.value = null
    parentComment.value = null
    emit('addComment', data.value)

  }
}, 300)

function onInputComment() {
  isActive.value = content.value?.length > 0
}


function backspaceDelete({ which }) {
  if (which == 8 && parentComment.value) {
    parentComment.value = null
  }
}
</script>

<style lang="scss" scoped>
.chip-container {
  min-height: 48px;
  padding: 0 15px;
  border-radius: 5px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  .chip {
    color: #ff6e17;
    margin: 4px;
    background: #FFEDDF;
    border-radius: 5px;
    display: flex;
    align-items: center;

    i {
      cursor: pointer;
      opacity: 0.56;
      margin-left: 8px;
    }
  }

  input {
    flex: 1 1 auto;
    width: 30px;
    border: none;
    outline: none;
    padding: 4px;
  }
}

.user {
  display: inline-block;
  width: 40px;
  height: 37px;
  border-radius: 50%;
  border: 1px solid #e9e9e9;
  margin-left: 6px;
}

dl {
  display: flex;
  align-items: center;
  margin-top: 25px;
  border: #e5e5e5 1px solid;
  border-radius: 10px;

  dt {
    width: 85%;

    input {
      border: none;
      width: 100%;

      &:focus {
        border: none;
        box-shadow: none;
      }
    }
  }

  dd {
    // width: 20%;
    padding-right: 15px;
    text-align: right;
    font-size: 20px;

    a {
      &.inactive {
        opacity: 0.5;
        pointer-events: none;
        cursor: none;
      }

      &.active {
        opacity: 1;
        pointer-events: all;
        cursor: pointer;
      }
    }
  }
}

.reply-send-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
}

.icon-send-message:hover {
  fill: #fff;
}

.checkbox-wrap label {
  text-align: left;
}

.checkbox-wrap {
  margin-top: 8px;
}

.checkbox-wrap input[type='checkbox']:checked+.checkbox-box,
.checkbox-wrap input[type='radio']:checked+.checkbox-box {
  background-color: rgb(0 0 0 / 10%);
  border-color: #3f485f;
}

.checkbox-wrap input[type='checkbox']:checked+.checkbox-box .icon-check,
.checkbox-wrap input[type='radio']:checked+.checkbox-box .icon-check {
  fill: #ffffff;
}

.checkbox-wrap .checkbox-box .icon-check {
  fill: transparent;
  transition: fill 0.2s ease-in-out;
}

.edit-comment {
  display: flex;
  align-items: center;
  margin-top: 25px;
  border: #e5e5e5 1px solid;
  border-radius: 10px;
  width: 100%;

  dt {
    width: 80%;
    padding: 0 5px;
  }

  input {
    width: 100%;
    border: none;
  }

  input[type='text']:focus {
    box-shadow: none;
  }

  dd {
    width: 20%;
    padding-right: 15px;
    text-align: right;
    font-size: 20px;
  }
}
</style>
