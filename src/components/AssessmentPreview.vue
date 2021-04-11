<template>
  <div class="assessment-preview">
    <div class="info">
      <div class="label">Proposal:</div>
      <div class="value">{{assessment.proposal_id}}</div>
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

export default {
  name: 'AssessmentPreview',
  props: ['assessment']
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
