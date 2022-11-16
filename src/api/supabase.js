import { createClient } from '@supabase/supabase-js';

const RANGE = parseInt(import.meta.env.VITE_PAGE_RANGE)
const BATCH_SIZE = parseInt(import.meta.env.VITE_SUPABASE_FETCH_BATCH_SIZE)

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
  async getProposals(selectQuery="id, title") {
    const totalProposals = await this.getTotalProposalsCount()
    let all_proposals = [];
    for (let i = 0; i < Math.ceil(totalProposals/BATCH_SIZE); i++) {
      let init = i*BATCH_SIZE;
      let final = (i+1)*BATCH_SIZE -1;
      let proposals_batch = await this.fetchProposalsByRange(init, final, selectQuery)
      all_proposals.push(...proposals_batch)
    }
    return all_proposals
  },
  async fetchProposalsByRange(init, end, selectQuery) {
    const { data, error } = await supabase
      .from('Proposals')
      .select(selectQuery)
      .eq('fund_id', currentFund.id)
      .range(init, end)
      .order('id', { ascending: true })
    return (error) ? {} : data
  },
  async getChallenges(selectQuery="id, title") {
    const { data, error } = await supabase
      .from('Challenges')
      .select(selectQuery)
      .eq('fund_id', currentFund.id)
      .order('id', { ascending: true })
    return (error) ? {} : data
  },
  async getAssessors() {
    return await this.getAssessorsFromFund(currentFund.id)
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
  async addReview(assessment_id) {
    const { data, error } = await supabase
      .rpc('add_assessment_review', { assessment_id: assessment_id })
  },
  async removeReview(assessment_id) {
    const { data, error } = await supabase
      .rpc('remove_assessment_review', { assessment_id: assessment_id })
  },
}