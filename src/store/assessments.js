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
    },
    getAssessmentById: (state) => {
      return async (id) => await supabase.fetchAssessmentById(id)
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
      this.available = false;
      let init = (currentPage-1)*this.fetchSize;
      let final = (currentPage*this.fetchSize)-1;
      this.assessments = await supabase.fetchAssessments(init, final)
      this.available = true;
    },
  },
})