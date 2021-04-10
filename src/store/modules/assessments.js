// initial state
const state = () => ({
  all: []
})

// getters
const getters = {}

// actions
const actions = {
}

// mutations
const mutations = {
  setAssessments (state, assessments) {
    state.all = assessments
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
