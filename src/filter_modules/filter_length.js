
const LENGTH_VALUES = [500, 750, 1000, 1250, 1500] // read this from dynamic computation

export default {  
  populationValues() {
    return LENGTH_VALUES
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
  }
}