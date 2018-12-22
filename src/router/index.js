import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Hello from '@/components/HelloWorld'
import Device from '@/components/pages/Device'
import Channel from '@/components/pages/Channel'
import Dibbling from '@/components/pages/Dibbling'
import Configuration from '@/components/pages/Configuration'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      children: [
        {
          path: '/device',
          name: 'device',
          component: Device,
          meta: {
            title: '设备管理'
          }
        },
        {
          path: '/configuration',
          name: 'configuration',
          component: Configuration,
          meta: {
            title: '模板管理'
          }
        },
        {
          path: '/channel/:id/:serial_number',
          name: 'channel',
          hidden: true,
          component: Channel
        },
        {
          path: '/dibbling/:id',
          name: 'dibbling',
          hidden: true,
          component: Dibbling
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/hello',
      name: 'Hello',
      component: Hello
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    sessionStorage.removeItem('user_name');
    sessionStorage.removeItem('token');
  }
  next()
});



export default router