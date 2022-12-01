
export default {
  populationValues() {
    return
  },
  defaultVmodel() {
    return ''
  },
  filterTemplate() {
    return {
      included: [],
      excluded: []
    }
  },
  getFilter(currentTemplate, option, mode) {
    let isIncluded = currentTemplate.included.map( f => f.id).indexOf(option.id)
    let isExcluded = currentTemplate.excluded.map( f => f.id).indexOf(option.id)
    if(mode==='inc' && isIncluded===-1) {
      currentTemplate.included.push(option)
      if(isExcluded!==-1) {
        currentTemplate.excluded = currentTemplate.excluded.filter(f => f.id!==option.id)
      }
    }
    else if(mode==='exc' && isExcluded===-1) {
      currentTemplate.excluded.push(option)
      if(isIncluded!==-1) {
        currentTemplate.included = currentTemplate.included.filter(f => f.id!==option.id)
      }
    }
    return currentTemplate
  },
  removeFilter(currentTemplate, option, mode) {
    if(mode==='inc') {
      currentTemplate.included = currentTemplate.included.filter(f => f.id!==option.id)
    }
    else if(mode==='exc') {
      currentTemplate.excluded = currentTemplate.excluded.filter(f => f.id!==option.id)
    }
    return currentTemplate
  },
  isActive(currentTemplate=false) {
    if(!currentTemplate) { currentTemplate = this.filterTemplate() }
    return (currentTemplate.included.length > 0) || (currentTemplate.excluded.length > 0)
  },
  updateParam(currentTemplate, param) {
    if(currentTemplate.included.length > 0) {
      param.challengesIncluded = currentTemplate.included.map(f => f.id)
    } else {
      param.challengesIncluded = null
    }

    if(currentTemplate.excluded.length > 0) {
      param.challengesExcluded = currentTemplate.excluded.map(f => f.id)
    } else {
      param.challengesExcluded = null
    }
    return param
  }
}