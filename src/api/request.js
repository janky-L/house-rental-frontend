import axios from "axios"
import { useUserStore } from "../store"
import router from "../router"

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // 后端地址
  timeout: 5000
})

// 请求拦截器
instance.interceptors.request.use(config => {
  const store = useUserStore()
  if (store.token) {
    config.headers.Authorization = store.token
  }
  return config
})

// 响应拦截器
instance.interceptors.response.use(
  res => {
    const code = res.data.code
    if (code === 200) {
      return res.data.data
    } else {
      if (code === 1001 || code === 1002) {
        router.push("/login")
      }else {
        alert("请求失败：" + res.data.msg)
        return Promise.reject(res.data)
      }
    }
  },
  err => {
    const code = err.response.data.code 
    if (code === 1001 || code === 1002) {
      alert(err.response.data.msg)
      router.push("/login")
    } else {
      alert("请求失败：" + err.response.data.msg)
      return Promise.reject(err)
    }
  }
)

export default instance
