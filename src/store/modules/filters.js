import { defineStore } from 'pinia'

export const useFilterStore = defineStore('filters', {
  persist: true,
  state: () => (
    { 
      initialized: false,
      filters: {
        proposal: {
          id: '',
          value: '',
          values: []
        },
        flagged: {
          id: '',
          value: '',
          values: ['Flagged', 'Not flagged', 'All']
        },
        challenge: {
          id: '',
          value: '',
          values: []
        },
        assessor: {
          id: '',
          value: '',
          values: []
        },
        rating: {
          id: '',
          value: '',
          values: []
        },
        reviewed: {
          id: '',
          value: '',
          values: ['Reviewed', 'Not reviewed', 'All']
        },
        length: {
          id: '',
          value: '',
          values: []
        }
      }
    }
  ),
  getters: {
    getFilter: (state) => {
      return (filterId) => state.filters[filterId]
    },
    getFilterValues: (state) => {
      return (filterId) => state.filters[filterId].values
    }
  },
  actions: {
    init() {
      console.log("init")
    }
  }
})