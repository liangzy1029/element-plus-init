import axios from 'axios'
import { ElMessage } from 'element-plus'

/** 创建 Axios 实例 */
const request = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 1000 * 60 * 15,
  withCredentials: true,
})

/** 全局请求拦截器 */
request.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => Promise.reject(error),
)

/** 全局响应拦截器 */
request.interceptors.response.use(
  function (response) {
    const { data } = response
    // 未登录
    if (data.code === 40100) {
      // 不是获取用户信息的请求，并且用户目前不是已经在用户登录页面，则跳转到登录页面
      if (!response.request.responseURL.includes('/login')) {
        ElMessage.warning('请先登录')
        window.location.href = `/login?redirect=${window.location.href}`
      }
    }
    return response
  },
  function (error) {
    return Promise.reject(error)
  },
)

export default request
