import { defineStore } from 'pinia'

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
    }
  },
  actions: {
    init(file) {
      this.file = file
      this.initialized = this.isInitialized
    },
    getReviewById(id) {
      console.log(id)
    },
    resetState () {
      this.$reset()
    }
  },
})