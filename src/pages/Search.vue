<script setup>
// import { ref } from 'vue';

import Filters from "../components/Filters.vue";
import Sortings from "../components/Sortings.vue";
import SearchList from "../components/AssessmentsList.vue";

// const count = ref("FILTERS")
</script>

<template>
  <section>
    <div class="title">ASSESSMENTS SEARCH</div>
    <div class="subtitle">Quick explanation about the assessments search engine</div>

    <section>
      <o-button variant="primary" expanded>Open Filters</o-button>
      <filters/>

      <o-button variant="primary" expanded>Open Sortings</o-button>
      <sortings/>
    </section>

    <search-list/>
  </section>
  
</template>

<style scoped>
</style>
