export default function () {
  const zemtown = useState('zemtown', () => ({
    isOpenMyProfile: false,
    isOpenDm: false
  }))

  const openMyProfile = () => {
    zemtown.value.isOpenMyProfile = true
  }

  const closeMyProfile = () => {
    console.log('close')
    zemtown.value.isOpenMyProfile = false
  }


  const openDm = () => {
    zemtown.value.isOpenDm = true
  }

  const closeDm = () => {
    zemtown.value.isOpenDm = false
  }


  return {
    zemtown,
    openMyProfile,
    closeMyProfile,
    openDm,
    closeDm
  }

}