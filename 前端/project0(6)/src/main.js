import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.js'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'

const app=createApp(App)
const pinia = createPinia()
app.use(router)
app.use(pinia)
app.use(ElementPlus,{size:'small',zIndex:3000})
app.mount('#app')
