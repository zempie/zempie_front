import { getAuth, getIdToken } from "firebase/auth";

function baseOption(method: string, withCredentials: boolean, body?: object) {
  const config = useRuntimeConfig();
  const accessToken = useCookie(config.COOKIE_NAME)

  const options = {
    key: `${Date.now()}`,
    method: method,
    headers: {},
    initialCache: false,
    credentials: withCredentials
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


const useFetchData = async<T>(method: string, url: string, data = null, withCredentials: boolean = false, error = false) => {
  const config = useRuntimeConfig();

  const options = {
    method: method,
    baseURL: config.BASE_API,
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
  return await useFetch<T>(url, {
    ...options,
    async onResponse({ request, response, options }) {

    },
    async onResponseError({ request, response, options }) {

    },
    async onRequest({ request, options }) {
      const user = await getCurrentUser()

      if (user) {
        const expirationTime = user.stsTokenManager.expirationTime
        let token = user.accessToken
        if (expirationTime <= Date.now()) {
          const newToken = await getIdToken(user, true)
          console.log(newToken)
        }
        options.headers['Authorization'] = `Bearer ${token}`
      }


      options.headers = options.headers || {}


      console.log('[fetch request]')

    },
    async onRequestError({ request, options, error }) {

    }
  })


}

const communityFetch = async (method: string, url: string, data = null, withCredentials: boolean = false, error = false) => {
  const config = useRuntimeConfig();
  const accessToken = useUser().user.value.fUser.accessToken

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
  const accessToken = useUser().user.value.fUser.accessToken

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


export const searchKeyword = (keyword: string) => {
  return communityFetch('get', `/search?q=${keyword}`, undefined, false);
}

export const game = {
  // list(obj: { limit: number, offset: number, category?: number, sort?: string, dir?: string }) {
  //   return useFetchData('get', '/games', obj, false)
  // },
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


export const post = {
  upload(obj: any) {
    return communityFetch('post', `/post`, obj, true);
  },
}

