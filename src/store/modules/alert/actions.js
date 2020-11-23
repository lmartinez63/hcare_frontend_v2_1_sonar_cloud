export default {
  success ({ commit }, message) {
    commit('success', message)
  },
  info ({ commit }, message) {
    commit('info', message)
  },
  warning ({ commit }, message) {
    commit('warning', message)
  },
  error ({ commit }, message) {
    commit('error', message)
  },
  clear ({ commit }, message) {
    commit('clear', message)
  }
}
