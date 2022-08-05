import { IProject, eUploadStage } from "~~/types"

export default function () {
  const projectById = useState('projectById', () => ({    
      info: null as IProject
  }))
  const uploadProject = useState('uploadProject', () =>({
    stage:eUploadStage.NONE,
  }))



  const setProjectInfo = (info: IProject) =>{
    projectById.value.info = info;
  }

  const resetProjectInfo = () =>{
    projectById.value.info = null as IProject 
  }


  const setStage = (stage:number) =>{
    uploadProject.value.stage = stage;
  }
  const resetStage = () =>{
    uploadProject.value.stage = eUploadStage.NONE;
  }


  return {
    projectById,
    uploadProject,
    setProjectInfo,
    resetProjectInfo,
    setStage,
    resetStage    
  }
}