import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import  '@/assets/css/global.css'
import '@/assets/font/iconfont.css'
import axios from "axios"

//配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:7001/business'
//请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = "JWT " +localStorage.getItem('token')
  return config
})

Vue.use(ElementUI);
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
