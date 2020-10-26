import Vue from 'vue'
import App from './App.vue'
import HTTP from './http.js'

Vue.prototype.$http = HTTP

Vue.config.productionTip = false

import Quasar from 'quasar'
Vue.use(Quasar)
import 'quasar/dist/quasar.min.css'

import './assets/init.scss'

new Vue({
  render: h => h(App),
}).$mount('#app')
