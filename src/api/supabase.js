import { createClient } from '@supabase/supabase-js';
import options from './supabase-options.json';

const supabase = createClient(
  options.CATALYST_SUPABASE_URL,
  options.CATALYST_SUPABASE_ANON_KEY
)

const currentFund = await (async () => {
  const { data, error } = await supabase
    .from('Funds')
    .select('*')
  return (error) 
  ? {} 
  : data.filter( fund => fund.number === Math.max(...data.map(funds => funds.number)) )[0]
})()

export default {
  client() {
    return supabase
  },
  async getAllFromTable(table) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
    return (error) ? {} : data
  },
  async getAllFromTableAndFund(table, fundId) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('fund_id', fundId)
    return (error) ? {} : data
  },
  async getAssessorsFromFund(fundId) {
    const { data, error } = await supabase
      .from('Funds')
      .select(`
        AssessorsFunds (
          Assessors (id, anon_id)
        )
      `)
      .eq('id', fundId)
    return (error) ? {} : data[0].AssessorsFunds.map( obj => obj.Assessors)
  },
  async getTotalAssessmentsCount() {
    const { count, error } = await supabase
      .from('Assessments')
      .select('*', { count: 'estimated', head: true})
      .eq("fund_id", currentFund.id)
    return (error) ? 0 : count
  },
  async fetchAssessments(init, end) {
    const { data, error } = await supabase
      .from('Assessments')
      .select(`
        id,
        auditability_note,
        auditability_rating,
        feasibility_note,
        feasibility_rating,
        impact_note,
        impact_rating,
        proposer_mark,
        vpas_reviews,
        fund_id,
        Assessors (id, anon_id),
        Challenges (id, title),
        Proposals (id, title)`)
      .range(init, end)
      .order('id', { ascending: true })
    return (error) ? {} : data
  },
  async fetchAssessmentById(id) {
    const { data, error } = await supabase
      .from('Assessments')
      .select(`
        id,
        auditability_note,
        auditability_rating,
        feasibility_note,
        feasibility_rating,
        impact_note,
        impact_rating,
        proposer_mark,
        vpas_reviews,
        fund_id,
        Assessors (id, anon_id),
        Challenges (id, title),
        Proposals (id, title, url)`)
      .eq('id', id)
    return (error) ? {} : data[0]
  },
  async addReview(assessment_id) {
    const { data, error } = await supabase
      .rpc('add_assessment_review', { assessment_id: assessment_id })
  },
  async removeReview(assessment_id) {
    const { data, error } = await supabase
      .rpc('remove_assessment_review', { assessment_id: assessment_id })
  },
  getFunds() {
    return this.getAllFromTable('Funds')
  },
  getProposals() {
    return this.getAllFromTableAndFund('Proposals', currentFund.id)
  },
  getChallenges() {
    return this.getAllFromTableAndFund('Challenges', currentFund.id)
  },
  getAssessors() {
    return this.getAssessorsFromFund(currentFund.id)
  },
}