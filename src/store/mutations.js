import * as types from './mutation-types'

const mutations = {
  [types.SET_TOKEN] (state, token) {
    if (token) {
      state.token = token
      localStorage.setItem('token', token)
    } else {
      state.token = null
      localStorage.removeItem('token')
    }
  }
}

export default mutations
