<template>
  <dl class="studio-upload-area">
    <!-- 게임단계 -->
    <ProjectEditSelectStage v-if="editProject.step === 1" />
    <ProjectEditGameInfo v-else-if="editProject.step === 2" />

    <!-- <transition name="component-fade" mode="out-in">
                <SelectStage v-show="stepOne()"
                             @stage="getStage"
                             :projectInfo="projectInfo"/>
            </transition>
            <transition name="component-fade" mode="out-in">
                <AddGameInfo v-show="stepTwo()"
                             @stage="getStage"
                             @gameInfoDone="getGameInfo"
                             @isActivePublish="getPublishState"
                             :isUpdateProject = 'isUpdateProject'
                             :isEditProject="projectInfo ? true: false"
                             :projectInfo="projectInfo"/>
            </transition>
            <transition name="component-fade" mode="out-in">
                <AddGameFile v-show="stepThree()"
                             @gameInfoDone="getGameInfo"
                             :isEditProject="projectInfo ? true: false"
                />
            </transition> -->
    <!--                <router-view></router-view>-->
    <!-- 게임단계 끝 -->
  </dl>
</template>

<script setup lang="ts">
const { editProject, resetProjectInfo } = useProject()

const stage = ref(computed(() => useProject().editProject.value.info?.stage))

onMounted(() => {})

//     toast = new Toast();

//     isClickActive: boolean = false;
//     stage: number | null = null;

//     isGameInfoFilled: boolean = false;

//     isActivePublishBtn: boolean = false;

//     //프로젝트 수정
//     isEditProject: boolean = false;
//     isUpdateProject: boolean = false;
//     projectInfo: any = null;

//     mounted() {
//         //프로젝트 업데이트 경우
//         if (this.$route.params.id) {
//             this.infoFetch()
//         }

//     }

//     updateProjectInfo() {

//     }

//     infoFetch() {
//         this.$api.getProject(this.$route.params.id)
//             .then((res: any) => {
//                 this.projectInfo = res;
//                 this.stage = res.stage;
//                 this.$store.commit("gameStage", this.stage);
//                 this.$store.commit('projectInfo', res);
//                 this.isEditProject = true;
//             })
//     }

//     uploadGame() {
//         const {gameInfoObj, gameFileInfoObj, uploadGameFiles} = this.$store.getters;

//         this.$api.createProject(
//             gameInfoObj,
//             gameFileInfoObj,
//             uploadGameFiles
//         )
//             .then((res) => {

//                 this.toast.successToast(`${this.$t('projectUpload.success.upload')}`);
//                 this.$router.push(`/${this.$i18n.locale}/projectList`)
//             })
//             .catch((err) => {

//             })
//     }

//     updateProject() {
//         this.isUpdateProject = true;
// console.log("here?")
//         // const option: any = {
//         //     id: this.projectInfo.id,
//         //     name: localStorage.getItem('title'),
//         //     description: localStorage.getItem('description'),
//         //     hashtags: localStorage.getItem('hashtagsArr'),
//         //     stage: this.$store.getters.gameStage
//         // };
//         //
//         //
//         // this.$api.updateProject(option, this.$store.getters.thumbFile)
//         //     .then((res) => {
//         //         this.toast.successToast("업데이트 되었습니다.");
//         //         this.$router.push('/projectList')
//         //     })
//         //     .catch((err) => {
//         //
//         //     })
//     }

//     stepOne() {
//         return !this.stage ? true : false;
//     }

//     stepTwo() {
//         return this.stage && !this.isGameInfoFilled ? true : false;
//     }

//     stepThree() {
//         return this.stage && this.isGameInfoFilled
//         // && (this.$store.getters.gameStage !== eGameStage.Dev)
//             ? true : false;

//     }

//     getStage(stage: number) {
//         this.stage = stage;
//     }

//     getGameInfo(state: boolean) {
//         this.isUpdateProject = false;
//         this.isGameInfoFilled = state;
//     }

//     getPublishState(state: boolean) {
//         console.log('isActivePublish', state)
//         this.isActivePublishBtn = state;
//     }
</script>

<style scoped lang="scss">
.studio-upload-area {
  min-height: 700px;
}

//transition
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease;
}

.component-fade-enter,
.component-fade-leave-to

/* .component-fade-leave-active below version 2.1.8 */ {
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

input[type='radio'] {
  display: none;
}

input[type='radio']:checked + label {
  color: #fff;
  background: #ff6e17;
  border-color: #ff6e17;
}

input[type='radio'] + label {
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
