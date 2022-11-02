<script setup>
import { ref } from 'vue';

const assessment = ref({
  id: 1,
  proposal: "assessmentTitle",
  assessor: "assessmentAssessor",
  challenge: "assessmentChallenge",
  rating: 3.5,
  reviews: 3,
  proposer_mark: true,
  reviewed: true
})

function goTo() {
  console.log("goTo")
}

</script>

<template>
  <div class="assessment-preview">
    <div class="columns is-multiline is-mobile m-0 p-2 pb-4">

      <div class="label column is-full my-0 pb-1 pt-0">Assessment ID: #{{assessment.id}}</div>

      <div class="column is-one-third py-0">
        <div class="label inline mr-2">Assessor:</div>
        <div class="value inline">{{assessment.assessor}}</div>
      </div>

      <div class="column is-one-third py-0">
        <div class="label inline mr-2">Average Rating: </div>
        <div class="value inline"> {{assessment.rating}} </div>
      </div>

      <div class="column is-one-third py-0">
        <div class="label inline mr-2">No. of vPAs reviews:</div>
        <div class="value inline">{{ (assessment.reviews) ? assessment.reviews : 0 }}</div>
      </div>

      <div class="column is-two-thirds py-0">
        <div class="label inline mr-2">Proposal:</div>
        <div class="value inline">{{assessment.proposal}}</div>
      </div>

      <div class="column is-one-third py-0">
        <o-checkbox
          class="always-opaque"
          v-model="assessment.proposer_mark"
          variant="warning"
          disabled>
          Flagged by Proposer
        </o-checkbox>
      </div>

      <div class="column is-one-third py-0">
        <div class="label inline mr-2">Challenge:</div>
        <div class="value inline">{{assessment.challenge}}</div>
      </div>

      <div class="column is-full py-0">
        <o-button
          class="mr-6"
          variant="primary"
          @click="goTo()">
          Open
        </o-button>
        <o-checkbox
          class="always-opaque pt-2"
          v-model="assessment.reviewed"
          variant="warning"
          disabled>
          Already reviewed
        </o-checkbox>
      </div>

    </div>
  </div>
</template>

<style scoped>
.inline {
  display: inline-block;
}
.content.is-vcentered {
  display: flex;
  flex-wrap: wrap;
  align-content: center; /* used this for multiple child */
  align-items: center; /* if an only child */
}
</style>