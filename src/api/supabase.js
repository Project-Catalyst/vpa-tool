import { createClient } from '@supabase/supabase-js';

const RANGE = parseInt(import.meta.env.VITE_PAGE_RANGE)

const supabase = createClient(
  import.meta.env.VITE_CATALYST_SUPABASE_URL,
  import.meta.env.VITE_CATALYST_SUPABASE_ANON_KEY
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
  async getTotalAssessmentsCount() {
    const { count, error } = await supabase
      .from('Assessments')
      .select('*', { count: 'exact', head: true})
      .eq("fund_id", currentFund.id)
    return (error) ? 0 : count
  },
  async getTotalProposalsCount() {
    const { count, error } = await supabase
      .from('Proposals')
      .select('*', { count: 'exact', head: true})
      .eq("fund_id", currentFund.id)
    return (error) ? 0 : count
  },
  async fetchAssessments(page, range=RANGE) {

    let init = (page-1)*range;
    let end = (page*range)-1;

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
  async getProposals(init, end) {
    const { data, error } = await supabase
      .from('Proposals')
      .select('id, title')
      .eq('fund_id', currentFund.id)
      .range(init, end)
      .order('id', { ascending: true })
    return (error) ? {} : data
  },
  async getChallenges() {
    const { data, error } = await supabase
      .from('Challenges')
      .select('id, title')
      .eq('fund_id', currentFund.id)
      .order('id', { ascending: true })
    return (error) ? {} : data
  },
  async getAssessors() {
    const { data, error } = await supabase
      .from('Funds')
      .select(`
        AssessorsFunds (
          Assessors (id, anon_id)
        )
      `)
      .eq('id', currentFund.id)
    return (error) ? {} : data[0].AssessorsFunds.map( obj => obj.Assessors)
  },
  async addReview(assessment_id) {
    const { data, error } = await supabase
      .rpc('add_assessment_review', { assessment_id: assessment_id })
  },
  async removeReview(assessment_id) {
    const { data, error } = await supabase
      .rpc('remove_assessment_review', { assessment_id: assessment_id })
  },
}