import { defineStore } from 'pinia'
import supabase from '../api/supabase.js'

const totalAssessments = await (async () => {
  return await supabase.getTotalAssessmentsCount()
})()

export const useAssessmentsStore = defineStore('assessments', {
  state: () => (
    { 
      total: totalAssessments,
      count: totalAssessments, // update when filtering with the count of query
      fetchSize: 30,
      assessments: [],
      available: false,
    }
  ),
  getters: {
    getAssessments() {
      return this.assessments
    }
  },
  actions: {
    async load() {
      this.available = false;
      this.assessments = await supabase.fetchAssessments(0, this.fetchSize-1)
      this.available = true;
    },
  },
})