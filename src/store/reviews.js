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
function getBoolRepr(code) {
  return {
    excellent: (code===2) ? true : false,
    good: (code===1) ? true : false,
    filtered_out: (code===0) ? true : false,
  }
}
function getCodeRepr(importedReview) {
  if (importedReview.excellent) { return 2 }
  else if (importedReview.good) { return 1 }
  else if (importedReview.filtered_out) { return 0 }
}
function transformDataToFile(data) {
  return data.map( review => {
    return {
      id: review.id,
      ...getBoolRepr(parseInt(review.review)),
      vpa_feedback: review.rationale
    }
  })
}
function transformDataFromFile(data) {
  return data.map( review => {
    return {
      id: review.id,
      review: getCodeRepr(review),
      rationale: (review.vpa_feedback===null) ? '' : review.vpa_feedback
    }
  })
}

export const useReviewsStore = defineStore('reviews', {
  persist: true,
  state: () => (
    { 
      file: "",
      reviews: [],
      isLoading: false  // true when the store is updating some property
    }
  ),
  getters: {
    hasImportedFile () {
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
    },
    exportData() {
      return transformDataToFile(this.reviews)
    }
  },
  actions: {
    initializeFromFile(fileName, data) {
      this.file = fileName
      this.reviews = transformDataFromFile(data)
      this.reviews.forEach( async (r) => {
        await supabase.addReview(r.id)
      })
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