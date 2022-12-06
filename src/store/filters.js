import { defineStore } from 'pinia'
import { useReviewsStore } from '../store/reviews.js'
import { useAssessmentsStore } from '../store/assessments.js';
import supabase from '../api/supabase.js'

import filterProposal from '../filter_modules/filter_proposal.js'
import filterChallenge from '../filter_modules/filter_challenge.js'
import filterAssessor from '../filter_modules/filter_assessor.js'
import filterRatings from '../filter_modules/filter_ratings.js'
import filterLength from '../filter_modules/filter_length.js'
import filterFlagged from '../filter_modules/filter_flagged.js'
import filterReviewed from '../filter_modules/filter_reviewed.js'
import filterStoredReviews from '../filter_modules/filter_storedreviews.js'

const filterModules = {
  proposals: filterProposal,
  challenges: filterChallenge,
  assessors: filterAssessor,
  ratings: filterRatings,
  length: filterLength,
  flagged: filterFlagged,
  reviewed: filterReviewed,
  stored: filterStoredReviews,
}

// mapping to guarantee consistency: obj-keys should follow such mapping
const keysMap = { 
  proposals: 'proposals',
  challenges: 'challenges',
  assessors: 'assessors',
  ratings: 'ratings',
  length: 'length',
  flagged: 'flagged',
  reviewed: 'reviewed',
  reviewedRange: 'reviewedRange',
  stored: 'stored'
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

const sortingVmodels = {
  default: '',
  minRate: 'Least rated',
  maxRate: 'Most rated',
  minReview: 'Least reviewed',
  maxReview: 'Most reviewed', 
  random: 'Randomize'
}

const getFilterParamTemplate = () => {
  return {
    storedAssessments: null,
    proposalsIncluded: null,
    proposalsExcluded: null,
    challengesIncluded: null,
    challengesExcluded: null,
    assessorsIncluded: null,
    assessorsExcluded: null,
    ratingMin: null,
    ratingMax: null,
    lengthMin: null,
    lengthMax: null,
    flagged: null,
    reviewed: null,
    reviewedMin: null,
    reviewedMax: null
  }
}

const getDefaultVbindings = () => {
  return {
    proposals: filterProposal.defaultVmodel(),
    challenges: filterChallenge.defaultVmodel(),
    assessors: filterAssessor.defaultVmodel(),
    ratings: filterRatings.defaultVmodel(),
    length: filterLength.defaultVmodel(),
    flagged: filterFlagged.defaultVmodel(),
    reviewed: filterReviewed.defaultVmodel(),
    reviewedRange: filterReviewed.defaultRangeVmodel(),
    stored: filterStoredReviews.defaultVmodel()
  }
}

const getDefaultReactiveVbindings = () => {
  return {
    length: filterLength.defaultVmodel(),
    ratings: filterRatings.defaultVmodel(),
    flagged: filterFlagged.defaultVmodel(),
    reviewed: filterReviewed.defaultVmodel(),
    reviewedRange: filterReviewed.defaultRangeVmodel(),
    stored: filterStoredReviews.defaultVmodel()
  }
}

const getDefaultAllFilters = () => {
  return {
    proposals: filterProposal.filterTemplate(),
    challenges: filterChallenge.filterTemplate(),
    assessors: filterAssessor.filterTemplate(),
    ratings: filterRatings.filterTemplate(),
    length: filterLength.filterTemplate(),
    flagged: filterFlagged.filterTemplate(),
    reviewed: filterReviewed.filterTemplate(),
    stored: filterStoredReviews.filterTemplate()
  }
}

const getDefaultActiveStatus = () => {
  return {
    proposals: filterProposal.isActive(),
    challenges: filterChallenge.isActive(),
    assessors: filterAssessor.isActive(),
    ratings: filterRatings.isActive(),
    length: filterLength.isActive(),
    flagged: filterFlagged.isActive(),
    reviewed: filterReviewed.isActive(),
    stored: filterStoredReviews.isActive()
  }
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
      defaultVmodels: getDefaultVbindings(),
      reactiveVbindings: getDefaultReactiveVbindings(),
      allFilters: getDefaultAllFilters(),
      activesStatus: getDefaultActiveStatus(),
      supabaseParam: getFilterParamTemplate(),
      selectedSorting: sortingVmodels.default,
    }
  ),
  actions: {
    logFilters() {
      console.log(this.allFilters)
      console.log(this.supabaseParam)
      console.log(this.selectedSorting)
    },
    async triggerAssessmentsLoad() {
      const assessmentsStore = useAssessmentsStore();
      assessmentsStore.triggerFilterFetch = true
    },
    async init() {
      this.storedFiltersData.proposals = await supabase.getProposals()
      this.storedFiltersData.challenges = await supabase.getChallenges()
      this.storedFiltersData.assessors = await supabase.getAssessors()
      this.initialized = true;
    },
    resetFilters() {
      this.reactiveVbindings = getDefaultReactiveVbindings()
      this.allFilters = getDefaultAllFilters()
      this.activesStatus = getDefaultActiveStatus()
      this.supabaseParam = getFilterParamTemplate()
      this.triggerAssessmentsLoad()
    },
    addActiveFilter(filterId, filterOption, mode) {
      this.allFilters[filterId] = filterModules[filterId].getFilter(this.allFilters[filterId], filterOption, mode)
      this.activesStatus[filterId] = filterModules[filterId].isActive(this.allFilters[filterId])
      this.updateSupabaseParam(filterId)
      this.updateReactiveBidings(filterId, filterOption, mode)
      this.triggerAssessmentsLoad()
    },
    removeActiveFilter(filterId, filterOption, mode) {
      this.allFilters[filterId] = filterModules[filterId].removeFilter(this.allFilters[filterId], filterOption, mode)
      this.activesStatus[filterId] = filterModules[filterId].isActive(this.allFilters[filterId])
      this.updateSupabaseParam(filterId)
      this.updateReactiveBidings(filterId, filterOption)
      this.triggerAssessmentsLoad()
    },
    updateSupabaseParam(filterId) {
      if(filterId === keysMap.stored) {
        const reviewStore = useReviewsStore();
        if(reviewStore.hasReviews) {
          this.supabaseParam.storedAssessments = reviewStore.allIds
        } else {
          this.supabaseParam.storedAssessments = null
        }
      } else {
        this.supabaseParam = filterModules[filterId].updateParam(this.allFilters[filterId], this.supabaseParam)
      }
    },
    updateReactiveBidings(filterId, filterOption, mode=null) {
      if(filterId===keysMap.reviewed && mode===modeMap.range) {
        filterId = keysMap.reviewedRange
      }
      if(Object.prototype.hasOwnProperty.call(this.reactiveVbindings, filterId)) {
        if(filterId===keysMap.length) {
          if(mode===null) {
            this.reactiveVbindings[filterId] = filterModules[filterId].defaultVmodel()
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
        else if(filterId===keysMap.reviewedRange) {
          this.reactiveVbindings[filterId] = filterOption
        }
        else if(filterId===keysMap.reviewed && filterOption===null) {
          this.reactiveVbindings[filterId] = filterModules[filterId].defaultVmodel()
          this.reactiveVbindings[keysMap.reviewedRange] = filterModules[filterId].defaultRangeVmodel() 
        }
        else {
          if(filterOption===null) {
            this.reactiveVbindings[filterId] = filterModules[filterId].defaultVmodel()
          }
          else {
            this.reactiveVbindings[filterId] = filterOption
          }
        }
      }
    },
    setSorting(sortingKey) {
      this.selectedSorting = sortingKey[0]
      this.triggerAssessmentsLoad()
    },
    resetState() {
      this.$reset()
    }
  },
  getters: {
    filterParam() {
      return (this.hasActiveFilters) ? this.supabaseParam : false
    },
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
    lengthMinOptions() {
      return filterLength.populationValuesMin()
    },
    lengthMaxOptions() {
      return filterLength.populationValuesMax()
    },
    ratingThresholds() {
      return filterRatings.populationValues()
    },
    reviewedOptions() {
      return filterReviewed.populationValues()
    },
    reviewedThresholds() {
      return filterReviewed.thresholdValues()
    },
    flaggedOptions() {
      return filterFlagged.populationValues()
    },
    sortingOptions() {
      return Object.entries(sortingVmodels)
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
    hasReviewedRangeActive() {
      return this.allFilters[keysMap.reviewed].activeRange
    },
    getReviewedRange() {
      return this.allFilters[keysMap.reviewed].range
    },
    getReviewedValue() {
      return filterReviewed.positiveValue()
    },
    selectedSortingVmodel() {
      return sortingVmodels[this.selectedSorting]
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