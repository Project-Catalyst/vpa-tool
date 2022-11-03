<script setup>
  import { ref } from 'vue'
  import { useFilterStore } from '../store/filters.js'

  const filters = useFilterStore()
  const proposals = filters.getFilterValues('proposal')
  const challenges = filters.getFilterValues('challenge')
  const assessors = filters.getFilterValues('assessor')
  const ratings = filters.getFilterValues('rating')
  const length = filters.getFilterValues('length')

</script>

<template>
  <div class="box">
    
    <div class="columns is-multiline is-vcentered">

      <o-field label="Proposal" class="column is-two-thirds">
        <o-autocomplete
          v-model="selectedFilterProposal"
          placeholder="Filter by proposal name"
          icon="search"
          :open-on-focus="true"
          :data="proposals"
          field="title"
        />
      </o-field>
      <o-field label="" class="column is-one-third mb-0 mt-3 pt-4">
        <o-button variant="primary" size="small" class="mx-1"> {{btnFilterInclusion.include}} </o-button>
        <o-button variant="danger" size="small"> {{btnFilterInclusion.exclude}} </o-button>
      </o-field>
    
      <o-field label="Challenge" class="column is-two-thirds">
        <o-autocomplete
          v-model="selectedFilterChallenge"
          placeholder="Filter by challenge title"
          icon="search"
          :open-on-focus="true"
          :data="challenges"
          field="title"
        />
      </o-field>
      <o-field label="" class="column is-one-third mb-0 mt-3 pt-4">
        <o-button variant="primary" size="small" class="mx-1"> {{btnFilterInclusion.include}} </o-button>
        <o-button variant="danger" size="small"> {{btnFilterInclusion.exclude}} </o-button>
      </o-field>

      <o-field label="Assessor" class="column is-two-thirds">
        <o-autocomplete
          v-model="selectedFilterAssessor"
          placeholder="Filter by assessor id"
          icon="search"
          :open-on-focus="true"
          :data="assessors"
          field="anon_id"
        />
      </o-field>
      <o-field label="" class="column is-one-third mb-0 mt-3 pt-4">
        <o-button variant="primary" size="small" class="mx-1"> {{btnFilterInclusion.include}} </o-button>
        <o-button variant="danger" size="small"> {{btnFilterInclusion.exclude}} </o-button>
      </o-field>

      <o-field label="Length greater than (characters)" class="column is-one-third">
        <o-autocomplete
          v-model="selectedFilterLengthMin"
          placeholder="Select a minimum length"
          icon="search"
          :open-on-focus="true"
          :data="length"
        />
      </o-field>
      <o-field label="Length smaller than (characters)" class="column is-one-third">
        <o-autocomplete
          v-model="selectedFilterLengthMax"
          placeholder="Select a maximum length"
          icon="search"
          :open-on-focus="true"
          :data="length"
        />
      </o-field>
      <o-field label="Average Rating" class="column is-one-third pt-2">
        <o-slider v-model="selectedFilterRating" 
          :min="ratings.min" :max="ratings.max" :step="0.5" 
          ticks lazy>
          <template v-for="val in [ratings.min, ratings.max]" :key="val">
            <o-slider-tick :value="val">{{ val }}</o-slider-tick>
          </template>
        </o-slider>
      </o-field>

      <o-field label="Flagged by Proposer" class="column is-half">
        <o-radio v-for="value in filters.getFilterValues('flagged')" :key="value"
          v-model="selectedFilterFlagged" 
          :native-value="value" 
          variant="primary">
          {{value}}
        </o-radio>
      </o-field>
      <o-field label="Reviewed Status" class="column is-half">
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
      selectedFilterProposal: "",
      selectedFilterChallenge: "",
      selectedFilterAssessor: "",
      selectedFilterRating: [this.ratings.min, this.ratings.max],
      selectedFilterLengthMin: "",
      selectedFilterLengthMax: "",
      selectedFilterFlagged: 'All',
      selectedFilterReviewed: 'All'
    }
  },
  methods: {
    filteredDataArray(values, key) {
      return Object.keys(values).filter((option) => {
        return option
            .toString()
            .toLowerCase()
            .indexOf(this.search[key].toLowerCase()) >= 0
      })
    },
  },
  computed: {
    btnFilterInclusion() {
      return {
        include: "Include in the search",
        exclude: "Exclude from search"
      }
    },
  }
}
</script>

<style scoped>
</style>
