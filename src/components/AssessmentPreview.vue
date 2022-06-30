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
          <b-rate v-model="rating" disabled />
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
          <b-checkbox
            class="always-opaque"
            v-model="assessment.proposer_mark"
            type="is-warning"
            disabled>
            Flagged by Proposer
          </b-checkbox>
        </div>
      </div>
      <div class="info column is-one-third">
        <div class="label mr-2">No. of vPAs reviews:</div>
        <div class="value">{{ (assessment.reviews) ? assessment.reviews : 0 }}</div>
      </div>
      <div class="info mt-3 column is-full">
        <b-button
          class="mr-6"
          type="is-primary"
          @click="goTo"
        >
          Open</b-button>

          <b-checkbox
            class="always-opaque"
            v-model="assessment.reviewed"
            type="is-warning"
            disabled>
            Already reviewed
          </b-checkbox>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
    }
  },
  name: 'AssessmentPreview',
  props: ['assessment'],
  computed: {
    rating() {
      return Math.round((this.assessment.auditability_rating + this.assessment.feasibility_rating + this.assessment.impact_rating) / 3)
    }
  },
  methods: {
    goTo() {
      this.$store.dispatch('assessments/goTo', this.assessment.id)
    }
  }
}
</script>

<style lang="scss">
.assessment-preview {
  width: 100%;
  &:nth-child(2n + 1) {
    background: #f5f5f5;
  }
  .info {
    display: flex;
    padding: 5px 5px 0 5px !important;
    box-sizing: border-box !important;
    .label {
      font-weight: bold;
      margin-bottom: 0 !important;
    }
    &.text {
      flex-wrap: wrap;
      .value {
        width: 100%;
        font-size: 13px;
      }
    }
  }
  .always-opaque {
    opacity: 1 !important;
  }
}
</style>
