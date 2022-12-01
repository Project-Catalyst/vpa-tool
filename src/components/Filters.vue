<script setup>
  import { ref } from 'vue'
  import { useFilterStore } from '../store/filters.js'

  const filters = useFilterStore()
  const fKeys = filters.filtersKeys
  const fModes = filters.filtersModes

</script>

<template>
  <div class="box">

    <o-button @click="filters.init()" variant="success" class="mx-1"> INIT FILTERS STORE </o-button>
    <o-button @click="filters.resetState()" variant="danger"> RESET FILTERS STORE </o-button>
    <o-button @click="filters.logFilters()" variant="primary" class="mx-1"> LOG FILTERS </o-button>
    
    <div class="columns is-multiline is-vcentered">

      <o-field label="Proposal" class="column is-two-thirds">
        <o-autocomplete placeholder="Filter by proposal name"
          v-model="vmodelValues.proposals"
          icon="search" clearable
          :open-on-focus="true"
          :data="filteredDataArray(fKeys.proposals)"
          field="title" 
          @select="option => storeFilterSelection(fKeys.proposals, option)"
        />
      </o-field>
      <o-field label="" class="column is-one-third mb-0 mt-3 pt-4">
        <o-button :disabled="!storedFilters.proposals" @click="addFilter(fKeys.proposals, storedFilters.proposals, fModes.inc)" variant="primary" size="small" class="mx-1"> {{btnFilterInclusion.include}} </o-button>
        <o-button :disabled="!storedFilters.proposals" @click="addFilter(fKeys.proposals, storedFilters.proposals, fModes.exc)" variant="danger" size="small"> {{btnFilterInclusion.exclude}} </o-button>
      </o-field>
    
      <o-field label="Challenge" class="column is-two-thirds">
        <o-autocomplete placeholder="Filter by challenge title"
          v-model="vmodelValues.challenges"
          icon="search" clearable
          :open-on-focus="true"
          :data="filteredDataArray(fKeys.challenges)"
          field="title"
          @select="option => storeFilterSelection(fKeys.challenges, option)"
        />
      </o-field>
      <o-field label="" class="column is-one-third mb-0 mt-3 pt-4">
        <o-button :disabled="!storedFilters.challenges" @click="addFilter(fKeys.challenges, storedFilters.challenges, fModes.inc)" variant="primary" size="small" class="mx-1"> {{btnFilterInclusion.include}} </o-button>
        <o-button :disabled="!storedFilters.challenges" @click="addFilter(fKeys.challenges, storedFilters.challenges, fModes.exc)" variant="danger" size="small"> {{btnFilterInclusion.exclude}} </o-button>
      </o-field>

      <o-field label="Assessor" class="column is-two-thirds">
        <o-autocomplete placeholder="Filter by assessor id"
          v-model="vmodelValues.assessors"
          icon="search" clearable
          :open-on-focus="true"
          :data="filteredDataArray(fKeys.assessors)"
          field="anon_id"
          @select="option => storeFilterSelection(fKeys.assessors, option)"
        />
      </o-field>
      <o-field label="" class="column is-one-third mb-0 mt-3 pt-4">
        <o-button :disabled="!storedFilters.assessors" @click="addFilter(fKeys.assessors, storedFilters.assessors, fModes.inc)" variant="primary" size="small" class="mx-1"> {{btnFilterInclusion.include}} </o-button>
        <o-button :disabled="!storedFilters.assessors" @click="addFilter(fKeys.assessors, storedFilters.assessors, fModes.exc)" variant="danger" size="small"> {{btnFilterInclusion.exclude}} </o-button>
      </o-field>

      <o-field label="Length greater than (characters)" class="column is-one-third">
        <o-autocomplete placeholder="Select a minimum length"
          v-model="vmodelValues.length[0]"
          icon="search" clearable
          :open-on-focus="true"
          :data="filters.lengthMinOptions"
          @select="option => addFilter(fKeys.length, option, fModes.min)"
        />
      </o-field>
      <o-field label="Flagged by Proposer" class="column is-one-third pt-0">
        <o-radio v-for="value in filters.flaggedOptions" :key="value"
          v-model="vmodelValues.flagged" :native-value="value" 
          variant="primary"
          @update:modelValue="option => addFilter(fKeys.flagged, option, fModes.val)">
          {{value}}
        </o-radio>
      </o-field>
      <div class="column is-one-third columns is-multiline mb-0 mt-2">
        <o-field label="Reviews by vPAs" class="column is-full mb-0 py-0 pr-0">
          <o-radio v-for="value in filters.reviewedOptions" :key="value"
            v-model="vmodelValues.reviewed" :native-value="value" 
            variant="primary"
            @update:modelValue="option => addFilter(fKeys.reviewed, option, fModes.val)">
            {{value}}
          </o-radio>
        </o-field>
        <o-field class="column is-full pb-0 ml-2">
          <o-slider v-model="vmodelValues.reviewedRange" 
            :min="filters.reviewedThresholds.min" :max="filters.reviewedThresholds.max" :step="1" lazy
            @change="option => addFilter(fKeys.reviewed, option, fModes.range)"
            :disabled="vmodelValues.reviewed!==filters.getReviewedValue">
            <template v-for="val in [filters.reviewedThresholds.min, filters.reviewedThresholds.max]" :key="val">
              <o-slider-tick :value="val">{{ val }}</o-slider-tick>
            </template>
          </o-slider>
        </o-field>
      </div>
      
      <o-field label="Length smaller than (characters)" class="column is-one-third">
        <o-autocomplete placeholder="Select a maximum length"
          v-model="vmodelValues.length[1]"
          icon="search" clearable
          :open-on-focus="true"
          :data="filters.lengthMaxOptions"
          @select="option => addFilter(fKeys.length, option, fModes.max)"
        />
      </o-field>
      <o-field label="Average Rating" class="column is-one-third pt-0 px-4">
        <o-slider v-model="vmodelValues.ratings" 
          :min="filters.ratingThresholds.min" :max="filters.ratingThresholds.max" :step="0.5" ticks lazy
          @change="option => addFilter(fKeys.ratings, option, fModes.range)">
          <template v-for="val in [filters.ratingThresholds.min, filters.ratingThresholds.max]" :key="val">
            <o-slider-tick :value="val">{{ val }}</o-slider-tick>
          </template>
        </o-slider>
      </o-field>
      <o-field label="My own reviews" class="column is-one-third">
        <o-switch v-model="vmodelValues.stored" 
        @update:modelValue="option => addFilter(fKeys.stored, option, fModes.val)">
          Only stored reviews
        </o-switch>
      </o-field>

      <o-field class="column is-full has-text-centered">
        <o-button @click="resetFilters()" variant="danger" outlined> Reset all filters </o-button>
      </o-field>
      
    </div>

  </div>
