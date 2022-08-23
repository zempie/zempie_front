<template>
  <NuxtLayout name="project-manage">
    <ProjectEdit />
  </NuxtLayout>

</template>

<script setup lang="ts">

useHead({
  title: 'Zempie | Project upload ',
  meta: [{
    name: 'description',
    content: 'project list'
  }]
})

definePageMeta({
  title: '게임 정보 수정',
  name: 'projectId'
})

const route = useRoute()
const router = useRouter();
const projectId = computed(() => parseInt(route.params.id as string))





onMounted(async () => {
  if (!useProject().editProject.value.info.id) await fetch()
})

async function fetch() {
  const { data } = await project.getInfoById(projectId.value)
  const { result } = data.value

  useProject().setProjectInfo(result)
  useProject().setStageOnEdit(result.stage)
}



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