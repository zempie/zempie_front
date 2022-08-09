import { IProject, eUploadStage } from "~~/types"

export default function () {
  const projectById = useState('projectById', () => ({    
      info: null as IProject
  }))

  const uploadProject = useState('uploadProject', () =>({
    form:{
      stage:eUploadStage.NONE,
    },
  }))



  const setProjectInfo = (info: IProject) =>{
    projectById.value.info = info;
  }

  const resetProjectInfo = () =>{
    projectById.value.info = null as IProject 
  }


  const setStage = (stage:number) =>{
    uploadProject.value.form.stage = stage;
  }
  const resetStage = () =>{
    uploadProject.value.form.stage = eUploadStage.NONE;
  }

  const setForm = (form: any)=>{
    uploadProject.value.form = form
  }

  const resetForm = ()=>{
    uploadProject.value.form = {
      stage:eUploadStage.NONE,
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
    resetForm    
  }
}