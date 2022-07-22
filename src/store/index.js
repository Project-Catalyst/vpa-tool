import Vue from 'vue'
import Vuex from 'vuex'
import createPersist from 'vuex-localstorage'
import profile from './modules/profile'
import assessments from './modules/assessments'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

let localStorage = createPersist({
    namespace: 'vpa-tool-f9',
    initialState: {},
    expires: 30 * 24 * 60 * 60 * 1e3 // 30 days
})

export default new Vuex.Store({
  modules: {
    profile,
    assessments
  },
  strict: debug,
  plugins: [localStorage]
})
