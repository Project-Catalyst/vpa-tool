import Vue from 'vue'

const isReviewed = (el) => {
  return el.excellent || el.good || el.not_valid;
}

// initial state
const getDefaultState = () => ({
  all: [],
  indexed: {}
})


const state = getDefaultState()

// getters
const getters = {
  getById: (state) => (id) => {
    return state.indexed[id]
    // return state.all.find(assessment => assessment.id === id)
  }
}

// actions
const actions = {
  getReviewsCount ({ state, commit }) {
    const assessments = JSON.parse(JSON.stringify(state.all))
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
    this.commit('assessments/setIndexed', assessments)
  },
  setIndexed (state, assessments) {
    let result = {}
    assessments.forEach(el => {

      result[el.id] = el
    })
    state.indexed = result
  },
  resetState (state) {
    Object.assign(state, getDefaultState())
  },
  setReviews (state, data) {
    const assessment = state.all.find(a => parseInt(a.id) === parseInt(data.id))
    if (assessment) {
      assessment.reviews = data.reviews
      Vue.set(state.indexed, assessment.id, assessment)
    }
  },
  setReview(state, data) {
    const assessment = state.all.find(a => parseInt(a.id) === parseInt(data.id));
    if (assessment) {
      const oldReviewed = isReviewed(assessment)
      assessment.excellent = data.value === 'excellent';
      assessment.good = data.value === 'good';
      assessment.not_valid = data.value === 'not_valid';
      const newReviewed = isReviewed(assessment)

      const assessmentCb = (res) => {
        if (res.data) {
          this.commit('assessments/setReviews', {
            id: assessment.id,
            reviews: res.data.reviews,
          })
        }
      }

      if (newReviewed && !oldReviewed) {
        this._vm.$http.post(`/${assessment.id}`).then(assessmentCb)
      } else if (!newReviewed && oldReviewed) {
        this._vm.$http.delete(`/${assessment.id}`).then(assessmentCb)
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
