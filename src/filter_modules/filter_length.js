import supabase from '../api/supabase.js'

const THRESHOLDS = await (async () => {
  return await supabase.getLengthRange()
})()

const POPULATION = ( () => {
  let minLen = Math.floor(THRESHOLDS[0]/100)*100
  let maxLen = Math.ceil(THRESHOLDS[1]/100)*100
  let step = (maxLen-minLen)/5
  return [minLen, minLen+1*step, minLen+2*step, minLen+3*step, minLen+4*step, minLen+5*step]
})()

const LENGTH_VALUES = [500, 750, 1000, 1250, 1500] // read this from dynamic computation

export default {  
  populationValuesMin() {
    return POPULATION.slice(0,5)
  },
  populationValuesMax() {
    return POPULATION.slice(1)
  },
  defaultVmodel() {
    return ['','']
  },
  filterTemplate() {
    return {
      min: null,
      max: null
    }
  },
  getFilter(currentTemplate, option, mode) {
    if(mode==='min' && option!==currentTemplate.min) {
      currentTemplate.min = option
    }
    else if(mode==='max' && option!==currentTemplate.max) {
      currentTemplate.max = option
    }
    return currentTemplate
  },
  removeFilter(currentTemplate, option) {
    return this.filterTemplate()
  },
  isActive(currentTemplate=false) {
    if(!currentTemplate) { currentTemplate = this.filterTemplate() }
    return (currentTemplate.min!==this.filterTemplate().min) || (currentTemplate.max!==this.filterTemplate().max)
  },
  updateParam(currentTemplate, param) {
    param.lengthMin = currentTemplate.min
    param.lengthMax = currentTemplate.max
    return param
  }
}