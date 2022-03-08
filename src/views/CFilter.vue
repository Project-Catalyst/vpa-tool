<template>
  <section class="filter pt-4 pb-4">
    <div class="filter-list box" v-if="filterVisible">
      <div
        class="single-filter is-expanded"
        v-for="(v, i) in availableFilters"
        :key="`filter-${v.key}-${i}`"
      >
        <b-field expanded :label="v.label">
          <b-select
            expanded
            :placeholder="v.label"
            :value="v.value"
            @input="setInputValue(v, $event)"
          >
            <option v-for="(vv, kk) in v.values" :value="vv" :key="vv">
              {{ kk }}
            </option>
          </b-select>
          <div class="filter-buttons exclude" v-if="hasNegation(v.key)"> 
            <b-button 
              type="is-success is-light"
              @click="inclusiveButton(v.key)"
              outlined>
              <span>Include</span>
              <b-icon icon="check"></b-icon>
            </b-button>
            <b-button 
              type="is-danger is-light" 
              style="margin-left:5px"
              @click="exclusiveButton(v.key)"
              outlined>
              <span>Exclude</span>
              <b-icon icon="close"></b-icon>
            </b-button>
          </div>
          <div class="filter-buttons search" v-else> 
            <b-button 
              type="is-primary is-light"
              style="width:215px"
              @click="inclusiveButton(v.key)"
              outlined>
              Search
            </b-button>
          </div>
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
      optionSelection: {},
      negOption: { // newly implemented availableFilters() have to be inserted here
        "proposer_mark": false,
        "proposal_id": true,
        "rating": true,
        "assessor": true,
        "note": false
      }
    };
  },
  methods: {
    hasNegation(filter_key){
      return this.negOption[filter_key]
    },
    setInputValue(prop, value){
      prop.value = value
      this.optionSelection[prop.key] = prop
    },
    inclusiveButton(filter_key) {
      this.$emit("update-filter", this.optionSelection[filter_key], false);
    },
    exclusiveButton(filter_key) {
      this.$emit("update-filter", this.optionSelection[filter_key], true);
    },
    removeFilter(f) {
      this.$emit("remove-filter", f);
    },
    getLabelValue(f) {
      let val = Object.keys(f.values).find((key) => f.values[key] === f.value)
      return f.negation
        ? "(NOT)"+val
        : val
    },
  },
};
</script>

<style lang="scss" scoped>
.tag .has-ellipsis {
  max-width: calc(100vw - 110px);
}
.single-filter {
  width: 100%;
}
.exclude {
  width: 20%;
  padding: .50rem;
  margin-top: 0px;
}
.search {
  width: 20%;
  padding: .50rem;
  margin-top: 0px
}
</style>
