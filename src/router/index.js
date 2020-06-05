import Vue from 'vue'
import store from '../store'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/pages/manage'),
    children: [
      {
        path: '/',
        name: 'home',
        component: () => import('@/pages/home'),
        meta: {
          title: ['首页'],
          requireAuth: true // 进入首页需验证
        }
      },
      {
        path: 'category',
        name: 'category',
        component: () => import('@/pages/category'),
        meta: {
          title: ['分类管理', '分类列表']
        }
      },
      {
        path: 'theme',
        name: 'theme',
        component: () => import('@/pages/theme'),
        meta: {
          title: ['专题管理', '专题列表']
        }
      },
      {
        path: 'product',
        name: 'product',
        component: () => import('@/pages/product'),
        meta: {
          title: ['商品管理', '商品列表']
        }
      },
      {
        path: 'addCategory',
        name: 'addCategory',
        component: () => import('@/pages/addCategory'),
        meta: {
          title: ['分类管理', '添加分类']
        }
      },
      {
        path: 'addTheme',
        name: 'addTheme',
        component: () => import('@/pages/addTheme'),
        meta: {
          title: ['专题管理', '添加专题']
        }
      },
      {
        path: 'addProduct',
        name: 'addProduct',
        component: () => import('@/pages/addProduct'),
        meta: {
          title: ['商品管理', '添加商品']
        }
      },
      {
        path: 'illustration',
        name: 'illustration',
        component: () => import('@/pages/illustration'),
        meta: {
          title: ['说明']
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login'),
    beforeEnter: (to, from, next) => {
      const token = store.state.token || localStorage.getItem('token')
      if (token) {
        next({
          path: '/'
        })
      } else {
        next()
      }
    }
  }
]

const router = new VueRouter({
  routes
})

// router gards
router.beforeEach((to, from, next) => {
  const token = store.state.token || localStorage.getItem('token')
  if (to.meta.requireAuth && !token) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
})

// 屏蔽NavigationDuplicated报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router
