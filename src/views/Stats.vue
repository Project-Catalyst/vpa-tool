<template>
  <div class="stats">
    <div class="community">
      <h2>Community</h2>
      <div class="stat">
        <div class="label">Flagged Assessments Reviewed</div>
        <div class="percentage">{{ flagAssessmentsReviewedPerc }}</div>
        <div class="tot">{{ flagAssessmentsReviewed }} out of {{ flagAssessmentsReviewedTot }}</div>
      </div>
      <div class="stat">
        <div class="label">Total Assessments Reviewed</div>
        <div class="percentage">{{ assessmentsReviewedPerc }}</div>
        <div class="tot">{{ assessmentsReviewed }} out of {{ assessmentsReviewedTot }}</div>
      </div>
    </div>
    <div class="community">
      <h2>Personal</h2>
      <div class="stat">
        <div class="label">Flagged Assessments Reviewed</div>
        <div class="percentage">{{ flagAssessmentsReviewedPerc }}</div>
        <div class="tot">{{ flagAssessmentsReviewed }} out of {{ flagAssessmentsReviewedTot }}</div>
      </div>
      <div class="stat">
        <div class="label">Total Assessments Reviewed</div>
        <div class="percentage">{{ assessmentsReviewedPerc }}</div>
        <div class="tot">{{ assessmentsReviewed }} out of {{ assessmentsReviewedTot }}</div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'CFilter'
}
</script>
