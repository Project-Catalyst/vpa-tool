import { filter } from 'lodash'
import { defineStore } from 'pinia'
import supabase from '../api/supabase.js'

// mapping to guarantee consistency: all filters' obj-keys should follow such mapping
const keysMap = { 
  proposals: 'proposals',
  challenges: 'challenges',
  assessors: 'assessors',
  ratings: 'ratings',
  length: 'length',
  flagged: 'flagged',
  reviewed: 'reviewed'
}
// mapping to guarantee consistency
const modeMap = {
  inc: 'inc',
  exc: 'exc',
  min: 'min',
  max: 'max',
  range: 'range',
  val: 'val'
}

const getEmptyFilters = () => {
  return {
    proposals: [],
    challenges: [],
    assessors: [],
    ratings: [],
    length: [],
    flagged: [],
    reviewed: []
  }
}

const getFilterTemplateValue = (mode) => {
  if (mode===modeMap.inc || mode===modeMap.exc) { 
    return {} 
  }
  else if (mode===modeMap.min || mode===modeMap.max || mode===modeMap.range) {
    return {min: null, max: null}
  }
  else if (mode===modeMap.val ) { 
    return ''
  }
}

const getEncapsulatedFilter = (option, mode) => {
  let filter = {
    value: getFilterTemplateValue(mode),
    mode: modeMap[mode]
  }
  if(mode===modeMap.inc || mode===modeMap.exc) {
    filter.value = option
  }
  else if(mode===modeMap.min || mode===modeMap.max) {
    filter.value[mode] = option
  }
  else if(mode===modeMap.range) {
    filter.value.min = option[0]
    filter.value.max = option[1]
  }
  else if (mode===modeMap.val ) { 
    filter.value = option
  }
  return filter
}

export const useFilterStore = defineStore('filters', {
  persist: true,
  state: () => (
    { 
      initialized: false,
      populationValues: {
        proposals: [],
        challenges: [],
        assessors: [],
        ratings: {min: 0, max: 5},
        length: [500, 750, 1000, 1250, 1500],
        flagged: ['Flagged', 'Not flagged', 'All'],
        reviewed: ['Reviewed', 'Not reviewed', 'All']
      },
      activeFilters: getEmptyFilters(),
    }
  ),
  getters: {
    getFilterPopulation: (state) => {
      return (filterId) => state.populationValues[filterId]
    },
    hasActiveFilters() {
      return Object.values(this.activeFilters).map(f=>f.length).reduce((partialSum, val) => partialSum + val, 0) > 0
    },
    isFilterActive: (state) => {
      return (filterId) => state.activeFilters[filterId].length > 0
    },
    hasIncludedOptions: (state) => {
      return (filterId) => state.activeFilters[filterId].filter(f => f.mode===modeMap.inc).length > 0
    },
    getIncludedOptions: (state) => {
      return (filterId) => state.activeFilters[filterId].filter(f => f.mode===modeMap.inc).map(f => f.value)
    },
    hasExcludedOptions: (state) => {
      return (filterId) => state.activeFilters[filterId].filter(f => f.mode===modeMap.exc).length > 0
    },
    getExcludedOptions: (state) => {
      return (filterId) => state.activeFilters[filterId].filter(f => f.mode===modeMap.exc).map(f => f.value)
    },
    getActiveRatings() {
      return (this.isFilterActive(keysMap.ratings))
      ? [this.activeFilters[keysMap.ratings][0].value.min, this.activeFilters[keysMap.ratings][0].value.max]
      : [this.populationValues[keysMap.ratings].min, this.populationValues[keysMap.ratings].max]
    },
    getActiveLength() {
      return (this.isFilterActive(keysMap.length))
      ? this.activeFilters[keysMap.length][0].value
      : {min: null, max: null}
    },
    getActiveFlagged() {
      return (this.isFilterActive(keysMap.flagged))
      ? this.activeFilters[keysMap.flagged][0].value
      : 'All'
    },
    getActiveReviewed() {
      return (this.isFilterActive(keysMap.reviewed))
      ? this.activeFilters[keysMap.reviewed][0].value
      : 'All'
    },
    filtersKeys() {
      return keysMap
    },
    filtersModes() {
      return modeMap
    }
  },
  actions: {
    logFilters() {
      console.log(this.activeFilters)
    },
    async init() {
      await this.populateProposals()
      await this.populateChallenges()
      await this.populateAssessors()
      this.initialized = true;
    },
    removeActiveFilter(filterId, filterOption) {
      console.log(filterId)
      console.log(filterOption)
      // this.callAssessmentLoad()
    }, 
    addActiveFilter(filterId, filterOption, mode) {

      if(!this.isFilterActive(filterId)) {
        this.pushNewFilter(filterId, filterOption, mode)
      }
      else {
        if(mode===modeMap.inc || mode===modeMap.exc) {
          this.manageIncExcFilter(filterId, filterOption, mode)
        }
        else if(mode===modeMap.min || mode===modeMap.max || mode===modeMap.range) {
          this.manageMinMaxFilter(filterId, filterOption, mode)
        }
        else if (mode===modeMap.val ) { 
          this.manageValFilter(filterId, filterOption, mode)
        }
      }
      // console.log(this.activeFilters)
      // this.callAssessmentLoad()
    },
    manageIncExcFilter(filterId, filterOption, mode) {
      let optionIndex = this.activeFilters[filterId].map( f => f.value.id).indexOf(filterOption.id)
      if(optionIndex===-1) {
        this.pushNewFilter(filterId, filterOption, mode)
      }
      else if(this.activeFilters[filterId][optionIndex].mode!==mode) {
        this.activeFilters[filterId][optionIndex].value = filterOption
        this.activeFilters[filterId][optionIndex].mode = mode
        // set assessments update flag to true
      }
    },
    manageMinMaxFilter(filterId, filterOption, mode) {
      let filterEncap = this.activeFilters[filterId][0]
      if(mode===modeMap.min && filterEncap.value[mode]!==filterOption) {
        filterEncap.value.min = filterOption
        filterEncap.mode = mode
        // set assessments update flag to true
      }
      else if(mode===modeMap.max && filterEncap.value[mode]!==filterOption) {
        filterEncap.value.max = filterOption
        filterEncap.mode = mode
        // set assessments update flag to true
      }
      else if(mode===modeMap.range && !(filterEncap.value.min===filterOption[0] && filterEncap.value.max===filterOption[1]) ) {
        filterEncap.value.min = filterOption[0]
        filterEncap.value.max = filterOption[1]
        filterEncap.mode = mode
        // set assessments update flag to true
      }
    },
    manageValFilter(filterId, filterOption, mode) {
      if(this.activeFilters[filterId][0].value!==filterOption) {
        this.activeFilters[filterId][0].value = filterOption
        // set assessments update flag to true  
      }
    },
    pushNewFilter(filterId, filterOption, mode) {
      let newFilter = getEncapsulatedFilter(filterOption, mode)
      this.activeFilters[filterId].push(newFilter)
      // set assessments update flag to true
    },
    async populateProposals() {
      this.populationValues.proposals = await supabase.getProposals();
    },
    async populateChallenges() {
      this.populationValues.challenges = await supabase.getChallenges();
    },
    async populateAssessors() {
      this.populationValues.assessors = await supabase.getAssessors();
    },
    async callAssessmentLoad() {
      console.log('callAssessmentLoad')
      // set assessments update flag to false
    },
    resetFilters() {
      console.log('resetFilters')
      this.activeFilters = getEmptyFilters()
      // call assessments loading 
    },
    resetState() {
      this.$reset()
    }
  }
})