<script setup>
import { ref } from 'vue';

const assessment = ref({
  title: "assessmentTitle",
  assessor: "assessmentAssessor",
  challenge: "assessmentChallenge",
  reviews: 3,
  proposer_mark: true,
  reviewed: true
})

const rating = ref(3.5)
const minRating = ref(0)
const maxRating = ref(5)

function goTo() {
  console.log("goTo")
}

</script>

<template>
  <div class="assessment-preview">
    <div class="columns is-multiline is-mobile m-0 p-2 pb-4">
      <div class="info column is-one-third">
        <div class="label mr-2">Proposal:</div>
        <div class="value">{{assessment.title}}</div>
      </div>
      <div class="info column is-one-third">
        <div class="label mr-2">Average Rating: </div>
        <div class="value">
          <!-- <b-rate v-model="rating" disabled /> -->
          <o-slider variant="primary" v-model="rating" :min="minRating" :max="maxRating" tooltipVariant="warning" tooltipAlways>
            <o-slider-tick :value="minRating">{{minRating}}</o-slider-tick>
            <o-slider-tick :value="maxRating">{{maxRating}}</o-slider-tick>
          </o-slider>
        </div>
      </div>
      <div class="info column is-one-third">
        <div class="label mr-2">Assessor:</div>
        <div class="value">{{assessment.assessor}}</div>
      </div>
      <div class="info column is-one-third">
        <div class="label mr-2">Challenge:</div>
        <div class="value">{{assessment.challenge}}</div>
      </div>
      <div class="info column is-one-third">
        <div class="value">
          <o-checkbox
            class="always-opaque"
            v-model="assessment.proposer_mark"
            variant="warning"
            disabled>
            Flagged by Proposer
          </o-checkbox>
        </div>
      </div>
      <div class="info column is-one-third">
        <div class="label mr-2">No. of vPAs reviews:</div>
        <div class="value">{{ (assessment.reviews) ? assessment.reviews : 0 }}</div>
      </div>
      <div class="info mt-3 column is-full">
        <o-button
          class="mr-6"
          variant="primary"
          @click="goTo()">
          Open
        </o-button>

        <o-checkbox
          class="always-opaque"
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
</style>