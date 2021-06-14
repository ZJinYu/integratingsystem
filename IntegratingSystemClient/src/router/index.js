import Vue from 'vue'
import VueRouter from 'vue-router'
import UserLogin from '@/views/login/login'
import Index from '@/views/home/index'
import Register from '@/views/register/register'
import Order from '@/views/order/order'
import Information from '@/views/userInfo/information'
import Cart from '@/views/cart/cart'
import Detail from "@/views/home/Detail";


Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/login',
      component: UserLogin
    },
    {
      path: '/register',
      component: Register
    },
    {
      path: '/order',
      component: Order
    },
    {
      path: '/index',
      component: Index,
    },
    {
      path: '/cart',
      component: Cart,
    },
    {
      path: '/information',
      component: Information,
    },
    {
      path:'/detail',
      component:Detail,
    }
  ],
  mode: 'history'
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if(to.path === '/inde'||'/register'||'/login') return next()
  const tokenStr = localStorage.getItem('token')
  console.log(tokenStr);
  if(!tokenStr) return  next('/inde')
  next()
})

export default router
