// import EX from '~/plugins/example'
import { ICommunityPayload } from '~~/types';

const delay = (ms: number) => new Promise((_) => setTimeout(_, ms))

// const BASE_API = process.env.BASE_API
// const COMMUNITY_API = process.env.COMMUNITY_API



function baseOption(method: string, withCredentials: boolean, body?: object) {
  const config = useRuntimeConfig();
  const accessToken = useCookie(config.COOKIE_NAME).value

  const options = {
    key: `${Date.now()}`,
    method: method,
    headers: accessToken && withCredentials ? { 'Authorization': `Bearer ${accessToken}` } : {},
    initialCache: false,
  }
  if (method === 'post' || method === 'put' || method === 'delete') {
    options['body'] = body;
  }
  return options
}

export const createQueryUrl = (url: string, queries: object) => {
  url = url + '?_=' + Date.now()
  if (queries) {
    for (let d in queries) {
      if (queries[d]) url += `&${d}=${queries[d]}`
    }
  }

  return url
}

export const getZempieFetchOptions = (method = 'get', withCredentials = false, body?: object) => {
  const config = useRuntimeConfig();
  const options = baseOption(method, withCredentials, body)
  options['baseURL'] = config.BASE_API
  return options
}


export const getStudioFetchOptions = (method = 'get', withCredentials = false, body?: object) => {
  const config = useRuntimeConfig();
  const options = baseOption(method, withCredentials, body)
  options['baseURL'] = config.STUDIO_API
  return options
}

export const getComFetchOptions = (method = 'get', withCredentials = false, body?: object) => {
  const config = useRuntimeConfig();
  const options = baseOption(method, withCredentials, body)
  options['baseURL'] = config.COMMUNITY_API
  return options
}


const useFetchData = async (method: string, url: string, data = null, withCredentials: boolean = false, error = false) => {
  const config = useRuntimeConfig();
  const accessToken = useCookie(config.COOKIE_NAME).value

  const options = {
    method: method,
    baseURL: config.BASE_API,
    headers: accessToken && withCredentials ? { 'Authorization': `Bearer ${accessToken}` } : {},
    initialCache: false,
  }

  // if (EX[url]) {
  //   console.log('[testAPI]', method, url, data, error)
  //   await delay(1000)
  //   if (error) {
  //     if (!EX[url][method].err) EX[url][method].err = { error: true }
  //     return Promise.reject(EX[url][method].err)
  //   }
  //   return Promise.resolve(EX[url][method].res)
  // }

  if (method === 'get') {
    url = url + '?_=' + Date.now()
    if (data) {
      for (let d in data) {
        if (data[d]) url += `&${d}=${data[d]}`
      }
    }
  } else {
    options['body'] = data;
  }
  const result = await useFetch(url, options)

  return result

}

const communityFetch = async (method: string, url: string, data = null, withCredentials: boolean = false, error = false) => {
  const config = useRuntimeConfig();
  const accessToken = useCookie(config.COOKIE_NAME).value

  const options = {
    method: method,
    baseURL: config.COMMUNITY_API,
    headers: accessToken && withCredentials ? { 'Authorization': `Bearer ${accessToken}` } : {},
    initialCache: false,
  }

  if (method === 'get') {
    url = url + '?_=' + Date.now()
    if (data) {
      for (let d in data) {
        if (data[d]) url += `&${d}=${data[d]}`
      }
    }
  } else {
    options['body'] = data;
  }

  return await useFetch<any>(url, options)


}


const studioFetch = async (method: string, url: string, data = null, withCredentials: boolean = false, error = false) => {
  const config = useRuntimeConfig();
  const accessToken = useCookie(config.COOKIE_NAME).value

  const options = {
    method: method,
    baseURL: config.STUDIO_API,
    headers: accessToken && withCredentials ? { 'Authorization': `Bearer ${accessToken}` } : {},
    initialCache: false,
  }
  if (method === 'get') {
    url = url + '?_=' + Date.now()
    if (data) {
      for (let d in data) {
        if (data[d]) url += `&${d}=${data[d]}`
      }
    }
  } else {
    options['body'] = data;
  }


  return await useFetch<any>(url, options)
}




