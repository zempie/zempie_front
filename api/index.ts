import axios from "~/plugins/axios"


// import EX from './example'
const DOMAIN = process.env.BASE_API


async function request(method: string, url: string, data: any, withCredentials: boolean = false, errorCallback: Function | null = null, retryCount: number = 0): Promise<any> {


  // if (EX[url]) {
  //   console.log('[testAPI]', method, url, data, error)
  //   await delay(1000)
  //   if (error) {
  //     if (!EX[url][method].err) EX[url][method].err = { error: true }
  //     return Promise.reject(EX[url][method].err)
  //   }
  //   return Promise.resolve(EX[url][method].res)
  // }

  //파라미터 파싱용

  if (method === 'get') {
    url = DOMAIN + url + '?_=' + Date.now()

    // if (data) {
    //   for (let d in data) {
    //     if (data[d]) url += `&${d}=${data[d]}`
    //   }
    // }

    if (method == 'get' && typeof data == 'object') {
      for (let d in data) {
        url += `&${d}=${data[d]}`
      }
    }
  }

  // @ts-ignore

  return axios({
    method: method,
    url,
    data,
    withCredentials
  })
  // .catch((err: any) => {
  //   const { status } = err
  //   // if (status == UNAUTHORIZED) onUnauthorized()
  //   // if (status === USERBLOCK) return onBlock()
  //   throw err
  // })


  // @ts-ignore
  // const result = await Vue.$axios({
  //   method: method,
  //   url,
  //   data,
  //   withCredentials
  // });
  // return result.data;
}


// catch (error) {
//   // if ( error && error.response && error.response.data && error.response.data.error && error.response.data.error.message === 'Unauthorized' ) {
//   if (error?.response?.data?.error?.code === 10001 || error && error.response && error.response.data && error.response.data.error === 'Unauthorized') {
//     const currentUser = firebase.auth().currentUser;
//     if (currentUser) {
//       const idToken = await currentUser.getIdToken(true);
//       store.commit('idToken', idToken);
//       if (retryCount < 3) {
//         return await this.request(method, url, data, withCredentials, errorCallback, ++retryCount);
//       }
//       else {
//         //3번 초과
//         errorCallback && errorCallback(error);
//         // throw new Error(error);
//       }
//     }
//     else {
//       //로그인 안됨.
//       errorCallback && errorCallback(error);
//       // throw new Error(error)
//       // return error;
//     }
//   }
//   // console.log(error, error.message);
//   // throw error;
//   //error && error.response && error.response.data || error

//   const result = error && error.response && error.response.data || {
//     error: error.message || error,
//   };
//   throw result;
// }


export const auth = {

  getUserInfo() {
    return request('get', '/user/info', undefined, true)
  }


}
