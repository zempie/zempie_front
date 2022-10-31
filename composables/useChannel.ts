import { IUserChannel } from "~~/types"

export default function () {
  const userChannel = useState('userChannel', () => ({
    info: null as IUserChannel,
    isLoading: true
  }))

  const setUserChannel = async (info: IUserChannel) => {
    userChannel.value.isLoading = true;

    if (info) {

      const { data: communities, error } = await useCustomFetch<[]>(`/user/${info.id}/list/community`, getComFetchOptions('get', true))

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
    userChannel.value.isLoading = false;
  }

  const getChannelInfo = async (channelId: string) => {
    const data = await $fetch<{ result: { target: IUserChannel } }>(`/channel/${channelId}`, getZempieFetchOptions('get', false))

    if (data) {
      const { target } = data.result;
      setUserChannel(target)
    }
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
    setUnfollowing,
    getChannelInfo
  }
}