import { defineStore } from 'pinia'
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
      reviews: []
    }
  ),
  getters: {
    isInitialized () {
      return (this.file !== '')
    },
    count() {
      return this.reviews.length
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
    },
    async removeReview(id) {
      let index = this.getReviewIndex(id)
      this.reviews.splice(index, 1)
      await supabase.removeReview(id)
    },
    updateReview(id, review) {
      let index = this.getReviewIndex(id)
      this.reviews[index].review = getReviewCode(review)
    },
    updateRationale(id, rationale) {
      let index = this.getReviewIndex(id)
      this.reviews[index].rationale = rationale
    },
    resetState () {
      this.$reset()
    }
  },
})