<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { getAppVoByIdUsingGet } from '@/api/appController'
import message from '@arco-design/web-vue/es/message'
import { dayjs } from '@arco-design/web-vue/es/_utils/date'
import { useLoginUserStore } from '@/store/userStore'
import { APP_SCORING_STRATEGY_MAP, APP_TYPE_MAP } from '../../constant/app'

interface Props {
  id: string
}

const props = withDefaults(defineProps<Props>(), {
  id: () => {
    return ''
  }
})

let data = ref<API.AppVO>({})
const router = useRouter()
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
  if (res.data.code === 0) {
    data.value = res.data.data as API.AppVO
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
}

watchEffect(() => {
  loadData()
})
// 获取登录用户id
const loginUserStore = useLoginUserStore()
const loginUserId = loginUserStore.loginUser?.id
// 判断是否为本人创建
const isMyApp = computed(() => {
  // 若不使用computed，loginUserStore可能还未获取到但是isMyApp已经确定了不会重新计算
  return loginUserId && data.value.userId === loginUserId
})
</script>

<template>
  <div id="appDetailView">
    <a-card>
      <a-row style="margin-bottom: 16px">
        <a-col flex="auto" class="content-wrapper">
          <h2>{{ data.appName }}</h2>
          <p>应用描述: {{ data.appDesc }}</p>
          <p>应用类型: {{ APP_TYPE_MAP[data.appType as number] }}</p>
          <p>评分策略: {{ APP_SCORING_STRATEGY_MAP[data.scoringStrategy as number] }}</p>
          <a-space>
            <p>作者:</p>
            <a-avatar :size="24" :image-url="data.user?.userAvatar" :style="{ marginRight: '8px' }">
              空
            </a-avatar>
            <a-typography-text>{{ data.user?.userName ?? '无名' }}</a-typography-text>
          </a-space>
          <p>创建时间: {{ dayjs(data.createTime).format('YYYY-MM-DD HH:mm:ss') }}</p>
        </a-col>
        <a-col flex="320px">
          <a-image width="100%" :src="data.appIcon"></a-image>
        </a-col>
      </a-row>
      <a-space size="large">
        <a-button type="primary" @click="router.push(`/answer/do/${id}`)">开始答题</a-button>
        <a-button v-if="isMyApp" @click="router.push(`/createQuestion/${id}`)">创建题目</a-button>
        <a-button v-if="isMyApp" @click="router.push(`/createScoring/${id}`)">创建评分</a-button>
        <a-button v-if="isMyApp" @click="router.push(`/createApp/${id}`)">编辑应用</a-button>
        <a-button>分享应用</a-button>
      </a-space>
    </a-card>
  </div>
</template>

<style scoped>
#appDetailView {
  min-width: 700px;
}

.content-wrapper > * {
  margin-bottom: 20px;
}

.arco-card-bordered {
  border: none;
}
</style>
