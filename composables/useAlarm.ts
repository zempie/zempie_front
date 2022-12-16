export default function () {
  const alarm = useState('alarm', () => ({
    newNoti: null
  }))

  const setNewNoti = (noti) => {
    alarm.value.newNoti = noti;
  }

  const resetNewNoti = () => {
    alarm.value.newNoti = null
  }

  return {
    alarm,
    setNewNoti,
    resetNewNoti
  }

}