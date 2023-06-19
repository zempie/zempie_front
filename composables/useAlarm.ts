export default function () {
  const alarm = useState('alarm', () => ({
    newNoti: null,
    // unread_dm:0,

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