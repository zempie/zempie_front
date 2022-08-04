import EX from '~/plugins/example'

const delay = (ms:number) => new Promise((_) => setTimeout(_, ms))

// const BASE_API = process.env.BASE_API
// const COMMUNITY_API = process.env.COMMUNITY_API

 const useFetchData = async(method: string, url: string, data = null, withCredentials:boolean = false,  error = false) => {
  const config = useRuntimeConfig();
  const accessToken = useCookie(config.COOKIE_NAME).value
  
  
  if (EX[url]) {
    console.log('[testAPI]', method, url, data, error)
    await delay(1000)
    if (error) {
      if (!EX[url][method].err) EX[url][method].err = { error: true }
      return Promise.reject(EX[url][method].err)
    }
    return Promise.resolve(EX[url][method].res)
  }

  if (method === 'get') {    
    url = url + '?_=' + Date.now()
    if(data) {
      for (let d in data) {
          if (data[d]) url += `&${d}=${data[d]}`
      }
    }    
  }


  const result =  await useFetch(url, {
    method:method,  
    body:data,
    baseURL:config.BASE_API,
    headers: accessToken? {'Authorization' :  `Bearer ${accessToken}`} : {},
    initialCache:false,
  })

  return result
  
}

const communityFetch = async(method: string, url: string, data = null, withCredentials:boolean = false,  error = false) => {
  const config = useRuntimeConfig();
  const accessToken = useCookie(config.COOKIE_NAME).value

  if (method === 'get') {    
    url = url + '?_=' + Date.now()
    if(data) {
      for (let d in data) {
          if (data[d]) url += `&${d}=${data[d]}`
      }
    }    
  }


  const result =  await useFetch(url, {
    method:method,  
    body:data,
    baseURL:config.COMMUNITY_API,
    headers: accessToken? {'Authorization' :  `Bearer ${accessToken}`} : {},
    initialCache:false,
  })

  return result


}


const studioFetch = async(method: string, url: string, data = null, withCredentials:boolean = false,  error = false) => {
  const config = useRuntimeConfig();
  const accessToken = useCookie(config.COOKIE_NAME).value

  if (method === 'get') {    
    url = url + '?_=' + Date.now()
    if(data) {
      for (let d in data) {
          if (data[d]) url += `&${d}=${data[d]}`
      }
    }    
  }


return await useFetch(url, {
    method:method,  
    body:data,
    baseURL:config.STUDIO_API,
    headers: accessToken? {'Authorization' :  `Bearer ${accessToken}`} : {},
    initialCache:false,
  })
}




export const auth = {
  // getUserInfo() {
  //   return useFetchData('get', '/user/info', undefined, true)
  // },

  login(){
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
  getUserInfo(channelId: string){
    return useFetchData('get', `/channel/${channelId}`,undefined, true)
  }, 
  follow(){
    // return communityFetch('post', )
  }
}

export const game = {
  list(obj : {limit:number, offset:number, category:string, sort:string, dir: string}){
    return useFetchData('get', '/games', obj, false)
  },
  upload(formData:FormData) {
    return studioFetch('post', '/studio/project', formData, false);
  },
  verifyPath(pathName: string){
    return studioFetch('get', `/studio/verify-pathname/${pathName}`, undefined, false);
  },
  
}

export const project = {
 list() {
  return studioFetch('get', '/studio/project', undefined, true);
 },
 getInfoById(id: number){
  return useFetchData('get', `/community/project/${id}`, undefined, true);
 },
 delete(id:number){
  return studioFetch('delete', `/studio/project/${id}`, undefined, true);
 },
 update(id: number, formData:FormData){
  return studioFetch('post', `/studio/project/${id}`, formData, false)
 }        
}

