/**
 * 2개 이상의 컴포넌트에서 쓰는 method
 */

import { eNotificationType, IFeed, INotification } from '~~/types'
import { getFirstDomElementByServer, stringToDomElemByServer } from './utils';
import { i18n } from '~~/modules/i18n';
import Vue from 'vue'

const HOURTOSEC = 60 * 60;

export default {
  /**
   * 유저 토큰 저장
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
      domain: config.COOKIE_DOMAINㅔ
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
   * 해당 메시지(notification)으로 이동
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
        router.push($localePath(`/${noti.user.nickname}`))
        break;
      case eNotificationType.recomment:
        router.push($localePath(`/feed/${noti.target_id}`))
        break

    }
  },

  /**
   *
   * @param type notification type(eNotificationType) 입력
   * @returns 보여줄 알람메시지 text
   */
  notiText: function (type: number) {

    const i18n = useNuxtApp().$i18n

    switch (type) {
      case eNotificationType.comment:
        return i18n.t('notification.comment')
      case eNotificationType.comment_like:
        return i18n.t('notification.like.comment')

      case eNotificationType.post_like:
        return i18n.t('notification.like.post')

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
        return i18n.t('notification.follow')
      case eNotificationType.recomment:
        return i18n.t('notification.recomment')
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


    useHead({
      title: `${title} | Zempie`,
      link: [
        {
          rel: 'alternate',
          href: `${config.ZEMPIE_URL}${route.fullPath}`,
          hreflang: 'ko',
        },
        {
          rel: 'alternate',
          href: `${config.ZEMPIE_URL}${route.fullPath}`,
          hreflang: 'en',
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
          name: 'robots',
          content: 'index, follow',
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          name: 'description',
          content: `${desc}`,
        },
        {
          property: 'og:title',
          content: `${title} | Zempie`,
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
          property: 'og:image:height',
          content: '400'
        },
        {
          property: 'og:image:width',
          content: '700'
        },
        {
          property: 'og:image:alt',
          content: `${title}`,
        }
      ],
    })

  },

  /**
   *
   * @param feed : feed 객체
   * @returns : 포스팅에서 사용할 제목이랑 본문 내용 리턴, 원문은 태그가 포함되어있음s
   */
  getFeedInfo: (feed: IFeed) => {
    const content = stringToDomElemByServer(feed.content);
    const h1Tag = content.querySelector('h1');
    const h2Tag = content.querySelector('h2');
    const h3Tag = content.querySelector('h3');
    const pTag = content.querySelector('p');

    let title = h1Tag?.innerText || h2Tag?.innerText || h3Tag?.innerText || pTag?.innerText;

    const firstDom = getFirstDomElementByServer(feed.content)
    let desc = firstDom?.innerText.slice(0, 50)

    if (!title) {
      title = desc.length ? desc.slice(0, 50) : feed?.user.name
    }
    return {
      title,
      desc
    }

  },

  /**
   * 
   * @param arr : db 버전 차이로 Json 인식을 못하는 경우가 있음 -> convert
   * @returns : array
   */
  toArray: (arr: string | []) => {
    return Array.isArray(arr) ? arr : JSON.parse(arr)
  }

}