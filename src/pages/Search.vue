<script setup>
// import { ref } from 'vue';
  import { useFilterStore } from '../store/filters.js'

  const filters = useFilterStore()

</script>

<template>
  <section>
    <div class="title"> {{ $t("search.TITLE") }} </div>
    <div class="subtitle" v-html="$t('search.DESCRIPTION')"></div>

    <section id="filters">
      <o-collapse v-model:open="isFilterOpen" class="my-4">
        <template #trigger>
          <o-button variant="primary" expanded>
            {{ btnFilterMsg }}
          </o-button>
        </template>
        <div class="notification">
          <filters/>
        </div>
      </o-collapse>
    </section>

    <section v-if="filters.hasActiveFilters" id="active-filters" class="mb-5">
      <o-notification>
        <div class="subtitle has-text-centered"><b>Active Filters</b></div>
      </o-notification>
    </section>

    <search-list/>
  </section>
  
</template>

<script>
import Filters from "../components/Filters.vue";
import SearchList from "../components/SearchList.vue";

export default {
  name: "Search",
  components: {
    Filters,
    SearchList
  },
  data() {
    return {
      isFilterOpen: false,
      isSortingOpen: false
    }
  },
  computed: {
    currentPage() {
      return this.$route.params.page
    },
    btnFilterMsg() {
      return (this.isFilterOpen)
      ? "Close Filters"
      : "Choose Filters"
    },
  }
}
</script>

<style scoped>
</style>
