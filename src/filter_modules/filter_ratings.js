
const RANGE = {min: 0, max: 5}

export default {
  populationValues() {
    return RANGE
  },
  defaultVmodel() {
    return [RANGE.min, RANGE.max]
  },
  filterTemplate() {
    return {
      min: RANGE.min,
      max: RANGE.max
    }
  },
  getFilter(currentTemplate, option, mode) {
    if(option[0]!==currentTemplate.min) {
      currentTemplate.min = option[0]
    }
    if(option[1]!==currentTemplate.max) {
      currentTemplate.max = option[1]
    }
    return currentTemplate
  },
  removeFilter(currentTemplate, option, mode) {
    return this.filterTemplate()
  },
  isActive(currentTemplate=false) {
    if(!currentTemplate) { currentTemplate = this.filterTemplate() }
    return (currentTemplate.min!==this.filterTemplate().min) || (currentTemplate.max!==this.filterTemplate().max)
  },
  updateParam(currentTemplate, param) {
    if(currentTemplate.min !== this.filterTemplate().min) {
      param.ratingMin = currentTemplate.min
    } else {
      param.ratingMin = null
    }

    if(currentTemplate.max !== this.filterTemplate().max) {
      param.ratingMax = currentTemplate.max
    } else {
      param.ratingMax = null
    }
    return param 
  }
}