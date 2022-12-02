import { defineStore } from 'pinia'
import { useAssessmentsStore } from './assessments.js';
import supabase from '../api/supabase.js'

const reviewMap = {
  0: 'filteredout',
  1: 'good',
  2: 'excellent'
}

function getReviewCode(value) {
  return Object.keys(reviewMap).find(key => reviewMap[key] === value);
}
function getReviewValue(code) {
  return reviewMap[code]
}

export const useReviewsStore = defineStore('reviews', {
  persist: true,
  state: () => (
    { 
      initialized: false,
      file: "",
      reviews: [],
      isLoading: false  // true when the store is updating some property
    }
  ),
  getters: {
    isInitialized () {
      return (this.file !== '')
    },
    count() {
      return this.reviews.length
    },
    hasReviews() {
      return this.reviews.length > 0
    },
    allIds() {
      return this.reviews.map(r => r.id)
    },
    isReviewed: (state) => {
      return (id) => state.reviews.map(r=> r.id).includes(id)
    },
    getReview: (state) => {
      return (id) => state.reviews.filter(r => r.id===id).map(r => {
        let rFormat = {...r}
        rFormat.review = getReviewValue(r.review)
        return rFormat
      })[0]
    },
    getReviewIndex: (state) => {
      return (id) => state.reviews.map(r => r.id).findIndex( (el) => el===id)
    }
  },
  actions: {
    init(file) {
      this.file = file
      this.initialized = this.isInitialized
    },
    async updateAssessment(id) {
      const assessmentsStore = useAssessmentsStore();
      await assessmentsStore.fetchAssessment(id)
    },
    async setReview(id, review) {
      if( !this.isReviewed(id) ) {
        await this.addReview(id, review)
      } else {
        this.updateReview(id, review)
      }
    },
    async addReview(id, review) {
      this.reviews.push({
        id: id,
        review: getReviewCode(review),
        rationale: ''
      })
      await supabase.addReview(id)
      await this.updateAssessment(id)
    },
    async removeReview(id) {
      this.isLoading = true;
      let index = this.getReviewIndex(id)
      this.reviews.splice(index, 1)
      await supabase.removeReview(id)
      await this.updateAssessment(id)
      this.isLoading = false;
    },
    async removeAllReviews() {
      this.reviews.forEach( async (r) => {
        await supabase.removeReview(r.id)
      })
    },
    updateReview(id, review) {
      let index = this.getReviewIndex(id)
      this.reviews[index].review = getReviewCode(review)
    },
    updateRationale(id, rationale) {
      this.isLoading = true;
      let index = this.getReviewIndex(id)
      this.reviews[index].rationale = rationale
      this.isLoading = false;
    },
    async assureReviewingConsistency() {
      if(this.hasReviews) {
        let reviewedAss = await supabase.getAssessmentsReviewing(this.allIds)
        reviewedAss.forEach( async (ass) => {
          if(ass.vpas_reviews===0) {
            await supabase.addReview(ass.id)
          }
        })
      }
    },
    async resetState () {
      await this.removeAllReviews()
      this.$reset()
    }
  },
})