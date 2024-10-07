import { createRouter, createWebHistory } from 'vue-router'
import UserLayout from '@/layouts/UserLayout.vue'
import UserLoginView from '@/views/user/UserLoginView.vue'
import ACCESS_ENUM from '@/access/accessEnum'
import { useLoginUserStore } from '@/store/userStore'
import checkAccess from '@/access/checkAccess'
import UserRegisterView from '@/views/user/UserRegisterView.vue'

const routes = [
  {
    path: '/',
    name: '主页',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/noAuth',
    name: '无权限',
    // 路由懒加载
    component: () => import('../views/NoAuthView.vue'),
    meta: {
      isVisible: false
    }
  },
  {
    path: '/createApp',
    name: '创建应用',
    component: () => import('../views/app/CreateAppView.vue')
  },
  {
    path: '/createApp/:id',
    name: '编辑应用',
    props: true,
    component: () => import('../views/app/CreateAppView.vue'),
    meta: {
      isVisible: false
    }
  },
  {
    path: '/createQuestion/:appId',
    name: '创建题目',
    props: true,
    component: () => import('../views/question/CreateQuestionView.vue'),
    meta: {
      isVisible: false
    }
  },
  {
    path: '/createScoring/:appId',
    name: '创建评分',
    props: true,
    component: () => import('../views/scoring/CreateScoringView.vue'),
    meta: {
      isVisible: false
    }
  },
  {
    path: '/app/detail/:id',
    name: '应用详情页',
    props: true,
    component: () => import('../views/app/AppDetailView.vue'),
    meta: {
      isVisible: false
    }
  },
  {
    path: "/answer/do/:appId",
    name: "答题",
    component: () => import('../views/answer/DoAnswerView.vue'),
    props: true,
    meta: {
      isVisible: false,
      access: ACCESS_ENUM.USER,
    },
  },
  {
    path: "/answer/result/:id",
    name: "答题结果",
    component: () => import('../views/answer/AnswerResultView.vue'),
    props: true,
    meta: {
      isVisible: false,
      access: ACCESS_ENUM.USER,
    },
  },
  {
    path: "/answer/my",
    name: "我的答题",
    component: () => import('../views/answer/MyAnswerView.vue'),
    meta: {
      access: ACCESS_ENUM.USER,
    },
  },
  {
    path: '/admin/app',
    name: '应用管理',
    component: () => import('../views/admin/AdminAppView.vue'),
    meta: {
      access: ACCESS_ENUM.ADMIN,
    },
  },
  {
    path: "/admin/question",
    name: "题目管理",
    component: () => import('../views/admin/AdminQuestionView.vue'),
    meta: {
      access: ACCESS_ENUM.ADMIN,
    },
  },
  {
    path: "/admin/scoring",
    name: "评分管理",
    component: () => import('../views/admin/AdminScoringView.vue'),
    meta: {
      access: ACCESS_ENUM.ADMIN,
    },
  },
  {
    path: "/admin/user_answer",
    name: "回答管理",
    component: () => import('../views/admin/AdminAnswerView.vue'),
    meta: {
      access: ACCESS_ENUM.ADMIN,
    },
  },
  {
    path: '/admin/user',
    name: '用户管理',
    // 路由懒加载
    component: () => import('../views/admin/AdminUserView.vue'),
    meta: {
      access: ACCESS_ENUM.ADMIN
    }
  },
  {
    path: '/user',
    name: '用户',
    component: UserLayout,
    meta: {
      isVisible: false
    },
    children: [
      {
        path: '/user/login',
        name: '用户登录',
        component: UserLoginView
      },
      {
        path: '/user/register',
        name: '用户注册',
        component: UserRegisterView
      },
    ]
  },
  {
    path: '/personalCenter',
    name: '个人中心',
    component: () => import('../views/PersonalCenterView.vue'),
    meta: {
      isVisible: false,
      access: ACCESS_ENUM.USER
    }
  },
  {
    path: '/about',
    name: '关于',
    // 路由懒加载
    component: () => import('../views/AboutView.vue'),
    meta: {
      isVisible: false
    }
  },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 进入新页面前的权限校验
router.beforeEach(async (to, from, next) => {
  // 获取当前登录用户
  const loginUserStore = useLoginUserStore()
  let loginUser = loginUserStore.loginUser
  // 如果没有尝试获取过登录用户信息，获取后再赋值
  if (!loginUser.userRole) {
    await loginUserStore.fetchLoginUser()
    loginUser = loginUserStore.loginUser
  }
  // 当前页面需要的权限
  const needAccess = (to.meta?.access as string) ?? ACCESS_ENUM.NOT_LOGIN
  // 新页面必须要登录
  if (needAccess !== ACCESS_ENUM.NOT_LOGIN) {
    // 如果未登录或者登录失败
    // if (!loginUser || !loginUser.userRole || loginUser.userRole === ACCESS_ENUM.NOT_LOGIN) {
    //   next(`/user/login?redirect=${to.fullPath}`)
    // }
    if (loginUser.userRole === ACCESS_ENUM.NOT_LOGIN) {
      if (from.path === '/user/login') {
        // 在登录页，无需跳转
        console.log('在登录页，无需跳转')
      } else {
        // 不在登录页，跳转至登录页
        next(`/user/login?redirect=${to.fullPath}`)
      }
    }

    // 如果已经登录，判断权限是否足够，如果不足，跳转到无权限页面
    if (!checkAccess(loginUser, needAccess)) {
      next('noAuth')
    }
  }
  next()
})

export { routes, router }
