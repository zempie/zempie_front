import { IUserChannel } from "~~/types"

export default function () {
  const userChannel = useState('userChannel', () => ({
    info: {} as IUserChannel,
    isLoading: true
  }))

  const setUserChannel = async (info: IUserChannel) => {
    userChannel.value.isLoading = true;

    if (info) {

      const response = await useCustomFetch<[]>(`/user/${info.id}/list/community`, getComFetchOptions('get', true))

      info.games.map((game) => {
        game.user = {
          name: info.name,
          nickname: info.nickname,
          id: info.id,
          uid: info.uid,
          email: info.email,
          channel_id: info.channel_id,
          picture: info.picture,
        }
      })

      info.games.sort((a, b) => {
        return new Date(b.created_at).valueOf() - new Date(a.created_at).valueOf();
      })

      info.communities = response
      userChannel.value.info = info;
    }
    userChannel.value.isLoading = false;
  }

  /**
   *
   * @param userId : 유저 닉네임(프론트에서는 id 로 사용하고 있고 백엔드에서는 nickname 으로 사용중임...)
   */
  const getChannelInfo = async (userId: string) => {
    console.log(userId)

    const data = await useCustomFetch<{ result: { target: IUserChannel } }>(`/user/${userId}`, getZempieFetchOptions('get', false))

    // const data = await useCustomFetch<{ result: { target: IUserChannel } }>(`/channel/${channelId}`, getZempieFetchOptions('get', false))

    if (data) {
      const { target } = data.result;

      await setUserChannel(target)
    }

  }

  const resetUserChannel = () => {
    userChannel.value.info = {} as IUserChannel
  }


  const setFollowing = () => {
    userChannel.value.info.is_following = true;
  }
  const setUnfollowing = () => {
    userChannel.value.info.is_following = false;
  }

  const increaseFollowerCnt = () => {
    userChannel.value.info.follower_cnt += 1
  }

  const decreaseFollowerCnt = () => {
    userChannel.value.info.follower_cnt -= 1
  }

  const increaseFollowingCnt = () => {
    userChannel.value.info.following_cnt += 1
  }

  const decreaseFollowingCnt = () => {
    userChannel.value.info.following_cnt -= 1
  }

  const updateChannelBlockInfo = (status: boolean) => {
    userChannel.value.info.is_blocked = status
  }
  return {
    userChannel,
    setUserChannel,
    resetUserChannel,
    setFollowing,
    setUnfollowing,
    getChannelInfo,
    increaseFollowerCnt,
    increaseFollowingCnt,
    decreaseFollowerCnt,
    decreaseFollowingCnt,
    updateChannelBlockInfo
  }
}
