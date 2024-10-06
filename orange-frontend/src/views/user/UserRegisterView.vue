<script setup lang="ts">
import { reactive } from 'vue'
import { userRegisterUsingPost } from '@/api/userController'
import message from '@arco-design/web-vue/es/message'
import { router } from '@/router'

const form = reactive({
  userAccount: '',
  userPassword: '',
  checkPassword: ''
}) as API.UserRegisterRequest

// 提交
const handleSubmit = async () => {
  const res = await userRegisterUsingPost(form)
  if (res.data.code === 0) {
    // 注册成功
    message.success('注册成功')
    router.push({
      path: '/user/login',
      replace: true
    })
  } else {
    message.error('注册失败，' + res.data.message)
  }
}
</script>

<template>
  <div id="loginFrom">
    <a-space direction="vertical" size="large" class="space">
      <div style="display: flex; justify-content: center">
        <h2>用户注册</h2>
      </div>
      <a-form :model="form" layout="vertical" @submit="handleSubmit">
        <a-form-item field="userAccount" label="用户名">
          <a-input v-model="form.userAccount" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item field="userPassword" tooltip="密码不小于 8 位" label="密码">
          <a-input-password v-model="form.userPassword" placeholder="请输入密码" />
        </a-form-item>
        <a-form-item field="checkPassword" tooltip="确认密码不小于 8 位" label="确认密码">
          <a-input-password v-model="form.checkPassword" placeholder="请再次输入密码" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" style="{width: 120px;}">注册</a-button>
        </a-form-item>
      </a-form>
    </a-space>
  </div>
</template>

<style scoped>
#loginFrom {
  display: flex;
}

.space {
  width: 350px;
  margin-top: 100px;
}
</style>
