import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'

//引入pinia
import { createPinia } from 'pinia'

//引入arco-design
import ArcoVue from '@arco-design/web-vue'
import '@arco-design/web-vue/dist/arco.css'

const pinia = createPinia()
const app = createApp(App)

app.use(router).use(ArcoVue).use(pinia).mount('#app')






