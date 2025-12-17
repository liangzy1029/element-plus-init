import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getLoginUser, userLogout } from '@/api/userController'

const DefaultLoginUser: API.LoginUserVO = {
  userAccount: '',
  userName: '',
  userAvatar: '',
  userProfile: '',
  userRole: '',
  createTime: '',
}

export const useUserStore = defineStore('user', () => {
  const loginUser = ref<API.LoginUserVO>({ ...DefaultLoginUser })

  const doUserLogout = async () => {
    userLogout()
    loginUser.value = { ...DefaultLoginUser }
  }

  const fetchLoginUser = async () => {
    const res = await getLoginUser()
    const { code, data } = res.data
    if (code === 0 && data) {
      loginUser.value = data
    } else {
      loginUser.value = { ...DefaultLoginUser }
    }
  }

  return {
    loginUser,
    doUserLogout,
    fetchLoginUser,
  }
})
