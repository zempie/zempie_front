/**
 * 2개 이상의 컴포넌트에서 쓰는 method
 */

import { eNotificationType } from '~~/types'
import { ElMessage } from 'element-plus'

export default {
  moveNoti: function (type: number, target_id: string) {
    const router = useRouter()
    const { $localePath } = useNuxtApp()
    switch (type) {
      case eNotificationType.comment:
        break;
      case eNotificationType.comment_like:
        break;
      case eNotificationType.post_like:
        router.push($localePath(`/feed/${target_id}`))
        break;
      case eNotificationType.post:
        console.log('post')
        break;
      case eNotificationType.retweet:
        console.log('retweet')
        break;
      case eNotificationType.notice:
        console.log('notice')
        break;

    }
  },

  notiText: function (type: number) {

    switch (type) {
      case eNotificationType.comment:
        return 'wrote comment on your post'
      case eNotificationType.comment_like:
        return 'likes you comment'
      case eNotificationType.post_like:
        return `likes your posting`
      case eNotificationType.post:
        console.log('post')
        break;
      case eNotificationType.retweet:
        console.log('retweet')
        break;
      case eNotificationType.notice:
        console.log('notice')
        break;
      case eNotificationType.follow:
        return 'follows you'


    }
  },

  commonTryCatch: async function (tryfn: any) {
    try {
      return await tryfn()
    } catch (error: any) {
      ElMessage({
        message: error || "Please try again a bit later.",
        type: 'error',
      })
      throw error;
    }
  }

}