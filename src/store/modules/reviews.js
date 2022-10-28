export const useReviewsStore = defineStore('reviews', {
  persist: true,
  state: () => (
    { 
      assessmentId: 0,
      assessor: 'az01234',
      review: 'This is an assessment review',
      count: 0
    }
  ),
  getters: {
    identifiedReview: (state) => state.assessor + ": " + state.review,
  },
  actions: {
    increment() {
      this.count++
    },
  },
})