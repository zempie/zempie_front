<template>
  <div class="content" style="height: auto">
    <DmList />
  </div>
</template>
<script setup lang="ts">


definePageMeta({
  title: 'dm',
  name: 'dm',
  middleware: 'auth',
  layout: 'header-only',
})

</script>
<style scoped lang="scss">
.content {
  height: 100vh;

  .dm-list {

    .mobile-btn {
      display: none;
    }

    .dl-content {
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin-top: 30px;
      border: 1px solid #e5e5e5;
      border-radius: 10px;
      overflow: hidden;

      dd {

        ul {
          overflow-y: auto;

          li {
            padding: 13px;

            &:hover {
              background-color: #F9f9f9;
            }

            dl {
              dd {
                width: 15%;
              }

              dt {
                width: 70%;
              }
            }
          }
        }
      }


    }
  }

  .new-msg-btn-icon {
    &.inactive {
      opacity: 0.3;
      pointer-events: none;
      cursor: not-allowed
    }
  }

}

.new-msg-btn {
  &.inactive {
    background-color: #888;
    opacity: 0.3;
    pointer-events: none;
    cursor: not-allowed
  }

}

::v-deep(.new-msg-modal) {
  max-height: 90vh;
}

.new-msg-modal {

  .ma-content {
    .input-search-default {
      justify-content: left
    }

    .user-list {
      max-height: 500px;
      overflow-y: scroll;
      padding-top: 20px;

      li {
        padding: 13px;
        border: 1px solid #ededed;
        border-radius: 10px;
        text-align: left;

        dt {
          display: flex;
          flex-direction: column;
          justify-content: center;

          h3 {
            font-weight: 600;
          }

          .nickname {
            color: #888
          }
        }
      }
    }
  }

}
</style>
