
const defaultValue = 'All'
const positiveValue = 'Reviewed'
const negativeValue = 'Not reviewed'

const MAX_REVIEWS = 30 // get from supabase
const RANGE = {min: 0, max: MAX_REVIEWS}

export default {
  populationValues() {
    return [positiveValue, negativeValue, defaultValue]
  },
  thresholdValues() {
    return RANGE
  },
  defaultVmodel() {
    return defaultValue
  },
  defaultRangeVmodel() {
    return [RANGE.min, RANGE.max]
  },
  positiveValue() {
    return positiveValue
  },
  filterTemplate() {
    return {
      valFlag: null,
      range: [RANGE.min, RANGE.max],
      activeRange: false
    }
  },
  getFilter(currentTemplate, option, mode) {
    if(mode==='val') {
      if(option!==currentTemplate.valFlag) {
        if(option===defaultValue) {
          currentTemplate.valFlag = null
        }
        else if(option===positiveValue) {
          currentTemplate.valFlag = true
        }
        else if(option===negativeValue){
          currentTemplate.valFlag = false
        }
      }
    }
    if(mode==='range') {
      currentTemplate.range = option
      if(option[0]===RANGE.min && option[1]===RANGE.max) {
        currentTemplate.activeRange = false
      } else {
        currentTemplate.activeRange = true
      }
    }
    return currentTemplate
  },
  removeFilter(currentTemplate, option, mode) {
    return this.filterTemplate()
  },
  isActive(currentTemplate=false) {
    if(!currentTemplate) { currentTemplate = this.filterTemplate() }
    return (currentTemplate.valFlag!==this.filterTemplate().valFlag)
  }
}