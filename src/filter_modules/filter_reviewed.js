import supabase from '../api/supabase.js'

const MAX_REVIEWS = await (async () => {
  return await supabase.getReviewsMaximum()
})()
const RANGE = {min: 0, max: MAX_REVIEWS}

const defaultValue = 'All'
const positiveValue = 'Reviewed'
const negativeValue = 'Not reviewed'

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
  },
  updateParam(currentTemplate, param) {
    param.reviewed = currentTemplate.valFlag
    if(currentTemplate.activeRange) {
      if(currentTemplate.range[0] !== this.filterTemplate().range[0]) {
        param.reviewedMin = currentTemplate.range[0]
      } else {
        param.reviewedMin = null
      }

      if(currentTemplate.range[1] !== this.filterTemplate().range[1]) {
        param.reviewedMax = currentTemplate.range[1]
      } else {
        param.reviewedMax = null
      }
    } else {
      param.reviewedMin = null
      param.reviewedMax = null
    }
    return param
  }
}