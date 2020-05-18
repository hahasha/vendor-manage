import Vue from 'vue'
import store from '../store'
import VueRouter from 'vue-router'
import Manage from '../pages/manage'
import Login from '../pages/login'
import Category from '../pages/category'
import Theme from '../pages/theme'
import Product from '../pages/product'
import AddCategory from '../pages/addCategory'
import AddTheme from '../pages/addTheme'
import AddProduct from '../pages/addProduct'
import Illustration from '../pages/illustration'
import Home from '../pages/home'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/manage',
    component: Manage,
    meta: {
      requireAuth: true // 表示路由进入要登录
    },
    children: [
      {
        path: '',
        name: 'home',
        component: Home,
        meta: ['首页']
      },
      {
        path: 'category',
        name: 'category',
        component: Category,
        meta: ['分类管理', '分类列表']
      },
      {
        path: 'theme',
        name: 'theme',
        component: Theme,
        meta: ['专题管理', '专题列表']
      },
      {
        path: 'product',
        name: 'product',
        component: Product,
        meta: ['商品管理', '商品列表']
      },
      {
        path: 'addCategory',
        name: 'addCategory',
        component: AddCategory,
        meta: ['分类管理', '添加分类']
      },
      {
        path: 'addTheme',
        name: 'addTheme',
        component: AddTheme,
        meta: ['专题管理', '添加专题']
      },
      {
        path: 'addProduct',
        name: 'addProduct',
        component: AddProduct,
        meta: ['商品管理', '添加商品']
      },
      {
        path: 'illustration',
        name: 'illustration',
        component: Illustration,
        meta: ['说明']
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    beforeEnter: (to, from, next) => {
      const token = store.state.token || localStorage.getItem('token')
      if (token) {
        next({
          path: '/manage'
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
      query: {
        redirect: to.fullPath
      }
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
