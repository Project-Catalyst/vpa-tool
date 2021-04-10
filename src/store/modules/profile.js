// initial state
const state = () => ({
  initialized: false,
  localDb: false,
  info: {
    name: '',
    email: ''
  }
})

// getters
const getters = {}

// actions
const actions = {
}

const checkInitialized = state => (state.info.name !== '') && (state.info.email !== '')

// mutations
const mutations = {
  setName (state, name) {
    state.info.name = name
    state.initialized = checkInitialized(state)
  },
  setEmail (state, email) {
    state.info.email = email
    state.initialized = checkInitialized(state)
  },
  setLocalDb (state, localDb) {
    state.localDb = localDb
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
