// initial state
const getDefaultState = () => ({
  all: []
})

const state = getDefaultState()

// getters
const getters = {
  getById: (state) => (id) => {
    return state.all.find(assessment => assessment.id === id)
  }
}

// actions
const actions = {
}

// mutations
const mutations = {
  setAssessments (state, assessments) {
    state.all = assessments
  },
  resetState (state) {
    Object.assign(state, getDefaultState())
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
