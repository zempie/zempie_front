
export default function () {
  const state = useState('state', () => ({
    isDone:false,
  }))

  const finishLoad = () => {
    state.value.isDone = true;
  }
  
  const startLoad = () =>{
    state.value.isDone = false;
  }

  return {
    state,
    finishLoad,
    startLoad
  }
}