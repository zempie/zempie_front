import axios from 'axios'
import firebase from '~/scripts/firebase'
import { useUserStore } from '~/store/user'



const config = {
  timeout: 5000,
}

const Axios = axios.create(config)

Axios.interceptors.request.use(

  (config) => {
    const userStore = useUserStore()

    config.headers.common['Authorization'] = `Bearer ${userStore.$state.fUser.accessToken}`
    if (process.env.NODE_ENV === 'development') {
      const { method, url, data } = config
      console.log('->', method, url, data)
    }
    return config
  },
  (error) => {
    console.log('interceptors request error')
    return Promise.reject(error)
  }
)

Axios.interceptors.response.use(
  (response) => {
    const { status, data, statusText } = response
    if (process.env.NODE_ENV === 'development') {
      console.log('<-', status, data, statusText)
    }
    return data
  },
  (error) => {
    let ret: any = {}
    if (error.response) {
      const { status, data, statusText } = error.response
      if (process.env.NODE_ENV === 'development') {
        console.log('error', status, data, statusText)
      }
      ret.status = status
      if (typeof data == 'object') ret = { status, ...data }
      if (typeof data == 'string') ret = { status, error: data }

      if (!ret.error) ret.error = statusText
    } else {
      ret = {
        status: 500,
        ...error,
      }
      console.error('[Error]', error)
    }
    return Promise.reject(ret)
  }
)

export default Axios
