import { defineStore } from 'pinia'
import { useReviewsStore } from './reviews.js';
import { useFilterStore } from '../store/filters.js'
import supabase from '../api/supabase.js'

const totalAssessments = await (async () => {
  return await supabase.getTotalAssessmentsCount()
})()

export const useAssessmentsStore = defineStore('assessments', {
  state: () => (
    { 
      total: totalAssessments,
      count: totalAssessments,
      loadedPage: null,
      assessments: [],
      currentAssessment: {},
      available: false, // true if assessments have been loaded at least once
      isLoading: false  // true when assessments are being fetched from supabase
    }
  ),
  getters: {
    currentPage() {
      return (this.loadedPage===null) ? 1 : this.loadedPage
    },
    pageSize() {
      return this.assessments.length
    },
    getAssessments() {
      return this.assessments
    },
    getNextAssessmentId: (state) => {
      return (id) => {
        if(!state.available) {
          return id+1
        } else {
          let index = state.assessments.map(ass => ass.id).indexOf(id);
          return state.assessments[index+1].id
        }
      }
    }
  },
  actions: {
    async loadAssessments(currentPage) {
      this.isLoading = true;
      let filterParam = false;

      const filterStore = useFilterStore()
      if(filterStore.hasActiveFilters) {
        filterParam = filterStore.filterParam
      }
      // if sorting option: should be considered on supabase fetch
      
      let {count, data} = await supabase.fetchAssessments(currentPage, filterParam)
      this.count = count
      this.assessments = data.map( ass => ({... ass, reviewed: this.isReviewed(ass.id)}) )

      this.loadedPage = currentPage
      this.available = true;
      this.isLoading = false;
    },
    async fetchAssessment(id) {
      this.isLoading = true;
      let assessment = await supabase.fetchAssessmentById(id)
      this.currentAssessment = {...assessment, reviewed: this.isReviewed(assessment.id) }
      this.isLoading = false;
    },
    isReviewed(assessmentId) {
      const reviewsStore = useReviewsStore();
      return reviewsStore.isReviewed(assessmentId)
    },
  },
})