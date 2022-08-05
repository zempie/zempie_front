import { IUserChannel } from "~~/types"

export default function () {
  const userChannel = useState('userChannel', () => ({    
      info: {} as IUserChannel
  }))

  const setUserChannel = (info:IUserChannel) =>{
    info.games.map((game)=>{
      game.user = {
        name:info.name,
        id:info.id,
        uid:info.uid,
        email:info.email,
        channel_id:info.channel_id,
        picture:info.picture,
      }
    })
    userChannel.value.info = info;
    
  }

  const resetUserChannel = () =>{
    userChannel.value.info = {} as IUserChannel 
  }

  return {
    userChannel,
    setUserChannel,
    resetUserChannel,
   
  }
}