<template>
  <div class="filter">
    <div class="filter-list" v-if="filterVisible">
      <div class="single-filter" v-for="v, i in availableFilters" :key="`filter-${v.key}-${i}`">
        {{v.label}}:
        <select :value="v.value" @input="updateFilter(v, $event)">
          <option v-for="(vv, kk) in v.values" :value="vv" :key="vv">
            {{kk}}
          </option>
        </select>
      </div>
    </div>
    <div class="active-filters" v-if="activeFilters.length">
      <div class="heading">Selected filter</div>
      <div class="single-filter" v-for="f in activeFilters" :key="`active-${f.key}-${f.value}`">
        {{f.label}}: {{getLabelValue(f)}} <span class="remove" @click="removeFilter(f)">X</span>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'CFilter',
  props: ['availableFilters', 'activeFilters', 'filterVisible'],
  methods: {
    updateFilter(prop, $event) {
      this.$emit('update-filter', prop, $event.target.value)
    },
    removeFilter(f) {
      this.$emit('remove-filter', f)
    },
    getLabelValue(f) {
      const ret = Object.keys(f.values).find(key => f.values[key] === parseInt(f.value));
      return ret
    }
  }
}
</script>

<style lang="scss" scoped>
.filter {
  .filter-list {
    width: 100%;
    .single-filter {
      width: 100%;
      display: flex;
      margin-bottom: 10px;
      justify-content: space-between;
      select {
        margin-left: 10px;
        flex-grow: 1;
        font-size: 14px;
        max-width: 80%;
        font-family: Avenir, Helvetica, Arial, sans-serif;
      }
    }
  }
  .active-filters {
    padding: 10px;
    border: 2px solid #000;
    background: #fff;
    .heading {
      font-weight: bold;
      font-size: 12px;
    }
    .single-filter {
      background: #baffb2;
      padding: 3px;
      font-size: 13px;
      font-weight: bold;
      display: inline-block;
      .remove {
        font-size: 10px;
        font-weight: bold;
        cursor: pointer;
      }
    }
  }
}
</style>
