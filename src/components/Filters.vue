<script setup>
  import { ref } from 'vue'
  import { useFilterStore } from '../store/modules/filters.js'

  const filters = useFilterStore()

</script>

<template>
  <div class="box">

    <div class="columns">
      <o-field label="Proposal" class="column is-two-thirds">
        <o-input></o-input>
      </o-field>
      <o-field label="" class="column">
        <o-button variant="primary" size="small"> {{btnFilterInclusion.include}} </o-button>
        <o-button variant="danger" size="small"> {{btnFilterInclusion.exclude}} </o-button>
      </o-field>
    </div>

    <div class="columns">
      <o-field label="Challenge" class="column is-two-thirds">
        <o-input></o-input>
      </o-field>
      <o-field label="" class="column">
        <o-button variant="primary" size="small"> {{btnFilterInclusion.include}} </o-button>
        <o-button variant="danger" size="small"> {{btnFilterInclusion.exclude}} </o-button>
      </o-field>
    </div>

    <div class="columns">
      <o-field label="Assessor" class="column is-two-thirds">
        <o-input></o-input>
      </o-field>
      <o-field label="" class="column">
        <o-button variant="primary" size="small"> {{btnFilterInclusion.include}} </o-button>
        <o-button variant="danger" size="small"> {{btnFilterInclusion.exclude}} </o-button>
      </o-field>
    </div>

    <div class="columns">
      <o-field label="Average Rating" class="column">
        <o-input></o-input>
      </o-field>
      <o-field label="Minimum Length" class="column">
        <o-input></o-input>
      </o-field>
      <o-field label="Maximum Length" class="column">
        <o-input></o-input>
      </o-field>
    </div>

    <div class="columns">
      <o-field label="Flagged by Proposer" class="column">
        <o-radio v-for="value in filters.getFilterValues('flagged')" :key="value"
          v-model="selectedFilterFlagged" 
          :native-value="value" 
          variant="primary">
          {{value}}
        </o-radio>
      </o-field>
      <o-field label="Reviewed Status" class="column">
        <o-radio v-for="value in filters.getFilterValues('reviewed')" :key="value"
          v-model="selectedFilterReviewed" 
          :native-value="value" 
          variant="primary">
          {{value}}
        </o-radio>
      </o-field>
    </div>

  </div>
</template>

<script>

export default {
  name: "Filters",
  data() {
    return {
      isFilterProposalIncluded: true,
      isFilterChallengeIncluded: true,
      isFilterAssessorIncluded: true,
      selectedFilterFlagged: 'All',
      selectedFilterReviewed: 'All'
    }
  },
  computed: {
    btnFilterInclusion() {
      return {
        include: "Include in the search",
        exclude: "Exclude from search"
      }
    }
  }
}
</script>

<style scoped>
</style>
