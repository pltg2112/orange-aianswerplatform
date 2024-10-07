import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getLoginUserUsingGet } from '@/api/userController'
import ACCESS_ENUM from '@/access/accessEnum'

export const useLoginUserStore = defineStore('counter', () => {
  const loginUser = ref<API.LoginUserVO>({
    userName: '未登录'
  })

  function setLoginUser(newLoginUser: API.LoginUserVO) {
    loginUser.value = newLoginUser
  }

  async function fetchLoginUser() {
    const res = await getLoginUserUsingGet()
    if (res.data.code === 0 && res.data.data) {
      loginUser.value = res.data.data
    } else {
      // setTimeout(()=>{
      //   loginUser.value = { id:1,userName:'管理员',userRole: ACCESS_ENUM.ADMIN}
      // },2000)
      loginUser.value = { userRole: ACCESS_ENUM.NOT_LOGIN }
    }
  }

  return { loginUser, setLoginUser, fetchLoginUser }
})
