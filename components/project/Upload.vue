<template>
  <dl class="studio-upload-area">
    <!-- 목적 선택 안 한 경우-->
    <ProjectSelectPurpose v-if="uploadPurpose === eGameCategory.NONE" />    
    <!-- 스테이지 선택 안 한 경우-->
    <ProjectSelectStage v-else-if="uploadStage === eGameStage.NONE" />
    <!-- 둘 다 선택했으면 게임 업로드 창 -->
    <ProjectAddGameInfo v-else />

  </dl>
</template>

<script setup lang="ts">
import { eGameCategory, eGameStage } from "~~/types"

const { uploadProject } = useProject();
const readyToUpload = ref(false)

const uploadStage = computed(() => uploadProject.value.form.stage)
const uploadPurpose = computed(()=>uploadProject.value.purpose)

</script>

<style scoped lang="scss">
.studio-upload-area {
  min-height: 700px;
}


//transition
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity .3s ease;
}

.component-fade-enter,
.component-fade-leave-to

/* .component-fade-leave-active below version 2.1.8 */
  {
  opacity: 0;
}

// /transition


.step {
  opacity: 0.5;
  pointer-events: none;

  &.active {
    opacity: 1;
  }
}

.step:hover {
  background-color: #fff;
  color: #ff6e17;
}

.publish-btn {
  pointer-events: none;

  &.active {
    background-color: #fff;
    cursor: pointer;
    pointer-events: all;

    h4 {
      padding: 20px 15px;
      font-size: 16px;
      line-height: 16px;
      color: #fff;
      background: rgba(255, 110, 23);
      border-radius: 90px;
    }
  }

  &.active:hover {
    background-color: #fff;
    cursor: pointer;

    h4 {
      padding: 20px 15px;
      font-size: 16px;
      line-height: 16px;
      color: rgba(255, 110, 23, 0.5);
      background: rgba(255, 110, 23, 0.1);
      border-radius: 90px;
    }
  }

}


.publish-btn:hover {
  background-color: #fff;
  cursor: default;

  h4 {
    padding: 20px 15px;
    font-size: 16px;
    line-height: 16px;
    color: rgba(255, 110, 23, 0.5);
    background: rgba(255, 110, 23, 0.1);
    border-radius: 90px;
  }
}

input[type="radio"] {
  display: none;
}

input[type="radio"]:checked+label {
  color: #fff;
  background: #FF6E17;
  border-color: #FF6E17;
}

input[type="radio"]+label {
  display: inline-block;
  width: 22px;
  height: 22px;
  text-align: center;
  font-size: 15px;
  color: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  cursor: pointer;
}

.studio-upload-step li {
  cursor: pointer;
}
</style>