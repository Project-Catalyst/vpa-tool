<script setup>
// import { ref } from 'vue';
  import { useFilterStore } from '../store/filters.js'

  const filters = useFilterStore()
  const fKeys = filters.filtersKeys

</script>

<template>

  <section id="active-filters" class="mb-5">
    <o-notification>
      <div class="subtitle has-text-centered"><b>Active Filters</b></div>

      <div class="columns">

        <div class="column is-two-thirds">

          <div v-if="filters.isFilterActive(fKeys.proposals)" class="mb-5">
            <div class="subtitle mb-2"><b>Filtered Proposals</b></div>
            <div v-if="filters.hasIncludedOptions(fKeys.proposals)"><b>Included in the search:</b>
              <span v-for="option in filters.getIncludedOptions(fKeys.proposals)" :key="option.id" class="tag is-success is-light is-small mb-1">
                {{option.title}}
                <button class="delete is-small" @click="removeFilter(fKeys.proposals, option)"></button>
              </span>
            </div>
            <div v-if="filters.hasExcludedOptions(fKeys.proposals)"><b>Excluded from the search:</b>
              <span v-for="option in filters.getExcludedOptions(fKeys.proposals)" :key="option.id" class="tag is-danger is-light is-small">
                {{option.title}}
                <button class="delete is-small" @click="removeFilter(fKeys.proposals, option)"></button>
              </span>
            </div>
          </div>

          <div v-if="filters.isFilterActive(fKeys.challenges)" class="mb-5">
            <div class="subtitle mb-2"><b>Filtered Challenges</b></div>
            <div v-if="filters.hasIncludedOptions(fKeys.challenges)"><b>Included in the search:</b>
              <span v-for="option in filters.getIncludedOptions(fKeys.challenges)" :key="option.id" class="tag is-success is-light is-small mb-1">
                {{option.title}}
                <button class="delete is-small" @click="removeFilter(fKeys.challenges, option)"></button>
              </span>
            </div>
            <div v-if="filters.hasExcludedOptions(fKeys.challenges)"><b>Excluded from the search:</b>
              <span v-for="option in filters.getExcludedOptions(fKeys.challenges)" :key="option.id" class="tag is-danger is-light is-small">
                {{option.title}}
                <button class="delete is-small" @click="removeFilter(fKeys.challenges, option)"></button>
              </span>
            </div>
          </div>

          <div v-if="filters.isFilterActive(fKeys.assessors)" class="mb-5">
            <div class="subtitle mb-2"><b>Filtered Assessors</b></div>
            <div v-if="filters.hasIncludedOptions(fKeys.assessors)"><b>Included in the search:</b>
              <span v-for="option in filters.getIncludedOptions(fKeys.assessors)" :key="option.id" class="tag is-success is-light is-small mb-1">
                {{option.anon_id}}
                <button class="delete is-small" @click="removeFilter(fKeys.assessors, option)"></button>
              </span>
            </div>
            <div v-if="filters.hasExcludedOptions(fKeys.assessors)"><b>Excluded from the search:</b>
              <span v-for="option in filters.getExcludedOptions(fKeys.assessors)" :key="option.id" class="tag is-danger is-light is-small">
                {{option.anon_id}}
                <button class="delete is-small" @click="removeFilter(fKeys.assessors, option)"></button>
              </span>
            </div>
          </div>
        
        </div>

        <div class="column is-one-third">
          <div class="subtitle mb-2"><b>Assessments filtered by</b></div>

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
    removeFilter(filterId, option=null) {
      this.filters.removeActiveFilter(filterId, option)
    },
    getTagText(filterId) {
      if (filterId===this.fKeys.length) {
        let activeVal = this.filters.getActiveLength
        if(activeVal.min===null) { return `Length up to ${activeVal.max} chars` }
        else if(activeVal.max===null) { return `Length greater than ${activeVal.min} chars` }
        else { return `Length between ${activeVal.min}-${activeVal.max} chars` }
      }
      else if(filterId===this.fKeys.ratings) {
        return `Rate between ${this.filters.getActiveRatings[0]} and ${this.filters.getActiveRatings[1]} points`
      }
      else if(filterId===this.fKeys.flagged) {
        return `${this.filters.getActiveFlagged}`
      }
      else if(filterId===this.fKeys.reviewed) {
        return (this.filters.getActiveReviewed === 'Reviewed')
        ? "Reviews provided"
        : "No reviews provided"
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
