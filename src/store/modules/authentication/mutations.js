export default {
  loginRequest (state, user) {
    console.log('authentication - mutations - loginRequest')
    state.loading = true
    state.status = { loggingIn: true }
    state.user = user
  },
  loginSuccess (state, user) {
    console.log('authentication - mutations - loginSuccess')
    state.loading = false
    state.status = { loggedIn: true }
    state.user = user
  },
  loginFailure (state) {
    console.log('authentication - mutations - loginFailure')
    state.loading = false
    state.status = {}
    state.user = null
  },
  logout (state) {
    state.loading = false
    state.status = {}
    state.user = null
  }
}
