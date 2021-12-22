<template>
  <section class="filter pt-4 pb-4">
    <div class="filter-list box columns is-multiline m-0 mb-4" v-if="filterVisible">
      <div
        class="single-filter is-6 column"
        v-for="(v, i) in availableFilters"
        :key="`filter-${v.key}-${i}`"
      >
        <b-field expanded :label="v.label" v-if="v.type === 'select'">
          <b-select
            expanded
            :placeholder="v.label"
            :value="v.value"
            @input="updateFilter(v, $event)"
          >
            <option v-for="(vv, kk) in v.values" :value="vv" :key="vv">
              {{ kk }}
            </option>
          </b-select>
        </b-field>
        <b-field expanded :label="v.label" v-if="v.type === 'autocomplete'">
          <b-autocomplete
              v-model="search[v.key]"
              :data="filteredDataArray(v.values, v.key)"
              :placeholder="`Search ${v.label}`"
              icon="magnify"
              :open-on-focus="true"
              clearable
              @select="option => updateAutocomplete(option, v)">
              <template #empty>No results found</template>
          </b-autocomplete>
        </b-field>
      </div>
    </div>
    <div class="active-filters box" v-if="activeFilters.length">
      <div class="heading">Selected filters:</div>
      <div class="tags">
        <div
          class="tag is-primary is-light"
          v-for="f in activeFilters"
          :key="`active-${f.key}-${f.value}`"
        >
          <span class="has-ellipsis">{{ f.label }}: {{ getLabelValue(f) }}</span>
          <button class="delete" @click="removeFilter(f)"></button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "CFilter",
  props: ["availableFilters", "activeFilters", "filterVisible"],
  data() {
    return {
      autocomplete: ['proposal_id'],
      search: {
        proposal_id: '',
        challenge: '',
        assessor: ''
      }
    }
  },
  methods: {
    updateFilter(prop, value) {
      this.$emit("update-filter", prop, value);
    },
    removeFilter(f) {
      this.$emit("remove-filter", f);
    },
    getLabelValue(f) {
      return Object.keys(f.values)
        .find((key) => f.values[key] === f.value)
    },
    filteredDataArray(values, key) {
      return Object.keys(values).filter((option) => {
        return option
            .toString()
            .toLowerCase()
            .indexOf(this.search[key].toLowerCase()) >= 0
      })
    },
    updateAutocomplete(option, v) {
      if (option) {
        this.updateFilter(v, v.values[option])
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.tag .has-ellipsis {
  max-width: calc(100vw - 110px);
}
</style>
