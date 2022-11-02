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
  getFunds() {
    console.log('currentFund', currentFund)
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