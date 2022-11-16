import { defineStore } from 'pinia'
import supabase from '../api/supabase.js'

// mapping to guarantee consistency: all filters' obj should follow such mapping
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
    filter.value.amx = option[1]
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
    filtersKeys() {
      return keysMap
    },
    filtersModes() {
      return modeMap
    }
  },
  actions: {
    logFilters() {

    },
    addActiveFilter(filterId, filterOption, mode) {
      // check if filter is already included and replace
      // chack if min/max value is already included and just add
      console.log(filterId)
      console.log(filterOption)
      console.log(mode)
      let newFilter = getEncapsulatedFilter(filterOption, mode)
      console.log(newFilter)
    },
    removeActiveFilter(filterId, filterOption) {
      console.log(filterId)
      console.log(filterOption)
    }, 
    async init() {
      await this.populateProposals()
      await this.populateChallenges()
      await this.populateAssessors()
      this.initialized = true;
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