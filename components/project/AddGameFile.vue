<template>
  <!-- <div class="studio-upload-input">
        <div class="sui-input">
            <div class="suii-title">{{ $t('addGameFile.title') }}</div>
            <dl class="suii-content">
                <dt>{{ $t('gameUpload') }}</dt>
                <dd>

                    <p class="upload-file-container">
                        <label for="game-file"><i class="uil uil-file-plus" style="font-size:18px;"></i> &nbsp;
                            {{ $t('fileUpload') }}</label>
                        <input
                            @input="onFileChange"
                            type="file"
                            ref="gameFile"
                            id="game-file"
                            accept=".zip">
                        <ClipLoader v-if="isLoadingFile" :color="'#ff6e17'" :size="'20px'"></ClipLoader>
                        <button class="btn-circle-icon" @click="deleteFile" v-if="fileName"><i
                            class="uil uil-trash-alt"></i>
                        </button>
                    </p>
                    <transition name="component-fade" mode="out-in">
                        <div v-if="fileName">
                            <p class="file-size">{{ $t('file.size') }} : {{
                                    totalSize < 1
                                        ? `${totalSize * 1000} KB`
                                        : `${totalSize} MB`
                                }}</p>
                            <p class="file-name">{{ $t('file.name') }} : {{ fileName }}</p>
                        </div>
                    </transition>
                    <transition name="component-fade" mode="out-in">
                        <h2 :class="isFileEmpty ?'file-err on' : 'file-err off' ">
                            {{ $t('addGameFile.selectFile.text1') }}
                        </h2>
                    </transition>
                    <h2>
                        {{ $t('addGameFile.selectFile.text2') }} <br/> {{ $t('addGameFile.selectFile.text3') }}

                    </h2>
                </dd>
            </dl>
            <div class="suii-open" @click="isAdvancedOpen = !isAdvancedOpen">
                <span>{{ $t('advanced.setting') }}</span> &nbsp;<i class="uil uil-sliders-v-alt"></i>
            </div>
            <transition name="component-fade" mode="out-in">
                <div v-if="isAdvancedOpen">
                    <dl class="suii-content">
                        <dt>{{ $t('addGameFile.select.startFile.text1') }}</dt>
                        <dd>
                            <select name="" title="" class="w100p">
                                <option value='' selected disabled v-if="startFileOptions.length === 0">
                                    {{ $t('addGameFile.select.startFile.text2') }}
                                </option>
                                <option v-for="file in startFileOptions" :value="file">{{ file }}</option>
                            </select>
                        </dd>
                    </dl>

                    <dl class="suii-content" v-if="($store.getters.gameStage !== eGameStage.Dev ) && isEditProject">
                        <dt>{{ $t('addGameFile.selectMode') }}</dt>
                        <dd>
                            <ul>
                                <li>
                                    <label class="switch-button">
                                        <input type="checkbox" name="" v-model="autoDeploy"/>
                                        <span class="onoff-switch"></span>
                                    </label>
                                </li>
                                <li>Auto-deployment mode</li>
                            </ul>
                            <h2>
                                {{ $t('addGameFile.selectMode.text1') }}
                                <br/>
                                {{ $t('addGameFile.selectMode.text2') }}

                            </h2>
                        </dd>
                    </dl>

                    <div class="suii-close">
                        <button class="btn-line" @click="isAdvancedOpen = !isAdvancedOpen">{{ $t('close') }} &nbsp;&nbsp;<i
                            class="uil uil-angle-up"></i></button>
                    </div>
                </div>
            </transition>
        </div>
        <ul class="sui-btn">

            <li>
                <a @click="prevPage" class="btn-line w150"><i class="uil uil-angle-left-b"></i> {{ $t('previous') }}
                </a>
            </li>
            <li>

                <a v-if="isEditProject" @click="updateProject" class="btn-default w150">
                    <ClipLoader v-if="isLoadingUpload" :color="'#fff'" :size="'20px'" style="height: 20px"></ClipLoader>
                    <span v-else> {{ $t('update') }}</span>
                </a>
                <a v-else @click="upload" class="btn-default w150">
                    <ClipLoader v-if="isLoadingUpload" :color="'#fff'" :size="'20px'" style="height: 20px"></ClipLoader>
                    <span v-else>  {{ $t('upload') }}</span></a>
            </li>
        </ul>
    </div> -->
