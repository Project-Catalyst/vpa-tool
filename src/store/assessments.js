import { defineStore } from 'pinia'
import { useReviewsStore } from './reviews.js';
import supabase from '../api/supabase.js'

const totalAssessments = await (async () => {
  return await supabase.getTotalAssessmentsCount()
})()

export const useAssessmentsStore = defineStore('assessments', {
  state: () => (
    { 
      total: totalAssessments,
      count: totalAssessments, // update when filtering with the count of query
      loadedPage: null,
      assessments: [],
      currentAssessment: {},
      available: false, // true if assessments have been loaded at least once
      isLoading: false  // true when assessments are being fetched from supabase
    }
  ),
  getters: {
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

      if(currentPage !== this.loadedPage) {
        await this.fetchPageAssessments(currentPage)
        this.loadedPage = currentPage
      }

      this.available = true;
      this.isLoading = false;
    },
    async fetchPageAssessments(currentPage) {
      let assessments = await supabase.fetchAssessments(currentPage)
      this.assessments = assessments.map( ass => ({... ass, reviewed: this.isReviewed(ass.id)}) )
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