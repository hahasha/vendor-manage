import { Loading } from 'element-ui'

let loadingInstance
let loadingInstanceCount = 0 // loading实例个数
const initLoading = () => {
  loadingInstance = Loading.service({
    spinner: 'el-icon-loading',
    target: 'main'
  })
}

const closeLoading = () => {
  loadingInstance.close()
}

export const showLoading = () => {
  if (loadingInstanceCount === 0) {
    initLoading()
  }
  loadingInstanceCount += 1
}

export const hideLoading = () => {
  if (loadingInstanceCount > 0) {
    loadingInstanceCount -= 1
  }
  if (loadingInstanceCount === 0) {
    closeLoading()
  }
}
