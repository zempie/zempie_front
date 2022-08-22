import { IUserChannel } from "~~/types"

export default function () {
  const userChannel = useState('userChannel', () => ({
    info: {} as IUserChannel
  }))

  const setUserChannel = async (info: IUserChannel) => {


    const { data: communities, error } = await useFetch<[]>(`/user/${info.id}/list/community`, getComFetchOptions('get', true))
    info.games.map((game) => {
      game.user = {
        name: info.name,
        id: info.id,
        uid: info.uid,
        email: info.email,
        channel_id: info.channel_id,
        picture: info.picture,
      }
    })
    info.communities = communities.value
    userChannel.value.info = info;

  }

  const resetUserChannel = () => {
    userChannel.value.info = {} as IUserChannel
  }

  const getUserJoinedCommunity = async (userId: number) => {
    return await user.joinedCommunity(userId)
  }

  const setFollowing = () => {
    userChannel.value.info.is_following = true;
  }
  const setUnfollowing = () => {
    userChannel.value.info.is_following = false;
  }


  return {
    userChannel,
    setUserChannel,
    resetUserChannel,
    setFollowing,
    setUnfollowing
  }
}