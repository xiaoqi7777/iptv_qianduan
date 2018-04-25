// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
import axios from 'axios'
import {soft_version} from './version'

Vue.prototype.soft_version = soft_version


Vue.use(ElementUI);
let url = ''
if (process.env.NODE_ENV == 'development') {
  url = 'http://192.168.1.138:3003/api/v1'
}else {
  url = window.location.protocol + '//' + window.location.host + '/api/v1'
}
Vue.prototype.axio = axios.create({
  baseURL: url,
})


// axios拦截器(request)
Vue.prototype.axio.interceptors.request.use(function(config){
  //在请求发出之前进行一些操作
  if(sessionStorage.token) {
    config.headers.Authorization = 'Bearer ' + sessionStorage.token
  }
  return config;
},function(err){
  //Do something with request error
  return Promise.reject(error);
});

Vue.prototype.errLanguage = (res) => {
  return res.data.ret.cn
}

Vue.prototype.axio.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 返回 401 清除token信息并跳转到登录页面
          router.replace({
              path: '/login',
          })
          break;
        case 500:
          vm.$notify({
            type: 'info',
            message: '服务器内部错误'
          })
          break;
        case 404:
          vm.$notify({
            type: 'info',
            message: 'API 404'
          })
          break;
        default:
        break;
      }
    } else {
      vm.$notify({
        type: 'info',
        message: '网络连接部错误'
      })
    }
    return Promise.resolve(error.response);
    // return Promise.reject(error.response.data)   // 返回接口返回的错误信息
  });


Vue.config.productionTip = false

/* eslint-disable no-new */
const vm = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
