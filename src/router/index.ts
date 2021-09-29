import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    // route level code-splitting
    // this generates a separate chunk (home.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/home/index.vue'),
    meta: {
      title: '首页',
      showTab: true,
      keepAlive: true
    }
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('../views/user/index.vue'),
    meta: {
      title: '个人中心',
      showTab: true
    }
  },
  // 404
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
