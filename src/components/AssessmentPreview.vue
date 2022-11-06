<script setup>
</script>

<template>
  <div class="assessment-preview">
    <div class="columns is-multiline is-mobile m-0 p-2 pb-4">

      <div class="label column is-full my-0 pb-1 pt-0">Assessment ID: #{{assessment.id}}</div>

      <div class="column is-one-third py-0">
        <div class="label inline mr-2">Assessor:</div>
        <div class="value inline">{{assessment.Assessors.anon_id}}</div>
      </div>

      <div class="column is-one-third py-0">
        <div class="label inline mr-2">Average Rating: </div>
        <div class="value inline"> {{rating}} </div>
      </div>

      <div class="column is-one-third py-0">
        <div class="label inline mr-2">No. of vPAs reviews:</div>
        <div class="value inline">{{assessment.vpas_reviews}}</div>
      </div>

      <div class="column is-two-thirds py-0">
        <div class="label inline mr-2">Proposal:</div>
        <div class="value inline">{{assessment.Proposals.title}}</div>
      </div>

      <div class="column is-one-third py-0">
        <o-checkbox
          v-model="assessment.proposer_mark"
          variant="warning"
          disabled>
          Flagged by Proposer
        </o-checkbox>
      </div>

      <div class="column is-one-third py-0">
        <div class="label inline mr-2">Challenge:</div>
        <div class="value inline">{{assessment.Challenges.title}}</div>
      </div>

      <div class="column is-full py-0">
        <o-button
          class="mr-6"
          variant="primary"
          @click="openAssessment()">
          Open
        </o-button>
        <o-checkbox
          class="pt-2"
          v-model="reviewed"
          variant="warning"
          disabled>
          Already reviewed
        </o-checkbox>
      </div>

    </div>
  </div>
</template>

<script>

export default {
  name: "AssessmentPreview",
  props: ['assessment'],
  data() {
    return {
    }
  },
  created() {
    if (this.assessment.Challenges === null) {
      this.assessment.Challenges = {
        id: null,
        title: '(No Challenge identification provided)'
      }
    }
    if (this.assessment.Proposals === null) {
      this.assessment.Proposals = {
        id: null,
        title: '(No Proposal identification provided)'
      }
    }
  },
  computed: {
    rating() {
      return ((this.assessment.auditability_rating + this.assessment.feasibility_rating + this.assessment.impact_rating)/3)
        .toLocaleString(undefined, {maximumFractionDigits: 2})
    },
    reviewed() {
      return false
    }
  },
  methods: {
    openAssessment() {
      this.router
    }
  }
}
</script>

<style scoped>
  .inline {
    display: inline-block;
  }
</style>