export const auth = {
  // getUserInfo() {
  //   return useFetchData('get', '/user/info', undefined, true)
  // },
  setCookie() {
    return useFetchData('get', '/__cookie', undefined, false)
  },
  login() {
    return useFetchData('get', '/user/info', undefined, true)
  },
  hasEmail(obj: { email: string }) {
    return useFetchData('post', '/user/has-email', obj, false)
  },
  signUp(obj: { name: string; nickname?: string }) {
    return useFetchData('post', '/user/sign-up', obj, true)
  },
}

export const user = {
  getUserInfo(channelId: string) {
    return useFetchData('get', `/channel/${channelId}`, undefined, true)
  },
  follow(userId: number) {
    return communityFetch('post', `/user/${userId}/follow`, undefined, true);
  },
  unfollow(userId: number) {
    return communityFetch('post', `/user/${userId}/unfollow`, undefined, true);
  },
  joinedCommunity(userId: number) {
    return communityFetch('get', `/user/${userId}/list/community`, undefined, true)
  },
  followingList(obj: any, userId: number) {
    return communityFetch('get', `/user/${userId}/list/following`, obj, true);
  },
  followerList(obj: any, userId: any) {
    return communityFetch('get', `/user/${userId}/list/follower`, obj, true);
  },
  updateInfo(formData: FormData) {
    return useFetchData('post', `/user/update/info`, formData, true);
  },
  leave(obj: { text: string, num: string }) {
    return useFetchData('post', `/user/leave-zempie`, obj, true);
  }
}

export const game = {
  list(obj: { limit: number, offset: number, category?: number, sort?: string, dir?: string }) {
    return useFetchData('get', '/games', obj, false)
  },
  upload(formData: FormData) {
    return studioFetch('post', '/studio/project', formData, true);
  },
  verifyPath(pathName: string) {
    return studioFetch('get', `/studio/verify-pathname/${pathName}`, undefined, true);
  },
  getInfo(pathname: string) {
    return useFetchData('get', `/launch/game/${pathname}`, undefined, false)
  },
  getTimeline(gameId: number, obj?: { limit: number, offset: number, sort: string, media: string }) {
    return communityFetch('get', `/timeline/game/${gameId}`, obj, false)
  }

}

export const project = {
  list() {
    return studioFetch('get', '/studio/project', undefined, true);
  },
  getInfoById(id: number) {
    return useFetchData('get', `/community/project/${id}`, undefined, true);
  },
  delete(id: number) {
    return studioFetch('delete', `/studio/project/${id}`, undefined, true);
  },
  update(id: number, formData: FormData) {
    return studioFetch('post', `/studio/project/${id}`, formData, true)
  }
}

export const community = {
  list(obj: ICommunityPayload) {
    return communityFetch('get', '/community/list', obj, true)
  },
  subscribe(communityId: string) {
    return communityFetch('post', `/community/${communityId}/subscribe`, undefined, true);
  },
  unsubscribe(communityId: string) {
    return communityFetch('post', `/community/${communityId}/unsubscribe`, undefined, true);
  },
  search(obj: any) {
    return communityFetch('get', `/search`, obj, false)
  },
  getInfo(id: string) {
    return communityFetch('get', `/community/${id}`, undefined, true);
  },
  getMembers(communityId: string, obj: any) {
    return communityFetch('get', `/community/${communityId}/members`, obj, true);
  },

}

export const post = {
  upload(obj: any) {
    return communityFetch('post', `/post`, obj, true);
  },
  getUserPosts(channelId: string, obj: any) {
    return communityFetch('get', `/timeline/channel/${channelId}`, obj, true)
  },
  getCommunityPosts(communityId: string, obj: any) {
    return communityFetch('get', `/timeline/${communityId}/post`, obj, true)
  },
  getInfo(postId: string) {
    return communityFetch('get', `/post/${postId}`, undefined, false)
  },
  delete(postId: string) {
    return communityFetch('delete', `/post/${postId}`, undefined, true)
  },
  like(postId: string) {
    return communityFetch('post', `/post/${postId}/like`, undefined, true)
  },
  unlike(postId: string) {
    return communityFetch('post', `/post/${postId}/unlike`, undefined, true);
  }

}

