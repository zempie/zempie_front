import { IProject, eGameStage } from "~~/types"

export default function () {

  const editProject = useState('editProject', () => ({
    info: {} as IProject,
    step: 1
  }))

  const getProjectInfo = async (id: string | number) => {
    const { data, error } = await useFetch<{ result: IProject }>(`/community/project/${id}`, getZempieFetchOptions('get', true))

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
    step: 1
  }))


  const setStepOne = () => {
    uploadProject.value.step = 1;
  }
  const setStepTwo = () => {
    uploadProject.value.step = 2;
  }
  const setStepThree = () => {
    uploadProject.value.step = 3;
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
    setStepOneOnEdit,
    setStepTwoOnEdit,
    setStepThreeOnEdit,
    setStageOnEdit,
    getProjectInfo
  }
}