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
            @input="updateFilter(v, $event)"
          >
            <option v-for="(vv, kk) in v.values" :value="vv" :key="vv">
              {{ kk }}
            </option>
          </b-select>
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
  },
};
</script>

<style lang="scss" scoped>
.tag .has-ellipsis {
  max-width: calc(100vw - 110px);
}
</style>
