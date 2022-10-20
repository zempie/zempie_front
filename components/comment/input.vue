<template>
  <dl @click="isLogin || useModal().openLoginModal()">
    <UserAvatar :user="user" :tag="'p'" class="user" />
    <dt>
      <input
        type="text"
        v-model="content"
        :placeholder="$t('comment.input.placeholder')"
        :readonly="!isLogin"
        @keyup.enter="!content || sendComment()"
      />
    </dt>
    <dd>
      <a @click="!content || isEdit ? editComment() : sendComment()">
        <i class="uil uil-message"></i
      ></a>
    </dd>
  </dl>
</template>

<script setup lang="ts">
import _ from 'lodash'

const props = defineProps({
  postId: String,
  comment: Object,
  isEdit: {
    type: Boolean,
    default: false,
  },
})

const content = ref(props.comment?.content || null)

const user = computed(() => useUser().user.value.info)

const isLogin = computed(() => useUser().user.value.isLogin)

const emit = defineEmits(['refresh'])

async function editComment() {
  const payload = {
    comment_id: props.comment.id,
    post_id: props.postId,
    content: content.value,
  }
  const { data, error, pending } = await useCustomFetch(
    `/post/${props.postId}/comment/${props.comment.id}`,
    getComFetchOptions('post', true, payload)
  )
  if (!error.value) {
    emit('refresh', content.value)
  }
}

const isPrivate = ref(false)

const sendComment = _.debounce(async () => {
  const payload = {
    type: 'COMMENT',
    post_id: props.postId,
    content: content.value,
    is_private: isPrivate.value,
  }

  const { data, error } = await useCustomFetch(
    `/post/${props.postId}/comment`,
    getComFetchOptions('post', true, payload)
  )

  if (!error.value) {
    content.value = null
    emit('refresh')
  }
}, 300)
</script>

<style lang="scss" scoped>
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
    width: 20%;
    padding-right: 15px;
    text-align: right;
    font-size: 20px;
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

.checkbox-wrap input[type='checkbox']:checked + .checkbox-box,
.checkbox-wrap input[type='radio']:checked + .checkbox-box {
  background-color: rgb(0 0 0 / 10%);
  border-color: #3f485f;
}

.checkbox-wrap input[type='checkbox']:checked + .checkbox-box .icon-check,
.checkbox-wrap input[type='radio']:checked + .checkbox-box .icon-check {
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
