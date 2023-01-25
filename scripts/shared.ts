/**
 * 2개 이상의 컴포넌트에서 쓰는 method
 */

import { eNotificationType, INotification } from '~~/types'
import { ElMessage } from 'element-plus'
const HOURTOSEC = 60 * 60;

export default {


  /**
   *
   * @param token access token
   * @param refreshToken refresh token
   */
  setTokens: function (token: string, refreshToken: string) {
    const { $cookies } = useNuxtApp()
    const config = useRuntimeConfig()

    console.log('setTokens')

    $cookies.set(config.COOKIE_NAME, token, {
      maxAge: HOURTOSEC,
      path: '/',
      domain: config.COOKIE_DOMAIN
    });
    $cookies.set(config.REFRESH_TOKEN, refreshToken, {
      maxAge: HOURTOSEC * 24 * 30,
      path: '/',
      domain: config.COOKIE_DOMAIN
    });
  },
  removeCookies: async function () {
    const { $cookies } = useNuxtApp()
    const config = useRuntimeConfig()

    $cookies.remove(config.COOKIE_NAME, {
      path: '/',
      domain: config.COOKIE_DOMAIN
    })

    $cookies.remove(config.REFRESH_TOKEN, {
      path: '/',
      domain: config.COOKIE_DOMAIN
    })

    if (config.public.ENV === 'development') {
      console.log('==dev==')

      $cookies.remove(config.COOKIE_NAME, {
        path: '/',
        domain: '.zempie.com'
      })
      $cookies.remove(config.REFRESH_TOKEN, {
        path: '/',
        domain: '.zempie.com'
      })

    }
  },
  /**
   * 해당 메세지(notification)으로 이동
   * @param noti notification 객체
   */
  moveNoti: function (noti: INotification) {
    const router = useRouter()
    const { $localePath } = useNuxtApp()
    console.log(noti)
    switch (noti.type) {
      case eNotificationType.comment:
        router.push($localePath(`/feed/${noti.target_id}`))
        break;
      case eNotificationType.comment_like:
        router.push($localePath(`/feed/${noti.target_id}`))
        break;
      case eNotificationType.post_like:
        router.push($localePath(`/feed/${noti.target_id}`))
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
      case eNotificationType.follow:
        router.push($localePath(`/channel/${noti.user.channel_id}`))
        break;


    }
  },

  /**
   *
   * @param type notification type(eNotificationType) 입력
   * @returns 보여줄 알람메세지 text
   */
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
      default:
        break;
    }
  },

  /**
   * head에 넣을 메타 태그(og tag)
   * @param title meta tag title
   * @param desc meta tag description
   * @param image 메타 태그로 보여줄 이미지가 다른 경우 이미지 입력 없는 경우 기본 이미지 출력
   */
  createHeadMeta: (
    title: string,
    desc: string,
    image?: string

  ) => {

    const route = useRoute()
    const config = useRuntimeConfig()
    const { t, locale } = useI18n()

    useHead({
      title: `${title} | Zempie`,
      link: [
        {
          rel: 'alternate',
          href: `${config.ZEMPIE_URL}${route.fullPath}`,
          hreflang: locale,
        },
        {
          rel: 'canonical',
          href: `${config.ZEMPIE_URL}${route.fullPath}`,
        },
      ],
      meta: [
        {
          property: 'og:site_name',
          content: 'Zempie',
        },
        {
          name: 'og:type',
          content: 'website',
        },
        {
          name: 'robots',
          content: 'index, follow',
        },
        {
          name: 'description',
          content: `${desc}`,
        },
        {
          property: 'og:title',
          content: `${title}`,
        },
        {
          property: 'og:description',
          content: `${desc}`,
        },
        {
          property: 'og:url',
          content: `${config.ZEMPIE_URL}${route.path}`,
        },
        {
          property: 'og:image',
          content: image ? `${image}` : `${config.OG_IMG}`,
        },
        {
          property: 'og:image:alt',
          content: `${title}`,
        }
      ],
    })

  }



}
