const isReviewed = (el) => {
  return el.excellent || el.good || el.not_valid;
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
  setReview(state, data) {
    const assessment = state.all.find(a => parseInt(a.id) === parseInt(data.id));
    if (assessment) {
      assessment.excellent = data.value === 'excellent';
      assessment.good = data.value === 'good';
      assessment.not_valid = data.value === 'not_valid';

      const assessmentCb = (res) => {
        if (res.data) {
          this.commit('assessments/setReviews', {
            id: assessment.id,
            reviews: res.data.reviews
          })
        }
      }

      if (isReviewed(assessment)) {
        this._vm.$http.post(assessment.id).then(assessmentCb)
      } else {
        this._vm.$http.delete(assessment.id).then(assessmentCb)
      }
    }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
