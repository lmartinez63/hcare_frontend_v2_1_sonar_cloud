import Vue from 'vue'

// Components
import './components'

// Plugins
import './plugins'

// Sync router with store
import { sync } from 'vuex-router-sync'

// Application imports
import App from './App'
import i18n from '@/i18n'
import router from '@/router'
import store from '@/store'
import Vuelidate from 'vuelidate'
import vuelidateErrorExtractor, { templates } from 'vuelidate-error-extractor'
import Loading from 'vue-loading-overlay'
// Import stylesheet
// import 'vue-loading-overlay/dist/vue-loading.css'

import orderBy from 'lodash.orderby'
import get from 'lodash.get'
// Vue Datetime

import DatetimePicker from 'vuetify-datetime-picker'
import 'vuetify-datetime-picker/src/stylus/main.styl'
/* For ToatUI Calendar
// Toastui calendar
import 'tui-calendar/dist/tui-calendar.css'
import Calendar from '@toast-ui/vue-calendar/src/Calendar.vue'

// If you use the default popups, use this.
import 'tui-date-picker/dist/tui-date-picker.css'
import 'tui-time-picker/dist/tui-time-picker.css'
*/

Vue.use(DatetimePicker)

// Sync store with router
sync(store, router)
const moment = require('moment')

Vue.use(require('vue-moment'), {
  moment
})
Vue.config.productionTip = false
Vue.use(Vuelidate)
Vue.use(vuelidateErrorExtractor, {
  /**
   * Optionally provide the template in the configuration.
   * or register like so Vue.component("FormField", templates.singleErrorExtractor.foundation6)
   */
  template: templates.singleErrorExtractor.foundation6, // you can also pass your own custom template
  messages: { required: 'The {attribute} field is required' } // error messages to use
})

/* eslint-disable no-new */
new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
