<script setup lang="ts">
import { router, routes } from '@/router'
import { computed, onMounted, reactive } from 'vue'
import { useLoginUserStore } from '@/store/userStore'
import checkAccess from '@/access/checkAccess'
import { userLogoutUsingPost } from '@/api/userController'
import message from '@arco-design/web-vue/es/message'

const loginUserStore = useLoginUserStore()
loginUserStore.fetchLoginUser()
// 展示在菜单栏的可见路由
const visibleRoutes = computed(() => {
  return routes.filter((item) => {
    // 根据是否隐藏控制
    if (item.meta?.isVisible === false) {
      return false
    }
    // 根据权限控制
    if (!checkAccess(loginUserStore.loginUser, item.meta?.access)) {
      return false
    }
    return true
  })
})

//点击菜单跳转对应页面
const onMenuClick = (key: string) => {
  router.push({
    path: key
  })
}
//高亮菜单项
const selectedKey = reactive(['/'])
router.afterEach((to, from, failure) => {
  selectedKey.splice(0, 1, to.path)
})
//退出登录
const doLogout = async ()=>{
  const res = await userLogoutUsingPost()
  if(res.data.code === 0){
    message.success('退出登录成功')
    window.location.reload();
  }else{
    message.error('退出登录失败' + res.data.message)
  }
}
onMounted(()=>{
  console.log('loginUserStore.loginUser',loginUserStore.loginUser)
})
</script>

<template>
  <a-row class="grid-demo" align="center" :wrap="false">
    <a-col flex="auto">
      <a-menu mode="horizontal" :selected-keys="selectedKey" @menu-item-click="onMenuClick">
        <a-menu-item key="0" :style="{ padding: 0, marginRight: '38px' }" disabled>
          <div class="titleBar">
            <img class="logo" src="../assets/orange.svg" alt="小橙子" />
            <div class="title">小橙子</div>
          </div>
        </a-menu-item>
        <a-menu-item v-for="item in visibleRoutes" :key="item.path">
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col flex="150px">
      <template v-if="loginUserStore.loginUser.id">
        <a-popover position="bottom">
<!--          <a-button class="button" :style="{position: 'absolute',top:'240px',left:'180px'}">BOTTOM</a-button>-->
          <div style="display: flex; align-items: center; justify-content: center">
            <div style="margin-right: 15px">
              {{ loginUserStore.loginUser.userName ?? '匿名用户' }}
            </div>
            <a-avatar>
              <img alt="avatar" :src="loginUserStore.loginUser.userAvatar" />
            </a-avatar>
          </div>
          <template #content>
            <div>
              <a-button href="/personalCenter">个人中心</a-button>
            </div>
            <div>
              <a-button @click="doLogout">退出登录</a-button>
            </div>
          </template>
        </a-popover>
      </template>
      <template v-else>
        <a-button type="primary" @click="router.push('/user/login')">登录</a-button>
      </template>
    </a-col>
  </a-row>
</template>

<style lang="less" scoped>
.grid-demo{
  background-color: white;
}

.titleBar {
  display: flex;
  align-items: center;

  .logo {
    height: 52px;
  }

  .title {
    color: black;
    height: 52px;
    line-height: 52px;
    margin-left: 10px;
    //text-align: center;// 文本水平居中
  }
}
</style>
