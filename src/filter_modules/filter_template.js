/** 
 * This file contains the basic required structure for a filter module. 
*/


export default {
  populationValues() {
    return // Returns the population of values for the filter's element. It is not required
  },
  defaultVmodel() {
    return // Returns the default value to the filter's element v-model
  },
  filterTemplate() {
    return // Returns the filter object default structure
  },
  getFilter(currentTemplate, option, mode) {
    /* Method to receive the current filter state from store, update and return the filter object */
    return currentTemplate
  },
  removeFilter(currentTemplate, option) {
    /* Method to receive the current filter state from store, and return the filter object for the action of removing <option> */
    return currentTemplate
  },
  isActive(currentTemplate=false) {
    if(!currentTemplate) { currentTemplate = this.filterTemplate() }
    return // returns whether <currentTemplate> filter object is considered active or not
  } 
}