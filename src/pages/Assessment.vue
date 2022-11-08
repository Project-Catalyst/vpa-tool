<script setup>
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
        <div class="subtitle"><b>Proposal:</b> {{assessment.Proposals.title}} <small><a :href="assessment.Proposals.url"  target="_blank">(See proposal in IdeaScale)</a></small>  </div>
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

  <div class="columns is-mobile is-centered">
    <section class="column is-narrow">
      <p class="title is-4">Your review of the assessment:</p>

      <div class="column is-full">
        <o-button variant="success" size="large" @click="setReviewClass('excellent')"   :outlined="isOutlined('excellent')">
          <o-icon icon="heart"></o-icon> &nbsp; Excellent
        </o-button>
        <o-button variant="primary" size="large" @click="setReviewClass('good')"        :outlined="isOutlined('good')">
          <o-icon icon="check"></o-icon> &nbsp; Good
        </o-button>
        <o-button variant="danger"  size="large" @click="setReviewClass('filteredout')" :outlined="isOutlined('filteredout')">
          <o-icon icon="close"></o-icon> &nbsp; Filtered out
        </o-button>
      </div>

      <o-field class="mt-5" v-if="isReviewed"
        label="Provide your rationale for filtered out OR your feedback to PA (recommended):">
        <o-input type="textarea" v-model="debouncedRationale" @update:modelValue="rationaleStatus=false"></o-input>
      </o-field>
      <span v-if="rationaleStatus && isReviewed"><o-icon icon="check" size="small"></o-icon> <small>Feedback saved locally</small></span>

      <o-button v-if="isReviewed" class="column py-0 is-one-fifth is-offset-two-fifths" variant="warning" size="small" @click="clearReview()">Clear review</o-button>
    </section>
  </div>

  <div class="columns is-centered">
    <o-button class="mx-2 my-4" variant="primary" @click="goToSearchList()">Go back to Search List</o-button>
    <o-button class="mx-2 my-4" variant="primary" @click="goToNextAssessment()">Go to next assessment</o-button>
  </div>


</template>

<script>
import _ from 'lodash';

export default {
  name: "Assessment",
  created() {
    this.$watch(
      () => this.$route.params,
      async (toParams, previousParams) => {
        if (toParams.id !== previousParams.id) {
          this.assessment = await this.assessmentsStore.getAssessmentById(toParams.id)
        }
      }
    )
  },
  async beforeMount() {
    this.assessment = await this.assessmentsStore.getAssessmentById(this.$route.params.id)
    this.loaded = true;
  },
  data() {
    return {
      loaded: false,
      assessment: {},
      rationaleStatus: true
    }
  },
  computed: {
    isLoading() {
      return !this.loaded
    },
    isReviewed() {
      return this.reviews.isReviewed(this.assessment.id)
    },
    reviewClass: {
      get() {
        return (this.isReviewed) 
          ? this.reviews.getReview(this.assessment.id).review
          : ''
      },
      set(val) {
        this.reviews.setReview(this.assessment.id, val)
        this.reloadAssessment(this.assessment.id)
      }
    },
    debouncedRationale: {
      get() {
        return this.reviews.getReview(this.assessment.id).rationale
      },
      set: _.debounce(function (val) {
        this.reviews.updateRationale(this.assessment.id, val)
        this.rationaleStatus = true
      }, 500)
    }
  },
  methods: {
    async loadAssessment(id) {
      this.loaded = false;
      this.assessment = await this.assessmentsStore.getAssessmentById(id)
      this.loaded = true;
    },
    async reloadAssessment(id)  {
      let new_assessment = await this.assessmentsStore.getAssessmentById(id)
      this.assessment = new_assessment
    },
    setReviewClass(reviewClass) {
      this.reviewClass = reviewClass
    },
    clearReview() {
      this.reviews.removeReview(this.assessment.id)
      this.reloadAssessment(this.assessment.id)
    },
    isOutlined(btnType) {
      if (!this.reviewClass) {
        return true
      }
      return (btnType === this.reviewClass) ? false : true
    }, 
    goToSearchList() {
      this.$router.push({name: 'search'})
    },
    goToNextAssessment() {
      let nextId = this.assessmentsStore.getNextAssessmentId(this.assessment.id)
      this.$router.push({name: 'assessment', params: {id: nextId}})
    }
  }
}
</script>


<style scoped>
</style>
