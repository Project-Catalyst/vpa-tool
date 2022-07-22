import Vue from 'vue'
import originalAssessments from "@/assets/data/assessments.csv"
import comparisons from "@/utils/comparisons"
import router from '@/router'
import axios from 'axios'

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
  reviewed: {},
  remote: []
})


const state = getDefaultState()

// getters
const getters = {
  getById: (state, _, rootState, rootGetters) => (id) => {
    let indexed = rootGetters['assessments/indexed']
    return (indexed[id]) ? indexed[id] : {}
  },
  getFullById: (state, _, rootState, rootGetters) => (id) => {
    let filteredById = rootGetters['assessments/fullById']
    return filteredById[id]
  },
  indexed: (state) => {
    let result = {}
    state.all.forEach(el => {
      result[el.id] = el
    })
    return result
  },
  fullAssessments: (state) => {
    return originalAssessments.map(item => ({
      ...item,
      ...state.remote[item.id],
      ...state.reviewed[item.id]
    }))
  },
  filteredAssessments: (state, _, rootState, rootGetters) => {
    let filtered = rootGetters['assessments/fullAssessments']
    state.activeFilters.forEach((current) => {
      filtered = filtered.filter((el) => {
        const comparisonFunction = comparisons[current.comparison](current.value, el[current.key], el)
        return current.negative ? !comparisonFunction : comparisonFunction
      })
    })
    return comparisons[state.activePrefilter.v](filtered)
  },
  fullById: (state, _, rootState, rootGetters) => {
    let result = {}
    let filtered = rootGetters['assessments/fullAssessments']
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
  getReviewsCount ({ commit }) {
    axios.get().then((res) => {
      if (res.data) {
        let results = {}
        Object.entries(res.data).forEach(([key, val]) => {
          results[key] = {
            reviews: val
          }
        });
        commit('setRemote', results)
      }
    })
  },
  getNext({ commit, state, getters }) {
    let fAssessments = getters.filteredAssessments
    let next = fAssessments.find((el) => el.id > state.currentIndex)
    if (next) {
      let newId = next.id
      let currentId = false
      if (router.currentRoute.name === 'assessment') {
        currentId = router.currentRoute.params.id
      }
      if (newId !== currentId) {
        router.push({ name: 'assessment', params:{ id: newId }})
      }
      commit('setIndex', newId)
    } else {
      commit('setIndex', 0)
    }
  },
  goTo({ commit }, newId) {
    let currentId = false
    if (router.currentRoute.name === 'assessment') {
      currentId = router.currentRoute.params.id
    }
    if (newId !== currentId) {
      router.push({ name: 'assessment', params:{ id: newId }})
      commit('setIndex', newId)
    }
  }
}

// mutations
const mutations = {
  setAssessments (state, assessments) {
    let filteredImport = assessments.filter((el) => isReviewed(el))
    state.all = filteredImport
  },
  setReviewed (state, assessments) {
    let filteredImport = assessments.filter((el) => isReviewed(el))
    filteredImport.forEach((el) => {
      state.reviewed[el.id] = {
        reviewed: isReviewed(el)
      }
    })
  },
  setRemote (state, assessments) {
    state.remote = assessments
  },
  resetState (state) {
    Object.assign(state, getDefaultState())
  },
  setSingleRemote (state, data) {
    const assessment = {}
    assessment.reviews = data.reviews
    Vue.set(state.remote, data.id, assessment)
  },
  setReview(state, data) {
    const assessmentCb = (res) => {
      if (res.data) {
        this.commit('assessments/setSingleRemote', {
          id: data.id,
          reviews: res.data.reviews,
        })
      }
    }
    const assessmentId = state.all.findIndex(a => parseInt(a.id) === parseInt(data.id));
    if (assessmentId != -1) {
      let assessment = {...state.all[assessmentId]}
      const oldReviewed = isReviewed(assessment)
      assessment.excellent = data.value === 'excellent';
      assessment.good = data.value === 'good';
      assessment.filtered_out = data.value === 'filtered_out';
      const newReviewed = isReviewed(assessment)
      state.reviewed[assessment.id] = {
        reviewed: newReviewed
      }
      Vue.set(state.all, assessmentId, assessment)
      if (newReviewed && !oldReviewed) {
        axios.post(`/${assessment.id}`).then(assessmentCb)
      } else if (!newReviewed && oldReviewed) {
        axios.delete(`/${assessment.id}`).then(assessmentCb)
      }
    } else {
      let assessment = {
        id: data.id,
      }
      assessment.excellent = data.value === 'excellent';
      assessment.good = data.value === 'good';
      assessment.filtered_out = data.value === 'filtered_out';
      state.reviewed[assessment.id] = {
        reviewed: isReviewed(assessment)
      }
      state.all.push(assessment)
      axios.post(`/${assessment.id}`).then(assessmentCb)
    }
  },
  setVcaFeedback(state, data) {
    const assessmentId = state.all.findIndex(a => parseInt(a.id) === parseInt(data.id));
    if (assessmentId != -1) {
      let assessment = {...state.all[assessmentId]}
      assessment.vpa_feedback = data.value;
      Vue.set(state.all, assessmentId, assessment)
    } else {
      state.all.push({
        id: data.id,
        vpa_feedback: data.value
      })
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
