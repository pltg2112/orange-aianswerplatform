<script setup lang="ts">
import { reactive, ref, watchEffect } from 'vue'
import { deleteUserUsingPost, listUserByPageUsingPost } from '@/api/userController'
import message from '@arco-design/web-vue/es/message'
import { dayjs } from '@arco-design/web-vue/es/_utils/date'

// 搜索表单
let form = reactive({
  userAccount: '',
  userProfile: ''
})
// 表格列
const columns = [
  {
    title: 'ID',
    dataIndex: 'id'
  },
  {
    title: '用户账号',
    dataIndex: 'userAccount'
  },
  {
    title: '用户名称',
    dataIndex: 'userName'
  },
  {
    title: '用户头像',
    dataIndex: 'userAvatar',
    slotName: 'avatar'
  },
  {
    title: '用户简介',
    dataIndex: 'userProfile'
  },
  {
    title: '用户权限',
    dataIndex: 'userRole'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    slotName: 'createTime'
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    slotName: 'updateTime'
  },
  {
    title: '操作',
    slotName: 'operation'
  }
]
// 初始参数
const initParams = reactive({
  current: 1,
  pageSize: 10
})
// 加载数据的请求参数
let searchParams = reactive<any>({
  ...initParams
})
// 数据列表
let dataList = ref<any>([])
// 数据总条数
let total = ref<number>(0)
/**
 * 点击搜索，改变searchParams，重新加载数据
 */
const doSearch = () => {
  searchParams.userAccount = form.userAccount
  searchParams.userProfile = form.userProfile
}
/**
 * 加载数据
 */
const loadData = async () => {
  const res = await listUserByPageUsingPost(searchParams)
  if (res.data.code === 0) {
    dataList.value = res.data.data?.records || []
    total.value = Number(res.data.data?.total) || 0
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
}
/**
 * 当分页变化时，改变searchParams，重新加载数据
 * @param page
 */
const onPageChange = (page: number) => {
  searchParams.current = page
}
/**
 * 监听loadData中的响应式数据，改变时重新渲染页面
 */
watchEffect(() => {
  loadData()
})
/**
 * 删除数据
 * @param record
 */
const doDelete = async (record: any) => {
  const res = await deleteUserUsingPost({
    id: record.id
  })
  if (res.data.code === 0) {
    message.info('删除成功')
    // 当前页被删空就请求前一页
    if((total.value-1) % searchParams.pageSize == 0){
      searchParams.current -= 1
    }
    loadData()
  } else {
    message.error('删除失败，' + res.data.message)
  }
}
</script>

<template>
  <div id="adminUserView">
    <a-form :model="form" layout="inline" @submit="doSearch" style="margin: 0 0 15px 20px">
      <a-form-item field="userAccount" label="用户账号">
        <a-input v-model="form.userAccount" placeholder="请输入用户账号" />
      </a-form-item>
      <a-form-item field="userProfile" label="用户简介">
        <a-input v-model="form.userProfile" placeholder="请输入用户简介" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">搜索</a-button>
      </a-form-item>
    </a-form>

    <a-table
      :columns="columns"
      :data="dataList"
      :pagination="{
        showTotal: true,
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total
      }"
      @pageChange="onPageChange"
    >
      <template #avatar="{ record }">
        <template v-if="record.userAvatar">
          <a-image width="64" :src="record.userAvatar" />
        </template>
        <template v-else>
          <div>无</div>
        </template>
      </template>
      <template #createTime="{ record }">
        {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template #updateTime="{ record }">
        {{ dayjs(record.updateTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template #operation="{ record }">
        <a-space>
          <a-button status="danger" @click="doDelete(record)">删除</a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<style scoped>
#adminUserView {
  height: 100%;
}
</style>
