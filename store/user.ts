
import { defineStore } from 'pinia'
import * as Api from '~/api'



export const useUserStore = defineStore({
  id: 'user-store',
  state: () => {
    return {
      user: null,
      fUser: {},
      isLogin: false,
    }
  },
  actions: {
    async setUserInfo() {
      try {
        const { result } = await Api.auth.getUserInfo()
        const { user } = result
        if (user) {
          this.$state.isLogin = true;
          this.$state.user = user;
        }

      } catch (err: any) {
        console.error(err)
      }

    }

  },
  getters: {
    user: (state) => state.user,
    fUser: (state) => state.fUser,
    isLogin: (state) => state.isLogin,

  },
})
