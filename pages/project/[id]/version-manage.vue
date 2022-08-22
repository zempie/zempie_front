<template>
  <!-- <div class="studio-version">
        <dl>
            <dt>
            </dt>
            <dd>
                <router-link :to="`/${$i18n.locale}/addVersion/${this.$route.params.id}`" class="btn-default"><i
                    class="uil uil-plus"></i> {{ $t('versionManage.addVersion') }}
                </router-link>
            </dd>
        </dl>
        <ul class="gv-title">
            <li></li>
            <li>{{ $t('versionManage.index') }}</li>
            <li>{{ $t('versionManage.detailedVersion') }}</li>
            <li>{{ $t('versionManage.state') }}</li>
            <li>{{ $t('versionManage.creationDate') }}</li>
            <li></li>
        </ul>

        <VersionRow
            v-for="(version, idx) in versions"
            :version="version"
            :idx="idx"
            :key="version.id"
            @deleteVersion="openDeleteModal"/>

      
        <modal :clickToClose="false"
               class="modal-area-type" name="deleteOneVersion" width="90%" height="auto" :maxWidth="380"
               :adaptive="true"
               :scrollable="true">
            <div class="modal-alert">
                <dl class="ma-header">
                    <dt>{{ $t('information') }}</dt>
                    <dd>
                        <button @click="$modal.hide('deleteOneVersion')"><i class="uil uil-times"></i></button>
                    </dd>
                </dl>
                <div class="ma-content">
                    <h2>{{ $t('versionManage.delete.modal') }}<br/>{{ $t('versionManage.delete.modal.confirm') }}</h2>
                    <div>
                        <button class="btn-default w48p" @click="deleteOneVersion()">{{ $t('yes') }}</button>
                        <button class="btn-gray w48p" @click="$modal.hide('deleteOneVersion')">{{ $t('no') }}</button>
                    </div>
                </div>
            </div>
        </modal>

        <modal :clickToClose="false"
               class="modal-area-type" name="deleteLastVersion" width="90%" height="auto" :maxWidth="380"
               :adaptive="true"
               :scrollable="true">
            <div class="modal-alert">
                <dl class="ma-header">
                    <dt>{{ $t('information') }}</dt>
                    <dd>
                        <button @click="$modal.hide('deleteLastVersion')"><i class="uil uil-times"></i></button>
                    </dd>
                </dl>
                <div class="ma-content">
                    <h2>{{ $t('versionManage.delete.all.modal') }} <br/>{{ $t('versionManage.delete.all.modal.confirm') }}</h2>
                    <div>
                        <button class="btn-default w48p" @click="deleteLastVersion()">{{ $t('yes') }}</button>
                        <button class="btn-gray w48p" @click="$modal.hide('deleteLastVersion')">{{ $t('no') }}</button>
                    </div>
                </div>
            </div>
        </modal>


        <modal :clickToClose="false"
               class="modal-area-type" name="deleteAlert" width="90%" height="auto" :maxWidth="380"
               :adaptive="true"
               :scrollable="true">
            <div class="modal-alert">
                <dl class="ma-header">
                    <dt>{{ $t('information') }}</dt>
                    <dd>
                        <button @click="$modal.hide('deleteAlert')"><i class="uil uil-times"></i></button>
                    </dd>
                </dl>
                <div class="ma-content">
                    <h2>{{ $t('versionManage.delete.deployVersion.') }} </h2>
                    <div>
                        <button class="btn-default w100p" @click="$modal.hide('deleteAlert')">{{ $t('confirm') }}</button>
                    </div>
                </div>
            </div>
        </modal>
    </div> -->
</template>
<script setup lang="ts">
// import {Component, Prop, Vue, Watch} from "vue-property-decorator";
// import {dateFormat} from "@/script/moment";
// import store from "@/store";
// import {eGameStage} from "@/common/enumData";
// import AlertModal from "@/components/common/_alertModal.vue";
// import moment from "moment";
// import VersionRow from "@/components/studio/_verionRow.vue";
// import Toast from "@/script/message";

// @Component({
//     components: {AlertModal, VersionRow},
// })
// export default class VersionManage extends Vue {
//     toast = new Toast();
//     moment = moment;

//     versions: any[] = [];
//     verObj: any = {};

//     isOpenDelete: boolean = false;

//     version:any = '';


//     // beforeRouteEnter(to, from, next){
//     //
//     //     if(eGameStage.Dev === (from.params.id && store.getters.projects[from.params.id].stage)){
//     //         alert('관리할 게임 버전이 없습니다. 개발 단계를 얼리억세스 이상으로 설정하여, 게임 파일을 업로드해주세요.')
//     //     }else if(!from.params.id){
//     //         next('/projectList')
//     //     }
//     //     else{
//     //         next();
//     //     }
//     // }

//     async mounted() {
//         this.fecth();
//     }

//     fecth() {
//         this.$api.getProject(this.$route.params.id)
//             .then((res) => {
//                 this.versions = res.projectVersions;
//                 this.$store.commit('project', res)

//             })
//     }

//     // clickedDeleteBtn(){
//     //     this.openDeleteModal(this.verObj)
//     // }

//     openDeleteModal(version:any){
//         this.version = version;

//         if(
//             // this.version.state === 'deploy' &&
//             this.versions.length === 1){
//             this.$modal.show('deleteLastVersion')
//         }else{
//             this.$modal.show('deleteOneVersion')
//         }
//     }

//     deleteVersion(){
//         this.$api.deleteVersion(this.version.id)
//             .then((res:any)=>{
//                 this.toast.successToast(`${this.$t('versionManage.deleted.version')}` );//"해당 게임이 삭제되었습니다."
//                 this.fecth();
//             })
//             .catch((err:any)=>{
//             })
//             .finally(()=>{
//                 this.$modal.hide('deleteVer')
//                 this.version = '';
//             })
//     }

//     deleteLastVersion(){

//         if(
//             this.version.state === 'deploy'){
//             this.$modal.hide('deleteLastVersion');
//             this.$modal.show('deleteAlert');
//         }
//         else{
//             this.$modal.hide('deleteLastVersion');
//             this.deleteVersion();
//         }
//     }

//     deleteOneVersion() {

//         if(
//             this.version.state === 'deploy'){
//             this.$modal.hide('deleteOneVersion');
//             this.$modal.show('deleteAlert');
//         }
//         else{
//             this.deleteVersion();
//             this.$modal.hide('deleteOneVersion');
//         }

//     }





</script>

<style scoped>
</style>