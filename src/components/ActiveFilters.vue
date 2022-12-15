<script setup>
// import { ref } from 'vue';
  import { useFilterStore } from '../store/filters.js'

  const filters = useFilterStore()
  const fKeys = filters.filtersKeys
  const fModes = filters.filtersModes

</script>

<template>

  <section id="active-filters" class="mb-5">
    <o-notification>
      <div class="subtitle has-text-centered"><b>Active Filters</b></div>

      <div class="columns">

        <div class="column is-three-fifths"
          v-if="filters.isFilterActive(fKeys.proposals) || filters.isFilterActive(fKeys.challenges) || filters.isFilterActive(fKeys.assessors)">

          <div v-if="filters.isFilterActive(fKeys.proposals)" class="mb-5">
            <div class="subtitle mb-2"><b>Filtered Proposals</b></div>
            <div v-if="filters.hasIncludedOptions(fKeys.proposals)"><b>Included in the search:</b>
              <span v-for="option in filters.getIncludedOptions(fKeys.proposals)" :key="option.id" class="tag is-success is-light is-small mb-1">
                {{option.title}}
                <button class="delete is-small" @click="removeFilter(fKeys.proposals, option, fModes.inc)"></button>
              </span>
            </div>
            <div v-if="filters.hasExcludedOptions(fKeys.proposals)"><b>Excluded from the search:</b>
              <span v-for="option in filters.getExcludedOptions(fKeys.proposals)" :key="option.id" class="tag is-danger is-light is-small">
                {{option.title}}
                <button class="delete is-small" @click="removeFilter(fKeys.proposals, option, fModes.exc)"></button>
              </span>
            </div>
          </div>

          <div v-if="filters.isFilterActive(fKeys.challenges)" class="mb-5">
            <div class="subtitle mb-2"><b>Filtered Challenges</b></div>
            <div v-if="filters.hasIncludedOptions(fKeys.challenges)"><b>Included in the search:</b>
              <span v-for="option in filters.getIncludedOptions(fKeys.challenges)" :key="option.id" class="tag is-success is-light is-small mb-1">
                {{option.title}}
                <button class="delete is-small" @click="removeFilter(fKeys.challenges, option, fModes.inc)"></button>
              </span>
            </div>
            <div v-if="filters.hasExcludedOptions(fKeys.challenges)"><b>Excluded from the search:</b>
              <span v-for="option in filters.getExcludedOptions(fKeys.challenges)" :key="option.id" class="tag is-danger is-light is-small">
                {{option.title}}
                <button class="delete is-small" @click="removeFilter(fKeys.challenges, option, fModes.exc)"></button>
              </span>
            </div>
          </div>

          <div v-if="filters.isFilterActive(fKeys.assessors)" class="mb-5">
            <div class="subtitle mb-2"><b>Filtered Assessors</b></div>
            <div v-if="filters.hasIncludedOptions(fKeys.assessors)"><b>Included in the search:</b>
              <span v-for="option in filters.getIncludedOptions(fKeys.assessors)" :key="option.id" class="tag is-success is-light is-small mb-1">
                {{option.anon_id}}
                <button class="delete is-small" @click="removeFilter(fKeys.assessors, option, fModes.inc)"></button>
              </span>
            </div>
            <div v-if="filters.hasExcludedOptions(fKeys.assessors)"><b>Excluded from the search:</b>
              <span v-for="option in filters.getExcludedOptions(fKeys.assessors)" :key="option.id" class="tag is-danger is-light is-small">
                {{option.anon_id}}
                <button class="delete is-small" @click="removeFilter(fKeys.assessors, option, fModes.exc)"></button>
              </span>
            </div>
          </div>
        
        </div>

        <div class="column is-two-fifths">
          <div class="subtitle mb-2"><b>Assessments filtered by</b></div>

          <div v-if="filters.isFilterActive(fKeys.stored)" class="mb-3"><b>Stored reviews:</b>
            <span class="tag is-primary is-light is-medium">
              {{getTagText(fKeys.stored)}}
              <button class="delete is-small" @click="removeFilter(fKeys.stored)"></button>
            </span>
          </div>

          <div v-if="filters.isFilterActive(fKeys.length)" class="mb-3"><b>Length:</b>
            <span class="tag is-primary is-light is-medium">
              {{getTagText(fKeys.length)}}
              <button class="delete is-small" @click="removeFilter(fKeys.length)"></button>
            </span>
          </div>
          
          <div v-if="filters.isFilterActive(fKeys.ratings)" class="mb-3"><b>Rating:</b>
            <span class="tag is-primary is-light is-medium">
              {{getTagText(fKeys.ratings)}}
              <button class="delete is-small" @click="removeFilter(fKeys.ratings)"></button>
            </span>
          </div>

          <div v-if="filters.isFilterActive(fKeys.flagged)" class="mb-3"><b>Proposer Flag:</b>
            <span class="tag is-primary is-light is-medium">
              {{getTagText(fKeys.flagged)}}
              <button class="delete is-small" @click="removeFilter(fKeys.flagged)"></button>
            </span>
          </div>

          <div v-if="filters.isFilterActive(fKeys.reviewed)" class="mb-3"><b>vPAs reviewing:</b>
            <span class="tag is-primary is-light is-medium">
              {{getTagText(fKeys.reviewed)}}
              <button class="delete is-small" @click="removeFilter(fKeys.reviewed)"></button>
            </span>
          </div>

        </div>

      </div>

    </o-notification>
  </section>

</template>

<script>

export default {
  name: "ActiveFilters",
  data() {
    return {
    }
  },
  methods: {
    removeFilter(filterId, option=null, mode=null) {
      this.filters.removeActiveFilter(filterId, option, mode)
    },
    getTagText(filterId) {
      if (filterId===this.fKeys.length) {
        let activeVal = this.filters.activeVmodels()[filterId]
        if(activeVal[0]==='') { return `Length up to ${activeVal[1]} chars` }
        else if(activeVal[1]==='') { return `Length greater than ${activeVal[0]} chars` }
        else { return `Length between ${activeVal[0]}-${activeVal[1]} chars` }
      }
      else if(filterId===this.fKeys.ratings) {
        return `Rate between ${this.filters.activeVmodels()[filterId][0]} and ${this.filters.activeVmodels()[filterId][1]} points`
      }
      else if(filterId===this.fKeys.flagged) {
        return `${this.filters.activeVmodels()[filterId]}`
      }
      else if(filterId===this.fKeys.reviewed) {
        let rangeText = ""
        if(this.filters.hasReviewedRangeActive) {
          let range = this.filters.getReviewedRange
          rangeText = ` (no. of reviews from ${range[0]}-${range[1]})`
        }
        return (this.filters.activeVmodels()[filterId] === this.filters.getReviewedValue)
        ? `Reviews provided${rangeText}`
        : "No reviews provided"
      }
      else if(filterId===this.fKeys.stored) {
        return "Personal stored reviews"
      }
    },
  }
}
</script>

<style scoped>
.media {
  padding-top: 0rem !important
}
</style>
