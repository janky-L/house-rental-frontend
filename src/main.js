import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { pinia } from './store'
import ElementPlus from 'element-plus'
import * as ElementPlusLocale from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'

createApp(App)
  .use(router)
  .use(pinia)
  .use(ElementPlus, {locale: ElementPlusLocale.default})
  .mount('#app')
