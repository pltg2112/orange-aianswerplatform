<script setup lang="ts">
import HomeCard from '@/components/HomeCard.vue'
import { ref, watchEffect } from 'vue'
import { REVIEW_STATUS_ENUM } from '@/constant/app'
import message from '@arco-design/web-vue/es/message'
import { listAppVoByPageUsingPost } from '@/api/appController'

// 初始参数
const initParams = {
  current: 1,
  pageSize: 10
}
// 加载数据的请求参数
let searchParams = ref<any>({
  ...initParams
})
// 数据列表
let dataList = ref<any>([])
// 数据总条数
let total = ref<number>(0)

/**
 * 加载数据
 */
const loadData = async () => {
  const params = {
    reviewStatus: REVIEW_STATUS_ENUM.PASS,
    ...searchParams.value
  }
  const res = await listAppVoByPageUsingPost(params)
  if (res.data.code === 0) {
    dataList.value = res.data.data?.records || []
    total.value = Number(res.data.data?.total) || 0
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
}
/**
 * 搜索
 * @param str 应用名称
 */
const formSearchParams = ref<API.AppQueryRequest>({})
const doSearch = () => {
  searchParams.value = {
    ...initParams,
    ...formSearchParams.value
  }
}
/**
 * 当分页变化时，改变searchParams，重新加载数据
 * @param page
 */
const onPageChange = (page: number) => {
  searchParams.value.current = page
}
/**
 * 监听loadData中的响应式数据，改变时重新渲染页面
 */
watchEffect(() => {
  loadData()
})
</script>

<template>
  <div id="homeView">
    <a-form
      :model="formSearchParams"
      :style="{ marginBottom: '20px' }"
      layout="inline"
      @submit="doSearch"
    >
      <a-form-item field="appName" label="应用名称">
        <a-input
          v-model="formSearchParams.appName"
          placeholder="请输入应用名称"
          allow-clear
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100px">
          搜索
        </a-button>
      </a-form-item>
    </a-form>
    <div class="card-list">
      <a-list
        class="list-demo-action-layout"
        :grid-props="{ gutter: [20, 20], sm: 24, md: 12, lg: 8, xl: 6 }"
        :bordered="false"
        :data="dataList"
        :pagination-props="{
          current: searchParams.current,
          pageSize: searchParams.pageSize,
          total
        }"
        @page-change="onPageChange"
      >
        <template #item="{ item }">
          <home-card :app="item" />
        </template>
      </a-list>
    </div>
  </div>
</template>

<style scoped>
#homeView {
}

.searchBar {
  text-align: center;
  margin-bottom: 20px;
}

.list-demo-action-layout .image-area {
  width: 183px;
  height: 119px;
  border-radius: 2px;
  overflow: hidden;
}

.list-demo-action-layout .list-demo-item {
  padding: 20px 0;
  border-bottom: 1px solid var(--color-fill-3);
}

.list-demo-action-layout .image-area img {
  width: 100%;
}

.list-demo-action-layout .arco-list-item-action .arco-icon {
  margin: 0 4px;
}
</style>