</template>

<script>

export default {
  name: "Filters",
  created() {
    this.$watch(
      () => this.filters.reactiveVbindings,
      (newVal, oldVal) => {
        this.vmodelValues[this.fKeys.length] = newVal[this.fKeys.length]
        this.vmodelValues[this.fKeys.ratings] = newVal[this.fKeys.ratings]
        this.vmodelValues[this.fKeys.flagged] = newVal[this.fKeys.flagged]
        this.vmodelValues[this.fKeys.reviewed] = newVal[this.fKeys.reviewed]
        this.vmodelValues[this.fKeys.reviewedRange] = newVal[this.fKeys.reviewedRange]
        this.vmodelValues[this.fKeys.stored] = newVal[this.fKeys.stored]
      },
      { deep: true }
    )
  },
  data() {
    return {
      vmodelValues: this.filters.defaultVmodels,
      storedFilters: {
        proposals: false,
        challenges: false,
        assessors: false,
      }
    }
  },
  computed: {
    btnFilterInclusion() {
      return {
        include: "Include in the search",
        exclude: "Exclude from search"
      }
    },
  },
  methods: {
    addFilter(filterId, option, mode) {
      this.filters.addActiveFilter(filterId, option, mode)
      if(mode===this.fModes.inc || mode===this.fModes.exc) {
        this.vmodelValues[filterId] = ''
      }
    },
    storeFilterSelection(filterId, option) {
      (option===null)
      ? this.clearStoredSelection(filterId)
      : this.storedFilters[filterId] = option
    },
    clearStoredSelection(filterId) {
      this.storedFilters[filterId] = false
    },
    resetFilters() {
      this.filters.resetFilters()
      this.vmodelValues = this.filters.defaultVmodels
    },
    filteredDataArray(filterId) {
      let searchText = this.vmodelValues[filterId]
      let data;
      if(filterId === this.fKeys.proposals) { 
        data = this.filters.proposals
      }
      else if(filterId === this.fKeys.challenges) { 
        data = this.filters.challenges  
      }
      else if(filterId === this.fKeys.assessors) { 
        data = this.filters.assessors
      }
      return data.filter( (option) => {
        if (filterId === this.fKeys.assessors) {
          return option.anon_id
            .toString()
            .toLowerCase()
            .indexOf(searchText.toLowerCase()) >= 0
        } else {
          return option.title
            .toString()
            .toLowerCase()
            .indexOf(searchText.toLowerCase()) >= 0
        }
      })
    },
  },
}
</script>

<style scoped>
</style>
