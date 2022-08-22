<template>
  <!-- <div>
    <div class="info-input">
      <div class="ii-title-one">
        {{ $t('deployManage.deployingVersion') }}
      </div>
      {{ version }}
      <div v-if="version" class="ii-form">
        <ul>
          <li>{{ $t('deployManage.show.version') }}</li>
          <li><input readonly v-model="number" type="text" name="" title="" placeholder="" class="w100p" />
          </li>
        </ul>
        <ul>
          <li>{{ $t('deployManage.show.detailed.version') }}</li>
          <li><input readonly v-model="version" type="text" name="" title="" placeholder="" class="w100p" />
          </li>
        </ul>
        <ol>
          <li>{{ $t('deployManage.undeploy.title') }}</li>
          <li>{{ $t('deployManage.undeploy.info') }}</li>
          <li>
            <a @click="$modal.show('undeployConfirm')" class="btn-gray w100p">{{ $t('deployManage.undeploy.title')
            }}</a>
          </li>
        </ol>
      </div>
      <div v-else class="ii-form">
        <ul>
          <li style="width: 100%;"> {{ $t('deployManage.noDeployVersion') }}</li>
        </ul>
      </div>

      <div class="ii-title-one-line">
        {{ $t('deployManage.changeDeploy.version.title') }}
      </div>
      <div class="ii-form">
        <ul>
          <li> {{ $t('deployManage.changeDeploy.version.select') }}</li>
          <li v-if="options[0]">
            <select name="" title="" class="w100p" v-model="selectVersion">
              <option v-for="option in options" :value="option">{{ option }}</option>
            </select>
          </li>
          <li v-else>
            <select name="" title="" class="w100p">
              <option value="배포할 버전이 없습니다.">
                {{ $t('deployManage.changeDeploy.noVersion') }}
              </option>
            </select>
          </li>

        </ul>

        <ol style="border-top: 0px;">
          <li> {{ $t('deployManage.changeDeploy.state') }}</li>
          <li>{{ $t('deployManage.changeDeploy.state.info') }}</li>
          <li>
            <a @click="deploy" class="btn-default w100p">{{ $t('deploy') }}</a>
          </li>
        </ol>

      </div>
    </div>

    <modal :clickToClose="false" class="modal-area-type" name="selectStageModal" width="90%" height="auto"
      :maxWidth="380" :adaptive="true" :scrollable="true">
      <div class="modal-alert">
        <dl class="ma-header">
          <dt>{{ $t('information') }}</dt>
          <dd>
            <button @click="$modal.hide('selectStageModal')"><i class="uil uil-times"></i></button>
          </dd>
        </dl>
        <div class="ma-content">
          <h2>{{ $t('deployManage.changeStage.modal.info1') }}<br />
            {{ $t('deployManage.changeStage.modal.info2') }}
          </h2>
          <div class="stage-select-container">
            <h2 style="margin-right: 10px">{{ $t('deployManage.changeStage.modal.title') }}</h2>
            <v-select class="stage-select-box" :reduce="name => name.stage" label="name" v-model="selectedStage"
              style="z-index: 999; margin-top:0px;" :options="stageOptions" placeholder="단계 선택">
              <template #open-indicator="{ attributes }">
                <span v-bind="attributes"><i class="uil uil-angle-down" style="font-size:20px;"></i></span>
              </template>
            </v-select>
          </div>
          <div style="margin-bottom: 10px">
            <button class="btn-default w48p" @click="changeStage()">{{ $t('change') }}</button>
            <button class="btn-gray w48p" @click="$modal.hide('selectStageModal')">{{
                $t('cancel')
            }}
            </button>
          </div>
        </div>
      </div>
    </modal>


    <modal :clickToClose="false" class="modal-area-type" name="undeployConfirm" width="90%" height="auto"
      :maxWidth="380" :adaptive="true" :scrollable="true">
      <div class="modal-alert">
        <dl class="ma-header">
          <dt>{{ $t('information') }}</dt>
          <dd>
            <button @click="$modal.hide('undeployConfirm')"><i class="uil uil-times"></i></button>
          </dd>
        </dl>
        <div class="ma-content">
          <h2>{{ $t('deployManage.undeploy.modal') }}</h2>
          <div>
            <button class="btn-default w48p" @click="undeploy()">{{ $t('yes') }}</button>
            <button class="btn-gray w48p" @click="$modal.hide('undeployConfirm')">{{ $t('no') }}</button>
          </div>
        </div>
      </div>
    </modal>
  </div> -->
</template>

<script setup lang="ts">
// import { Component, Prop, Vue } from "vue-property-decorator";
// import * as _ from "lodash";
// import Toast from "@/script/message";
// import { eGameStage } from "@/common/enumData";
// import store from "@/store";


// @Component({
//   components: {},
// })
// export default class DeployManage extends Vue {
//   toast = new Toast();

//   projectId: any = this.$route.params.id;
//   version: string = "";
//   number: number = 0;
//   selectVersion: string = '';
//   options: string[] = [];
//   deployVersion: any = null;
//   wait: boolean = false;

//   stage: number = 0;

