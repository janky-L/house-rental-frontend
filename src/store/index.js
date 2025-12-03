import { createPinia, defineStore } from 'pinia'

export const pinia = createPinia()

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || ''  // 刷新页面时读取
  }),
  actions: {
    setToken(t) {
      this.token = t
      localStorage.setItem('token', t)  // 同步存储到 localStorage
    },
    clearToken() {
      this.token = ''
      localStorage.removeItem('token')
    }
  }
})
