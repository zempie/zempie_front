import { IProject, eGameStage, eGameCategory } from "~~/types"

export default function () {

  const editProject = useState('editProject', () => ({
    info: {} as IProject,
    step: 1,
    purpose: -1

  }))

  const getProjectInfo = async (id: string | number) => {
    const { data, error } = await useCustomAsyncFetch<{ result: IProject }>(`/community/project/${id}`, getZempieFetchOptions('get', true))

    if (data.value) {
      const { result } = data.value
      setProjectInfo(result)
      useProject().setStageOnEdit(result.stage)
    }

  }

  const setStageOnEdit = (stage: number) => {
    editProject.value.info.stage = stage;
  }

  const setStepOneOnEdit = () => {
    editProject.value.step = 1;
  }
  const setStepTwoOnEdit = () => {
    editProject.value.step = 2;
  }
  const setStepThreeOnEdit = () => {
    editProject.value.step = 3;
  }

  const setProjectInfo = (info: IProject) => {
    editProject.value.info = info;
  }

  const resetEditStep = () => {
    editProject.value.step = 1;

  }

  const resetProjectInfo = () => {
    editProject.value.info = {} as IProject
  }



  const uploadProject = useState('uploadProject', () => ({
    form: {
      stage: eGameStage.NONE,
      name: "",
      pathname: "",
      description: "",
      hashtags: '',
      project_picture: '',
      project_picture2: ''
    },
    step: 1,
    purpose: -1
  }))


  //purpose
  const setPurpose = (purpose: number) => {
    uploadProject.value.purpose = purpose;
  }
  const resetPurpose = () => {
    uploadProject.value.purpose = eGameCategory.NONE;
  }

  const setEditPurpose = (purpose: number) => {
    editProject.value.purpose = purpose;
  }
  const resetEditPurpose = () => {
    editProject.value.purpose = eGameCategory.NONE;
  }


  //stage
  const setStepOne = () => {
    uploadProject.value.step = 1;
  }
  const setStepTwo = () => {
    uploadProject.value.step = 2;
  }
  const setStepThree = () => {
    uploadProject.value.step = 3;
  }
  const setStepFour = () => {
    uploadProject.value.step = 4;
  }



  const setStage = (stage: number) => {
    uploadProject.value.form.stage = stage;
  }
  const resetStage = () => {
    uploadProject.value.form.stage = eGameStage.NONE;
  }

  const setForm = (form: any) => {
    uploadProject.value.form = form
  }

  const resetForm = () => {

    uploadProject.value.form = {
      stage: eGameStage.NONE,
      name: "",
      pathname: "",
      description: "",
      hashtags: '',
      project_picture: '',
      project_picture2: ''
    }
  }

  return {
    editProject,
    uploadProject,
    setProjectInfo,
    resetProjectInfo,
    setStage,
    resetStage,
    setForm,
    resetForm,
    setStepOne,
    setStepTwo,
    setStepThree,
    setStepFour,
    setStepOneOnEdit,
    setStepTwoOnEdit,
    setStepThreeOnEdit,
    setStageOnEdit,
    getProjectInfo,
    setPurpose,
    resetPurpose,
    resetEditStep,
    setEditPurpose,
    resetEditPurpose
  }
}