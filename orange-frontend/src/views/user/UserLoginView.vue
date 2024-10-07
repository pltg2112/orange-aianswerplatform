<script setup lang="ts">
import { reactive } from 'vue'
import { userLoginUsingPost } from '@/api/userController'
import { useLoginUserStore } from '@/store/userStore'
import message from '@arco-design/web-vue/es/message'
import { router } from '@/router'

const form = reactive({
  userAccount: '',
  userPassword: ''
}) as API.UserLoginRequest

const loginUserStore = useLoginUserStore()

// 提交
const handleSubmit = async () => {
  const res = await userLoginUsingPost(form)
  console.log('登录请求的res',res)
  if (res.data.code === 0) {
    // 登录成功
    await loginUserStore.fetchLoginUser()
    console.log('登录提交的loginUserStore.loginUser',loginUserStore.loginUser)
    message.success('登录成功')
    router.push({
      path: '/',
      replace: true
    })
  } else {
    message.error('登录失败，' + res.data.message)
  }
}
</script>

<template>
  <div id="loginFrom">
    <a-space direction="vertical" size="large" class="space">
      <div style="display: flex; justify-content: center">
        <h2>用户登录</h2>
      </div>
      <a-form :model="form" layout="vertical" @submit="handleSubmit">
        <a-form-item field="userAccount" label="用户名">
          <a-input v-model="form.userAccount" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item field="userPassword" tooltip="密码不小于 8 位" label="密码">
          <a-input-password v-model="form.userPassword" placeholder="请输入密码" />
        </a-form-item>
        <a-form-item>
          <div>
            <a-button type="primary" html-type="submit" style="{width: 120px;margin-right: 120px;}">登录</a-button>
            <router-link :to="{path:'/user/register',replace: true}">未注册账号，前往注册</router-link>
          </div>
        </a-form-item>
      </a-form>
    </a-space>
  </div>
</template>

<style scoped>
#loginFrom {

}

.space {
  width: 350px;
  margin-top: 100px;
}
</style>
