<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import message from '@arco-design/web-vue/es/message'
import { addAppUsingPost, editAppUsingPost, getAppVoByIdUsingGet } from '@/api/appController'
import { APP_SCORING_STRATEGY_MAP, APP_TYPE_MAP } from '@/constant/app'
import PictureUploader from '@/components/PictureUploader.vue'
import { useRouter } from 'vue-router'

interface Props {
  id: string
}

const props = withDefaults(defineProps<Props>(), {
  id: () => {
    return ''
  }
})
let oldApp = ref<API.AppVO>({})
let form = ref({
  appDesc: '',
  appIcon: '',
  appName: '',
  appType: 0,
  scoringStrategy: 0
} as API.AppAddRequest)
/**
 * 加载数据
 */
const loadData = async () => {
  if (!props.id) {
    return
  }
  const res = await getAppVoByIdUsingGet({
    id: BigInt(props.id) as any
  })
  if (res.data.code === 0 && res.data.data) {
    console.log('获取数据成功',res.data.data)
    oldApp.value = res.data.data
    form.value = res.data.data
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
}
// 导入路由
const router = useRouter()
// 提交
const handleSubmit = async () => {
  let res: any
  if(props.id){// 如果id存在，修改
    res = await editAppUsingPost({
      id: props.id as any,
      ...form.value
    })
  }else{
    // 新增
    res = await addAppUsingPost(form.value)
  }
  if (res.data.code === 0) {
    message.success('应用创建成功，请联系管理员审核')
    router.push('/')
  } else {
    message.error('操作失败，' + res.data.message)
  }
}

watchEffect(()=>{
  loadData()
})
</script>

<template>
  <div id="createApp">
    <a-space direction="vertical" size="small" class="space">
      <h2 style="text-align: center">创建应用</h2>
      <a-form :model="form" layout="vertical" @submit="handleSubmit">
        <a-form-item field="appName" label="应用名称">
          <a-input v-model="form.appName" placeholder="请输入应用名称" />
        </a-form-item>
        <a-form-item field="appDesc" label="应用描述">
          <a-input v-model="form.appDesc" placeholder="请输入应用描述" />
        </a-form-item>
        <a-form-item field="appIcon" label="应用图标">
          <a-input v-model="form.appIcon" placeholder="请输入应用图标地址" />
        </a-form-item>
<!--        <a-form-item field="appIcon" label="应用图标">-->
<!--          <PictureUploader :value="form.appIcon" :onChange="(value) => (form.appIcon = value)" biz="app_icon"/>-->
<!--        </a-form-item>-->
        <a-form-item field="appType" label="应用类型">
          <a-select v-model="form.appType" placeholder="请选择应用类型">
            <a-option v-for="(value, key) in APP_TYPE_MAP" :value="Number(key)" :label="value" />
          </a-select>
        </a-form-item>
        <a-form-item field="scoringStrategy" label="评分策略">
          <a-select v-model="form.scoringStrategy" placeholder="请选择评分策略">
            <a-option
              v-for="(value, key) in APP_SCORING_STRATEGY_MAP"
              :value="Number(key)"
              :label="value"
            />
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" style="width: 100px"> 提交</a-button>
        </a-form-item>
      </a-form>
    </a-space>
  </div>
</template>

<style scoped>
#createApp {
}

.space {
  width: 350px;
  margin-top: 10px;
}
</style>
