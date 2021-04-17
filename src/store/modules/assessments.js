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
  },
  setProp (state, pp) {
    const assessment = state.all.find(a => parseInt(a.id) === parseInt(pp.assId))
    if (assessment) {
      assessment[pp.propModel] = pp.value
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
