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
      storedAssessments: [],
      currentAssessment: {},
      available: false, // true if assessments have been loaded at least once
      isLoading: false,  // true when assessments are being fetched from supabase
      triggerFilterFetch: false,
    }
  ),
  getters: {
    currentPage() {
      return (this.loadedPage===null) ? 1 : this.loadedPage
    },
    pageSize() {
      return supabase.pageSize()
    },
    getAssessments() {
      return this.assessments
    },
    getStoredAssessments() {
      return this.storedAssessments
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

      const filterStore = useFilterStore()
      let filterParam = filterStore.filterParam
      let orderingOption = filterStore.selectedSorting
      
      let {count, data} = await supabase.fetchAssessments(currentPage, filterParam, orderingOption)
      this.count = count
      if(count!==0) {
        this.assessments = data.map( ass => ({... ass, reviewed: this.isReviewed(ass.id)}) )
      } else {
        this.assessments = this.assessments
      }

      this.loadedPage = currentPage;
      this.triggerFilterFetch = false;
      this.available = true;
      this.isLoading = false;
    },
    async loadStoredAssessments(currentPage) {
      this.isLoading = true;

      const reviewsStore = useReviewsStore();
      
      let {count, data} = await supabase.fetchStoredAssessments(currentPage, reviewsStore.allIds)
      if(count!==0) {
        this.storedAssessments = data.map( ass => ({... ass, reviewed: this.isReviewed(ass.id)}) )
      } else {
        this.storedAssessments = []
      }

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