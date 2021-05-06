<template>
  <div class="assessment-preview">
    <div class="info">
      <div class="label">Proposal:</div>
      <div class="value">{{proposal.title}}</div>
    </div>
    <div class="info">
      <div class="label">Rating:</div>
      <div class="value">
        <b-rate v-model="assessment.rating" disabled />
      </div>
    </div>
    <div class="info">
      <div class="value">
        <b-checkbox
          class="always-opaque"
          v-model="assessment.proposer_flag"
          type="is-warning"
          disabled>
          Flagged by Proposer
        </b-checkbox>
      </div>
    </div>
    <div class="info text">
      <div class="label">Assessment:</div>
      <div class="value">{{assessment.note}}</div>
    </div>
    <div class="info mt-3">
      <b-button
      class=""
        type="is-primary"
        tag="router-link"
        :to="{ name: 'assessment', params: { id: assessment.id } }"
      >
        Open</b-button>
    </div>
  </div>
</template>

<script>

import proposals from '../assets/data/proposals.json'

export default {
  data() {
    return {
      proposals: proposals,
    }
  },
  name: 'AssessmentPreview',
  props: ['assessment'],
  computed: {
    proposal() {
      if (this.assessment) {
        let filtered = this.proposals.filter(p => (p.id === parseInt(this.assessment.proposal_id)))
        if (filtered.length) {
          return filtered[0]
        }
      }
      return false
    }
  }
}
</script>

<style lang="scss">
.assessment-preview {
  padding: 10px 10px 20px 10px;
  display: flex;
  flex-direction: column;
  &:nth-child(2n + 1) {
    background: #f5f5f5;
  }
  .info {
    display: flex;
    .label {
      font-weight: bold;
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