//   stageOptions = [{ name: 'Early Access', stage: eGameStage.Early }, { name: 'Complete', stage: eGameStage.Complete }];
//   selectedStage = eGameStage.Early;

//   // beforeRouteEnter(to, from, next){
//   //     if(eGameStage.Dev === (from.params.id && store.getters.projects[from.params.id].stage)){
//   //
//   //         alert('배포 관리 할 게임이 없습니다. 개발 단계를 얼리억세스 이상으로 설정하여, 게임 파일을 업로드해주세요.')
//   //     }else if(!from.params.id){
//   //         next('/projectList')
//   //     }
//   //     else{
//   //         next();
//   //     }
//   // }

//   async mounted() {
//     this.projectId = this.$route.params.id;
//     await this.$store.dispatch("loginState");
//     await this.loadVersions();


//   }

//   loadVersions() {
//     this.$api.getProject(this.$route.params.id)
//       .then((res) => {
//         // this.version = res.projectVersions;
//         this.$store.commit('project', res)

//       })
//       .finally(() => {
//         const project = this.$store.getters.project(this.projectId);
//         const versions = this.$store.getters.versionList(this.projectId);


//         if (project.deploy_version_id) {
//           const deployVersion = _.find(
//             versions,
//             (v) => v.id === project.deploy_version_id
//           );

//           this.version = deployVersion.version;
//           this.number = deployVersion.number;
//           this.deployVersion = deployVersion;

//         }

//         const passedList = versions.filter((version) => {
//           return version.state === "passed";
//         });

//         this.options = passedList.map((version) => version.version);

//         this.selectVersion = this.options[0]
//       })
//   }

//   deploy() {
//     if (!this.selectVersion) {
//       return;
//     }

//     const versions = this.$store.getters.versions(this.projectId);
//     const project = this.$store.getters.project(this.projectId);

//     if (this.hasDeployFile(versions)) {
//       const version = _.find(
//         versions,
//         (v) => v.version === this.selectVersion
//       );
//       const deploy_version_id = version.id;


//       this.$api.updateProject({
//         id: this.projectId as number,
//         deploy_version_id,
//       })
//         .then((res) => {
//           version.state = "deploy";
//           if (this.deployVersion) {
//             const preVersion = _.find(
//               versions,
//               (v) => v.number === this.deployVersion.number
//             );
//             preVersion.state = "passed";
//             const project = this.$store.getters.project(this.projectId);
//             project.deploy_version_id = version.id;
//             console.log('project', project)
//             console.log('version', version)
//             if (project.update_version_id === version.id) {
//               project.update_version_id = null;
//             }
//           }

//           this.toast.clear();
//           this.toast.successToast(`${this.selectVersion} ${this.$t('deployed.version')}`)
//           this.$router.replace(`/${this.$i18n.locale}/versionManage/${this.projectId}`);
//         })
//         .catch(() => {

//         })
//     }
//     else {
//       if (project.stage === eGameStage.Dev) {
//         this.$modal.show('selectStageModal')
//       }
//     }

//   }


//   undeploy() {

//     this.$api.updateProject({
//       id: this.projectId,
//       deploy_version_id: "0",
//       stage: (eGameStage.Dev as any)
//     })
//       .then((res) => {
//         if (this.deployVersion) {
//           const versions = this.$store.getters.versions(this.projectId);
//           const preVersion = _.find(
//             versions,
//             (v) => v.number === this.deployVersion.number
//           );
//           preVersion.state = "passed";
//           const project = this.$store.getters.project(this.projectId);
//           project.deploy_version_id = null;
//         }

//         this.toast.clear();
//         this.toast.successToast(`${this.$t('deployVersion.version')}`)

//         this.$router.replace(`/${this.$i18n.locale}/versionManage/${this.projectId}`);
//       })
//       .catch((err) => {
//         console.error("error", err);
//       })


//   }

//   changeStage() {
//     const versions = this.$store.getters.versions(this.projectId);
//     const version = _.find(
//       versions,
//       (v) => v.version === this.selectVersion
//     );
//     const deploy_version_id = version.id;

//     const option: any = {
//       id: this.projectId,
//       stage: this.selectedStage,
//       deploy_version_id
//     };

//     this.$api.updateProject(option)
//       .then((res) => {
//         this.$store.dispatch('project', this.projectId)
//         this.toast.successToast(`${this.$t('deployManage.update.done')}`); // "업데이트 되었습니다."
//         this.$router.push(`/${this.$i18n.locale}/versionManage/${this.projectId}`)
//       })
//       .catch((err) => {

//       })
//       .finally(() => {
//         this.$modal.hide('selectStageModal')
//       })
//   }

//   hasDeployFile(versions: any) {
//     const hasDeployFile = _.filter(versions, (version) => {
//       return version.state === 'deploy';
//     })

//     return hasDeployFile.length === 0 ? false : true;

//   }

// }
</script>

<style lang="scss" scoped>
.stage-select-container {
  display: inline-flex;
  justify-content: center !important;
  margin-top: 0px !important;
  align-items: center !important;
}

.sdc-select-box .vs__dropdown-toggle {
  margin-top: 0px !important;
}
</style>