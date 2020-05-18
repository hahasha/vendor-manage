import * as types from './mutation-types'

const mutations = {
  [types.SET_TOKEN] (state, token) {
    state.token = token
    localStorage.setItem('token', token)
  }
}

export default mutations
