import { router } from '../../../router'

export default {
  success (state, message) {
    state.type = 'success'
    state.message = message
    state.display = true
  },
  info (state, message) {
    state.type = 'info'
    state.message = message
    state.display = true
  },
  warning (state, message) {
    state.type = 'warning'
    state.message = message
    state.display = true
  },
  error (state, message) {
    state.type = 'error'
    state.message = message
    // v-alert won't be display instead a v-dialog in App.vue which allow to return to other page informing the user that there was an error
    state.display = false
  },
  clear (state) {
    state.type = null
    state.icon = null
    state.color = null
    state.message = null
    state.display = false
  }
}
