<script setup>
  import { onBeforeMount, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { useAssessmentsStore } from '../store/assessments.js';
  import { useReviewsStore } from '../store/reviews.js';

  const assessmentsStore = useAssessmentsStore();
  const reviews = useReviewsStore();

</script>

<template>
  <o-loading
    :full-page="false"
    v-model:active="isLoading"
    :can-cancel="false"
  ></o-loading>

  <div class="title">Assessment #{{assessment.id}}</div>

  <div class="box" v-if="loaded">
    <div class="columns">
      <div class="column is-three-fifths">
        <div class="subtitle"><b>Proposal:</b> {{assessment.Proposals.title}} <a :href="assessment.Proposals.url"  target="_blank">(See proposal in IdeaScale)</a>  </div>
        <div class="subtitle"><b>Challenge:</b> {{assessment.Challenges.title}}</div>
        <div class="subtitle"><b>Assessor:</b> {{assessment.Assessors.anon_id}}</div>
      </div>
      <div class="column">
        <div class="subtitle">
          <o-checkbox
            v-model="assessment.proposer_mark"
            variant="warning"
            disabled>
            Flagged by Proposer
          </o-checkbox>
        </div>      
        <div class="subtitle"><b>No. of vPAs reviews:</b> {{assessment.vpas_reviews}}</div>
      </div>
    </div>
    <p><b>Impact / Alignment</b> <o-icon icon="star" variant="warning"></o-icon> {{assessment.impact_rating}}</p>
    <p>{{assessment.impact_note}}</p>
    
    <br/>
    <p><b>Feasibility</b> <o-icon icon="star" variant="warning"></o-icon> {{assessment.feasibility_rating}}</p>
    <p>{{assessment.feasibility_note}}</p>

    <br/>
    <p><b>Auditability</b> <o-icon icon="star" variant="warning"></o-icon> {{assessment.auditability_rating}}</p>
    <p>{{assessment.auditability_note}}</p>
  </div>

  <!-- VERIFY WHY THIS MESSAGE -->
  <!-- <b-message
    v-if="profile.info.proposersRationaleVisible && fullAssessment.proposer_rationale"
    title="Proposer rationale" :closable="false">
    {{ fullAssessment.proposer_rationale }}
  </b-message> -->

  <div class="columns is-mobile is-centered">
    <section class="column is-narrow">
      <p class="title is-4">Your review of the assessment:</p>

      <o-button variant="success" size="large">Excellent</o-button>
      <o-button variant="primary" size="large">Good</o-button>
      <o-button variant="danger" size="large">Filtered out</o-button>

      <o-button class="column is-full" variant="warning" size="small" outlined>Clear review</o-button>

      <o-field label="Provide your rationale for filtered out OR your feedback to PA (recommended):">
        <o-input type="textarea"></o-input>
      </o-field>
      <!-- <b-tag icon="content-save-outline" v-if="assessment.id && fullAssessment.reviewed">
        {{saveStatus}}
      </b-tag> -->
    </section>
  </div>

  <div class="columns is-centered">
    <o-button class="mx-2 my-4" variant="primary">Go back to Search List</o-button>
    <o-button class="mx-2 my-4" variant="primary">Go to next assessment</o-button>
  </div>


</template>

<script>


export default {
  name: "Assessment",
  data() {
    return {
      loaded: false,
      assessment: {}
    }
  },
  async beforeMount() {
    this.assessment = await this.assessmentsStore.getAssessmentById(this.$route.params.id)
    this.loaded = true;
  },
  computed: {
    isLoading() {
      return !this.loaded
    }
  },
  methods: {
  }
}
</script>


<style scoped>
</style>