</template>

<script setup lang="ts">
    // @Prop() isEditProject !: any;
    // eGameStage = eGameStage;
    // projectId = this.$route.params.id;

    // toast = new Toast();
    // limitSize: number = 1024 * 1000 * 500;
    // totalSize: number = 0;
    // uploadGameFile: File | null = null;
    // uploadGameFiles: File[] = [];
    // isAdvancedOpen: boolean = false;
    // startFile: string = '';
    // startFileOptions: string[] = [];

    // fileName: string = '';
    // versionDescription: string = "";

    // isLoadingFile: boolean = false;
    // autoDeploy: boolean = true;

    // isFileEmpty: boolean = false;
    // isLoadingUpload: boolean = false;

    // mounted() {
    //     this.init();
    // }

    // init() {
    //     this.isLoadingUpload = false;
    //     this.uploadGameFiles = [];
    //     this.$store.commit('uploadGameFiles', [])
    // }

    // async onFileChange(e) {

    //     this.uploadGameFile = e.target.files[0];

    //     this.isLoadingFile = true;
    //     const zip = await ZipUtil.zipFileToZip(this.uploadGameFile);

    //     const files: any = await ZipUtil.zipToFiles(zip);
    //     let size: number = 0;

    //     for (let f in files) {
    //         size += files[f].size;
    //     }

    //     if (size > this.limitSize) {
    //         alert('500mb 초과')
    //         return;
    //     }

    //     this.totalSize = Number((size / (1024 * 1000)).toFixed(2));
    //     this.uploadGameFiles = files;

    //     const htmls = this.uploadGameFiles.filter((file) => {
    //         return file.name.indexOf('.html') > -1;
    //     });

    //     this.startFileOptions = htmls.map(file => file.name);
    //     this.startFileOptions.sort((a, b) => a.length - b.length);
    //     const indexFiles = this.startFileOptions.filter(name => name.includes('index'));

    //     if (indexFiles.length) {
    //         indexFiles.sort((a, b) => a.length - b.length);
    //         this.startFile = indexFiles[0];
    //     }
    //     else {
    //         this.startFile = this.startFileOptions[0];
    //     }

    //     this.startFileOptions.sort((a, b) => a.length - b.length);

    //     if (this.startFileOptions.length) {
    //         // this.uploadGameFileError = '';
    //         this.fileName = e.target.files[0].name
    //     }
    //     else {
    //         alert(`${this.$t('notFoundHtml')}`)
    //         this.fileName = ''
    //         // this.uploadGameFileError = this.$t('projectAddVersion.error.notFoundHtml').toString();

    //     }
    //     if (
    //         this.uploadGameFiles.length > 0 &&
    //         this.startFileOptions.length > 0
    //     ) {
    //         this.$store.commit("sendGameFileDone", true);

    //         this.$store.commit("uploadGameFiles", this.uploadGameFiles);
    //         this.isFileEmpty = false;
    //     }
    //     else {
    //         this.$store.commit("sendGameFileDone", false);
    //     }

    //     this.isLoadingFile = false;
    // }

    // deleteFile() {
    //     this.$store.commit("uploadGameFiles", []);
    //     this.uploadGameFile = null;
    //     this.uploadGameFiles = [];
    //     this.startFile = '';
    //     this.startFileOptions = [];
    //     this.totalSize = 0;
    //     this.fileName = '';
    //     (this.$refs.gameFile as any).value = '';
    // }

    // upload() {
    //     if (this.isLoadingUpload) {
    //         return;
    //     }


    //     const {uploadGameFiles, gameStage} = this.$store.getters;

    //     if (gameStage !== eGameStage.Dev) {
    //         if (!uploadGameFiles) {
    //             this.isFileEmpty = true;
    //         }
    //         else if (uploadGameFiles && uploadGameFiles.length === 0) {
    //             this.isFileEmpty = true;
    //         }
    //         else{
    //             this.isLoadingUpload = true;
    //             this.createProject();
    //         }

    //     }
    //     else {
    //         this.isLoadingUpload = true;
    //         this.createProject();
    //         this.isFileEmpty = false;
    //     }


    // }

    // createProject() {
    //     const {gameInfoObj, uploadGameFiles, gameStage} = this.$store.getters;


    //     const gameFileInfo = {
    //         autoDeploy: gameStage === eGameStage.Dev ? false : this.autoDeploy,
    //         startFile: this.startFile,
    //         size: this.totalSize,
    //         version_description: this.versionDescription,
    //     };
    //     this.$api.createProject(
    //         gameInfoObj,
    //         gameFileInfo,
    //         uploadGameFiles
    //     )
    //         .then((res) => {
    //             this.toast.successToast(`${this.$t('gameUpload.done')}`);
    //             this.$router.push(`/${this.$i18n.locale}/projectList`)

    //         })
    //         .catch((err) => {
    //         })
    //         .finally(() => {
    //             this.isLoadingUpload = false;
    //         })
    // }

    // async updateProject() {
    //     const {gameStage} = this.$store.getters;
    //     if (this.isLoadingUpload) {
    //         return;
    //     }


    //     let isError = false;

    //     if (gameStage !== eGameStage.Dev) {
    //         if (!this.uploadGameFiles.length) {
    //             isError = true;
    //             this.isFileEmpty = true;
    //         }


    //         if (!this.startFileOptions.length) {
    //             isError = true;
    //         }

    //         if (isError) {
    //             // this.wait = false;
    //             return;
    //         }
    //     }
    //     else {
    //         this.isFileEmpty = false;
    //     }
    //     this.isLoadingUpload = true;

    //     const option: any = {
    //         id: this.projectId,
    //         name: localStorage.getItem('title'),
    //         description: localStorage.getItem('description'),
    //         hashtags: localStorage.getItem('hashtagsArr'),
    //         stage: this.$store.getters.gameStage
    //     };

    //     if (this.$store.getters.gameStage === eGameStage.Dev) {
    //         this.autoDeploy = false;
    //     }

    //     this.$api.updateProject(option, this.$store.getters.thumbFile)
    //         .then((res) => {
    //             // this.toast.successToast("게임이 업로드되었습니다.");
    //             // this.$router.push('/projectList')
    //         })
    //         .catch((err) => {
    //             console.log('err', err)
    //             return;
    //         })
    //         .finally(() => {
    //             this.isLoadingUpload = false;
    //         })
    //     if(this.uploadGameFiles && this.uploadGameFiles.length > 0) {
    //         const version = await this.$api.createVersion(this.projectId, '1.0.0', this.uploadGameFiles, this.startFile,
    //         this.autoDeploy, this.totalSize, '', this.$store.getters.gameStage);
    //     }
    //     await this.$router.replace(`/${this.$i18n.locale}/projectList`);
    // }

    // prevPage() {
    //     this.$emit('gameInfoDone', false)
    // }

</script>

<style scoped lang="scss">
.file-err {
  color: #c5292a;

  &.on {
    display: inline-block;
  }

  &.off {
    display: none;
  }
}

//upload button
.upload-file-container {
  display: flex;
  align-items: center;

  .btn-circle-icon {
    margin-left: 10px
  }
}

.file-size,
.file-name {
  margin: 10px 0px 10px;
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

//spinner
.v-spinner {
  margin-left: 10px;
  display: flex;
  align-items: center;
}
</style>