<template>
  <div class="assessment-preview">
    <div class="info">
      <div class="label">Proposal:</div>
      <div class="value">{{proposal.title}}</div>
    </div>
    <div class="info text">
      <div class="label">Assessment:</div>
      <div class="value">{{assessment.note}}</div>
    </div>
    <div class="info">
      <div class="label">Proposer Mark:</div>
      <div class="value">{{assessment.proposer_flag}}</div>
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
  padding: 10px 0px 20px 0px;
  display: flex;
  flex-direction: column;
  &:nth-child(2n + 1) {
    background: #fff;
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
}
</style>
