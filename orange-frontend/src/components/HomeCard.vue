<script setup lang="ts">
import { IconThumbUp, IconShareInternal, IconMore } from '@arco-design/web-vue/es/icon'
import { useRouter } from 'vue-router'
// vue3结合ts的props写法
interface Props {
  app: API.AppVO
}
const props = withDefaults(defineProps<Props>(), {
  app: () => {
    return {}
  }
})

const router = useRouter()
const doCardClick = () => {
  router.push(`/app/detail/${props.app.id}`)
}
</script>

<template>
  <a-card class="appCard" hoverable @click="doCardClick">
    <template #actions>
      <span class="icon-hover"> <IconThumbUp /> </span>
      <span class="icon-hover"> <IconShareInternal /> </span>
      <span class="icon-hover"> <IconMore /> </span>
    </template>
    <template #cover>
      <div
        :style="{
          height: '200px',
          overflow: 'hidden'
        }"
      >
        <img
          style="height: 200px; transform: translateX(-50px)"
          alt="dessert"
          :src="app.appIcon"
        />
      </div>
    </template>
    <a-card-meta :title="app.appName" :description="app.appDesc">
      <template #avatar>
        <div :style="{ display: 'flex', alignItems: 'center', color: '#1D2129' }">
          <a-avatar :size="24" :image-url="app.user?.userAvatar" :style="{ marginRight: '8px' }">
            空
          </a-avatar>
          <a-typography-text>{{ app.user?.userName ?? '无名' }}</a-typography-text>
        </div>
      </template>
    </a-card-meta>
  </a-card>
</template>

<style scoped>
.appCard{
  cursor: pointer;
}

.icon-hover {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  transition: all 0.1s;
}

.icon-hover:hover {
  background-color: rgb(var(--gray-2));
}
</style>
