export default function () {
  const userModal = useState('modal', () => ({
    isOpen:false,
   }))

   

  const openModal = () =>{
    userModal.value.isOpen = true;
  }

  const closeModal =  () =>{
    userModal.value.isOpen = false;

  }

  const loginModal = useState('modal', () => ({
    isOpen:false,
   }))

   const openLoginModal = () =>{
    loginModal.value.isOpen = true;
  }

  const closeLoginModal =  () =>{
    loginModal.value.isOpen = false;

  }

  return {
    userModal,
    openModal,
    closeModal,
    loginModal,
    openLoginModal,
    closeLoginModal

  }
}