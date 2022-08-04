
// import { defineStore } from 'pinia'

// export const useUserStore = defineStore({
//   id: 'user-store',
//   state: () => {
//     return {
//       user: null,
//       isLogin: false,
      
//     }
//   },
//   actions: {
//     async setUserInfo() {      
//       try {      
//          const {data, pending, refresh, error} = await useFetchData('get', 'https://randomuser.me/api')
//          const [info] = data.value.results;
          
//          const userInfo = {
//           nickname: info.name.first,
//           email:info.email,
//           point:100,
//           uid:info.login.uuid,
//           profile_img:info.picture.thumbnail
//          }         
         
//         sessionStorage.setItem('access_token',info.login.uuid )        
//         this.$state.user = userInfo;

//       } catch (err: any) {
//         console.error(err)
//       }

//     }

//   },

// })
