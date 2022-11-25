
const defaultValue = 'All'
const positiveValue = 'Reviewed'
const negativeValue = 'Not reviewed'

export default {
  populationValues() {
    return [positiveValue, negativeValue, defaultValue]
  },
  defaultVmodel() {
    return defaultValue
  },
  filterTemplate() {
    return {
      valFlag: null
    }
  },
  getFilter(currentTemplate, option, mode) {
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
    return currentTemplate
  },
  removeFilter(currentTemplate, option) {
    return this.filterTemplate()
  },
  isActive(currentTemplate=false) {
    if(!currentTemplate) { currentTemplate = this.filterTemplate() }
    return (currentTemplate.valFlag!==this.filterTemplate().valFlag)
  }
}