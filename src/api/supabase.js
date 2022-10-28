import { createClient } from '@supabase/supabase-js';
import fs from 'fs'

let options = JSON.parse(fs.readFileSync('./supabase-options.json', 'utf-8'))

const supabase = createClient(
  options.CATALYST_SUPABASE_URL,
  options.CATALYST_SUPABASE_ANON_KEY
)

export default {
  getFunds() {
    let { data, error } = await supabase
      .from('Funds')
      .select('*')
      return (error)
    ? {}
    : data
  }
}