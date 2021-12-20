import Vue from 'vue'
import originalAssessments from "@/assets/data/assessments.csv"
import comparisons from "@/utils/comparisons"
import router from '@/router'

const isReviewed = (el) => {
  return el.excellent || el.good || el.filtered_out;
}

// initial state
const getDefaultState = () => ({
  all: [],
  activeFilters: [],
  activePrefilter: {label: "All", v: 'std'},
  currentIndex: 0,
  currentSlice: 100,
  listVisible: false,
  reviewed: []
})


const state = getDefaultState()

// getters
const getters = {
  getById: (state, _, rootState, rootGetters) => (id) => {
    let indexed = rootGetters['assessments/indexed']
    return (indexed[id]) ? indexed[id] : {}
  },
  getFullById: (state, _, rootState, rootGetters) => (id) => {
    let filteredById = rootGetters['assessments/filteredById']
    return filteredById[id]
  },
  indexed: (state) => {
    let result = {}
    state.all.forEach(el => {
      result[el.id] = el
    })
    return result
  },
  fullAssessments: () => {
    return originalAssessments.filter(
      (el) => (!el.blank)
    );
  },
  filteredAssessments: (state, _, rootState, rootGetters) => {
    let filtered = rootGetters['assessments/fullAssessments']
    state.activeFilters.forEach((current) => {
      filtered = filtered.filter((el) =>
        comparisons[current.comparison](current.value, el[current.key], el)
      )
    })
    return comparisons[state.activePrefilter.v](filtered)
  },
  filteredById: (state, _, rootState, rootGetters) => {
    let result = {}
    let filtered = rootGetters['assessments/filteredAssessments']
    filtered.forEach(el => {
      result[el.id] = el
    })
    return result
  },
  renderedList: (state, _, rootState, rootGetters) => {
    return rootGetters['assessments/filteredAssessments'].slice(0, state.currentSlice)
  },
  filteredCount: (state, _, rootState, rootGetters) => {
    return rootGetters['assessments/filteredAssessments'].length
  },
  fullCount: (state, _, rootState, rootGetters) => {
    return rootGetters['assessments/fullAssessments'].length
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
  getNext({ commit, state, getters }) {
    let fAssessments = getters.filteredAssessments
    if (fAssessments[state.currentIndex]) {
      let newId = fAssessments[state.currentIndex].id
      let currentId = false
      if (router.currentRoute.name === 'assessment') {
        currentId = router.currentRoute.params.id
      }
      if (newId !== currentId) {
        router.push({ name: 'assessment', params:{ id: newId }})
      }
      commit('incrementIndex')
    } else {
      commit('setIndex', 0)
    }
  },
  goTo({ commit }, {newId, newIdx}) {
    let currentId = false
    if (router.currentRoute.name === 'assessment') {
      currentId = router.currentRoute.params.id
    }
    if (newId !== currentId) {
      router.push({ name: 'assessment', params:{ id: newId }})
      commit('setIndex', newIdx)
    }
  }
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
    //const assessment = state.all.find(a => parseInt(a.id) === parseInt(data.id))
    const assessment = state.indexed[data.id]
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
      assessment.filtered_out = data.value === 'filtered_out';
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
  addFilter(state, {prop, value}) {
    const newFilter = Object.assign({}, prop);
    newFilter.value = value;
    state.activeFilters.push(newFilter);
  },
  setPrefilter(state, newPrefilter) {
    state.activePrefilter = newPrefilter
  },
  removeFilter(state, f) {
    const idx = state.activeFilters.indexOf(f);
    if (idx > -1) {
      state.activeFilters.splice(idx, 1);
    }
  },
  setIndex(state, index) {
    state.currentIndex = index
  },
  setSlice(state, slice) {
    state.currentSlice = slice
  },
  incrementIndex(state) {
    state.currentIndex = state.currentIndex + 1
  },
  incrementSlice(state) {
    state.currentSlice = state.currentSlice + 100
  },
  toggleList(state) {
    state.listVisible = !state.listVisible
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
