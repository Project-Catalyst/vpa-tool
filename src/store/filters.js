import { defineStore } from 'pinia'
import supabase from '../api/supabase.js'

import filterProposal from '../filter_modules/filter_proposal.js'
import filterChallenge from '../filter_modules/filter_challenge.js'
import filterAssessor from '../filter_modules/filter_assessor.js'
import filterRatings from '../filter_modules/filter_ratings.js'
import filterLength from '../filter_modules/filter_length.js'
import filterFlagged from '../filter_modules/filter_flagged.js'
import filterReviewed from '../filter_modules/filter_reviewed.js'

const filterModules = {
  proposals: filterProposal,
  challenges: filterChallenge,
  assessors: filterAssessor,
  ratings: filterRatings,
  length: filterLength,
  flagged: filterFlagged,
  reviewed: filterReviewed
}

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


export const useFilterStore = defineStore('filters', {
  persist: true,
  state: () => (
    { 
      initialized: false,
      storedFiltersData: {
        proposals: [],
        challenges: [],
        assessors: []
      },
      defaultVmodels: {
        proposals: filterProposal.defaultVmodel(),
        challenges: filterChallenge.defaultVmodel(),
        assessors: filterAssessor.defaultVmodel(),
        ratings: filterRatings.defaultVmodel(),
        length: filterLength.defaultVmodel(),
        flagged: filterFlagged.defaultVmodel(),
        reviewed: filterReviewed.defaultVmodel()
      },
      reactiveVbindings: {
        length: filterLength.defaultVmodel(),
        ratings: filterRatings.defaultVmodel(),
        flagged: filterFlagged.defaultVmodel(),
        reviewed: filterReviewed.defaultVmodel()
      },
      allFilters: {
        proposals: filterProposal.filterTemplate(),
        challenges: filterChallenge.filterTemplate(),
        assessors: filterAssessor.filterTemplate(),
        ratings: filterRatings.filterTemplate(),
        length: filterLength.filterTemplate(),
        flagged: filterFlagged.filterTemplate(),
        reviewed: filterReviewed.filterTemplate()
      },
      activesStatus: {
        proposals: filterProposal.isActive(),
        challenges: filterChallenge.isActive(),
        assessors: filterAssessor.isActive(),
        ratings: filterRatings.isActive(),
        length: filterLength.isActive(),
        flagged: filterFlagged.isActive(),
        reviewed: filterReviewed.isActive()
      }
    }
  ),
  actions: {
    async init() {
      this.storedFiltersData.proposals = await supabase.getProposals()
      this.storedFiltersData.challenges = await supabase.getChallenges()
      this.storedFiltersData.assessors = await supabase.getAssessors()
      this.initialized = true;
    },
    addActiveFilter(filterId, filterOption, mode) {
      this.allFilters[filterId] = filterModules[filterId].getFilter(this.allFilters[filterId], filterOption, mode)
      this.activesStatus[filterId] = filterModules[filterId].isActive(this.allFilters[filterId])
      this.updateReactiveBidings(filterId, filterOption, mode)
      // this.callAssessmentLoad()
    },
    removeActiveFilter(filterId, filterOption) {
      this.allFilters[filterId] = filterModules[filterId].removeFilter(this.allFilters[filterId], filterOption, mode)
      this.activesStatus[filterId] = filterModules[filterId].isActive(this.allFilters[filterId])
      this.updateReactiveBidings(filterId, filterOption)
      // this.callAssessmentLoad()
    },
    updateReactiveBidings(filterId, filterOption, mode=null) {
      if(Object.prototype.hasOwnProperty.call(this.reactiveVbindings, filterId)) {
        if(filterId===keysMap.length) {
          if(mode===null) {
            this.reactiveVbindings[filterId] = filterModules[filterId].defaultVmodel  
          }
          else if(mode===modeMap.min) {
            (filterOption===null)
            ? this.reactiveVbindings[filterId][0] = ''
            : this.reactiveVbindings[filterId][0] = filterOption
          }
          else if(mode===modeMap.max) {
            (filterOption===null)
            ? this.reactiveVbindings[filterId][1] = ''
            : this.reactiveVbindings[filterId][1] = filterOption
          }
        }
        else {
          if(filterOption===null) {
            this.reactiveVbindings[filterId] = filterModules[filterId].defaultVmodel  
          }
          else {
            this.reactiveVbindings[filterId] = filterOption
          }
        }
      }
    },
    resetFilters() {
      this.allFilters = {
        proposals: filterProposal.filterTemplate(),
        challenges: filterChallenge.filterTemplate(),
        assessors: filterAssessor.filterTemplate(),
        ratings: filterRatings.filterTemplate(),
        length: filterLength.filterTemplate(),
        flagged: filterFlagged.filterTemplate(),
        reviewed: filterReviewed.filterTemplate()
      }
      this.activesStatus = {
        proposals: filterProposal.isActive(),
        challenges: filterChallenge.isActive(),
        assessors: filterAssessor.isActive(),
        ratings: filterRatings.isActive(),
        length: filterLength.isActive(),
        flagged: filterFlagged.isActive(),
        reviewed: filterReviewed.isActive()
      }
      this.reactiveVbindings = {
        length: filterLength.defaultVmodel(),
        ratings: filterRatings.defaultVmodel(),
        flagged: filterFlagged.defaultVmodel(),
        reviewed: filterReviewed.defaultVmodel()
      }
      // this.callAssessmentLoad() // default call without filters
    },
    async callAssessmentLoad() {
      console.log('callAssessmentLoad')
      // let supabaseFiltersParam = this.getSupabaseFilterParam()
      // console.log(supabaseFiltersParam)
      // call assessments to call supabase and update assessments
    },
    resetState() {
      this.$reset()
    }
  },
  getters: {
    // Getters to expose building values of filter elements
    proposals() {
      return this.storedFiltersData.proposals
    },
    challenges() {
      return this.storedFiltersData.challenges
    },
    assessors() {
      return this.storedFiltersData.assessors
    },
    lengthOptions() {
      return filterLength.populationValues()
    },
    ratingThresholds() {
      return filterRatings.populationValues()
    },
    reviewedOptions() {
      return filterReviewed.populationValues()
    },
    flaggedOptions() {
      return filterFlagged.populationValues()
    },
    //  Getters to expose status state for condition elements
    hasActiveFilters() {
      return Object.values(this.activesStatus).some(stat => stat===true)
    },    
    isFilterActive: (state) => {
      return (filterId) => state.activesStatus[filterId]
    },
    hasIncludedOptions: (state) => {
      return (filterId) => state.allFilters[filterId].included.length > 0
    },
    getIncludedOptions: (state) => {
      return (filterId) => state.allFilters[filterId].included
    },
    hasExcludedOptions: (state) => {
      return (filterId) => state.allFilters[filterId].excluded.length > 0
    },
    getExcludedOptions: (state) => {
      return (filterId) => state.allFilters[filterId].excluded
    },
    // Map getters
    filtersKeys() {
      return keysMap
    },
    filtersModes() {
      return modeMap
    }
  },
})