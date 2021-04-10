import Vue from 'vue'
import Vuex from 'vuex'
import createPersist from 'vuex-localstorage'
import profile from './modules/profile'
import assessments from './modules/assessments'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

let localStorage = createPersist({
    namespace: 'vca-tool',
    initialState: {},
    expires: 1.21e+9 // Two Weeks
})

export default new Vuex.Store({
  modules: {
    profile,
    assessments
  },
  strict: debug,
  plugins: [localStorage]
})
