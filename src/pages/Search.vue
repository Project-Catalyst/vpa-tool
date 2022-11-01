<script setup>
// import { ref } from 'vue';

// const count = ref("FILTERS")
</script>

<template>
  <section>
    <div class="title"> {{ $t("search.TITLE") }} </div>
    <div class="subtitle" v-html="$t('search.DESCRIPTION')"></div>

    <section id="filters">
      <o-collapse v-model:open="isFilterOpen">
        <template #trigger>
          <o-button variant="primary" expanded>
            {{ btnFilterMsg }}
          </o-button>
        </template>
        <div class="notification">
          <filters/>
        </div>
      </o-collapse>

      <o-collapse v-model:open="isSortingOpen">
        <template #trigger>
          <o-button variant="primary" expanded>
            {{ btnSortingMsg }}
          </o-button>
        </template>
        <div class="notification">
          <sortings/>
        </div>
      </o-collapse>
      
    </section>

    <search-list/>
  </section>
  
</template>

<script>
import Filters from "../components/Filters.vue";
import Sortings from "../components/Sortings.vue";
import SearchList from "../components/AssessmentsList.vue";

export default {
  name: "Search",
  components: {
    Filters, 
    Sortings,
    SearchList
  },
  data() {
    return {
      isFilterOpen: false,
      isSortingOpen: false
    }
  },
  computed: {
    btnFilterMsg() {
      return (this.isFilterOpen)
      ? "Close Filters"
      : "Open Filters"
    },
    btnSortingMsg() {
      return (this.isSortingOpen)
      ? "Close Sorting Options"
      : "Open Sorting Options"
    },
  }
}
</script>

<style scoped>
</style>
