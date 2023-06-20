export default function () {
  const alarm = useState('alarm', () => ({
    newNoti: null,
    // unread_dm:0,
    newDm: null

  }))

  const setNewNoti = (noti) => {
    alarm.value.newNoti = noti;
  }

  const resetNewNoti = () => {
    alarm.value.newNoti = null
  }

  const setNewDm = (dm) => {
    alarm.value.newDm = dm
  }

  return {
    alarm,
    setNewNoti,
    resetNewNoti,
    setNewDm
  }

}