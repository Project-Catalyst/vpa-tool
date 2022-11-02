import { defineStore } from 'pinia'
import supabase from '../api/supabase.js'

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
          values: {min: 0, max: 5}
        },
        reviewed: {
          id: '',
          value: '',
          values: ['Reviewed', 'Not reviewed', 'All']
        },
        length: {
          id: '',
          value: '',
          values: [500, 750, 1000, 1250, 1500]
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
    },
  },
  actions: {
    async init() {
      console.log("Filters stores init")
      await this.populateProposals()
      console.log('>> loaded proposals')
      await this.populateChallenges()
      console.log('>> loaded challenges')
      await this.populateAssessors()
      console.log('>> loaded assessors')
      this.initialized = true;
      console.log('done!')
    },
    async populateProposals() {
      this.filters.proposal.values = await supabase.getProposals();
    },
    async populateChallenges() {
      this.filters.challenge.values = await supabase.getChallenges();
    },
    async populateAssessors() {
      this.filters.assessor.values = await supabase.getAssessors();
    },
    resetState() {
      this.$reset()
      console.log('Filters store reset')
    }
  }
})