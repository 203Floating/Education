import { createApp } from 'vue'
import { createPinia } from 'pinia'
import utilplug from '@/utils/vue-plug'
import App from './App.vue'
import router from './router'
import '@/assets/main.css'
// 引入element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)
// 使用element-plus
app.use(ElementPlus)
//使用插件
app.use(utilplug)
app.use(createPinia())
app.use(router)

app.mount('#app')
