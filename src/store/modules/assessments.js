import criteria from '@/assets/data/criteria.json'
const activeCriteria = criteria.map((c) => c.key)

const isReviewed = (el) => {
  return activeCriteria.some((c) => el[c])
}

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
  getReviewsCount ({ state, commit }) {
    const assessments = state.all
    this._vm.$http.get().then((res) => {
      if (res.data) {
        Object.entries(res.data).forEach(([key, val]) => {
          const assessment = assessments.find(a => parseInt(a.id) === parseInt(key))
          if (assessment) {
            assessment.reviews = val
          }
        });
        commit('setAssessments', assessments)
      }
    })
  },
}

// mutations
const mutations = {
  setAssessments (state, assessments) {
    state.all = assessments
  },
  resetState (state) {
    Object.assign(state, getDefaultState())
  },
  setReviews (state, data) {
    const assessment = state.all.find(a => parseInt(a.id) === parseInt(data.id))
    if (assessment) {
      assessment.reviews = data.reviews
    }
  },
  setProp (state, pp) {
    const assessment = state.all.find(a => parseInt(a.id) === parseInt(pp.assId))
    if (assessment) {
      const initialState = isReviewed(assessment)
      assessment[pp.propModel] = pp.value
      const finalState = isReviewed(assessment)
      if (initialState !== finalState) {
        const assessmentCb = (res) => {
          if (res.data) {
            this.commit('assessments/setReviews', {
              id: assessment.id,
              reviews: res.data.reviews
            })
          }
        }
        if (finalState) {
          this._vm.$http.post(assessment.id).then(assessmentCb)
        } else {
          this._vm.$http.delete(assessment.id).then(assessmentCb)
        }
      }
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
