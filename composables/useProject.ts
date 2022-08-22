import { IProject, eUploadStage } from "~~/types"

export default function () {
  const projectById = useState('projectById', () => ({
    info: null as IProject,
    step: 1
  }))

  const uploadProject = useState('uploadProject', () => ({
    form: {
      stage: eUploadStage.NONE,
      name: "",
      pathname: "",
      description: "",
      hashtags: '',
      project_picture: '',
      project_picture2: ''
    },
    step: 1
  }))



  const setStepOneById = () => {
    projectById.value.step = 1;
  }
  const setStepTwoById = () => {
    projectById.value.step = 2;
  }
  const setStepThreeById = () => {
    projectById.value.step = 3;
  }


  const setStepOne = () => {
    uploadProject.value.step = 1;
  }
  const setStepTwo = () => {
    uploadProject.value.step = 2;
  }
  const setStepThree = () => {
    uploadProject.value.step = 3;
  }

  const setProjectInfo = (info: IProject) => {
    projectById.value.info = info;
  }

  const resetProjectInfo = () => {
    projectById.value.info = null as IProject
  }


  const setStage = (stage: number) => {
    uploadProject.value.form.stage = stage;
  }
  const resetStage = () => {
    uploadProject.value.form.stage = eUploadStage.NONE;
  }

  const setForm = (form: any) => {
    uploadProject.value.form = form
  }

  const resetForm = () => {
    uploadProject.value.form = {
      stage: eUploadStage.NONE,
      name: "",
      pathname: "",
      description: "",
      hashtags: '',
      project_picture: '',
      project_picture2: ''
    }
  }

  return {
    projectById,
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
    setStepOneById,
    setStepTwoById,
    setStepThreeById
  }
}