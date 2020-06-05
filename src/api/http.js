import axios from 'axios'
import QS from 'qs'
import router from '../router'
import store from '../store'
import { Message } from 'element-ui'
import { showLoading, hideLoading } from '@/common/js/loading'

let baseImgUrl = ''

// 环境的切换
if (process.env.NODE_ENV === 'development') { // 开发环境
  axios.defaults.baseURL = 'http://localhost:3000'
  baseImgUrl = 'http://localhost:3000/images'
} else if (process.env.NODE_ENV === 'production') { // 生产环境
  axios.defaults.baseURL = 'http://www.liusha.ltd/api'
  baseImgUrl = 'http://www.liusha.ltd/api/images'
} else if (process.env.NODE_ENV === 'debug') {
  axios.defaults.baseURL = ''
}

// 跳转登录页
const toLogin = () => {
  router.replace({
    path: '/login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

// 统一异常处理
const errorHandle = (status, other) => {
  switch (status) {
    case 401: // 未登录
      toLogin()
      Message.error('请登录')
      break
    case 402: // 登录信息过期
      Message.error('登录已过期，请重新登录')
      localStorage.removeItem('token')
      store.commit('SET_TOKEN', null)
      setTimeout(() => {
        toLogin()
      }, 1500)
      break
    case 403: // 没有权限
      Message.error('权限不足')
      break
    case 404: // 请求不存在
      Message.error('请求不存在')
      break
    /**
     * 其他错误直接抛出错误提示
     */
    default:
      console.log(other)
  }
}

// 设置post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

// 请求拦截
axios.interceptors.request.use(
  config => {
    showLoading()
    const token = store.state.token || localStorage.getItem('token')
    token && (config.headers.Authorization = token)
    return config
  },
  error => {
    return Promise.resolve(error)
  }
)

// 响应拦截
axios.interceptors.response.use(
  res => {
    hideLoading()
    if (res.status === 200) {
      return Promise.resolve(res)
    } else {
      return Promise.reject(res)
    }
  },
  error => {
    hideLoading()
    const response = error.response
    if (response) {
      errorHandle(response.status, response.data.msg)
      return Promise.resolve(response)
    }
  }
)
/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get (url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params
    })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}
/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post (url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, QS.stringify(params))
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

export function postForm (url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

export {
  baseImgUrl
}
