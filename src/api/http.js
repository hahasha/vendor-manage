import axios from 'axios'
import QS from 'qs'

const baseUrl = 'http://localhost:3000'
const baseImgUrl = 'http://localhost:3000/static/images'

// 环境的切换
if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = baseUrl
} else if (process.env.NODE_ENV === 'debug') {
  axios.defaults.baseURL = baseUrl
} else if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = baseUrl
}

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get (url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
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
  baseImgUrl,
  baseUrl
}
