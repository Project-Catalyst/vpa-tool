<script setup>
import { ref } from 'vue'

const count = ref("FILTERS")
</script>

<template>
  <div class="title">ASSESSMENTS SEARCH</div>
  <div class="subtitle">Quick explanation about the assessments search engine</div>

  <section>
    <h1>{{ count }}</h1>
  </section>

  <section class="box">
    <h5> List of filtered assessments preview components</h5>
  </section>
</template>

<style scoped>
</style>
