
export default {
  populationValues() {
    return 
  },
  defaultVmodel() {
    return false
  },
  filterTemplate() {
    return {
      valFlag: false,
    }
  },
  getFilter(currentTemplate, option, mode) {
    currentTemplate.valFlag = option
    return currentTemplate
  },
  removeFilter(currentTemplate, option, mode) {
    return this.filterTemplate()
  },
  isActive(currentTemplate=false) {
    if(!currentTemplate) { currentTemplate = this.filterTemplate() }
    return currentTemplate.valFlag
  },
  updateParam(currentTemplate, param) {
    return
  }
}