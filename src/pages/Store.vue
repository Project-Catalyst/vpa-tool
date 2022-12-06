<script setup>
  import { ref } from 'vue'
  import { useAssessmentsStore } from '../store/assessments.js';
  import { useReviewsStore } from '../store/reviews.js';

  const assessments = useAssessmentsStore();
  const reviews = useReviewsStore();

</script>

<template>
  <div class="title">User Storage</div>
  <div class="subtitle">Find here all assessments you have revised. You may further edit your reviews, or export your work to a csv file.</div>

  <section>
    <o-loading
      :full-page="true"
      v-model:active="assessments.isLoading"
      :can-cancel="false"
    ></o-loading>

    <div v-if="!assessments.isLoading">
      <!-- header -->
      <o-notification id="header" variant="primary">
        <div class="columns is-multiline is-vcentered">
          <div class="label column is-full has-text-centered is-size-4 is-white m-0 p-0">Reviewed Assessments</div>
          <div class="column is-three-quarters p-0">
            <p class=""><b>Your progress:</b> {{reviews.count}} assessments reviewed ({{assessments.total}} total assessments)</p>
          </div>
          <div class="column is-one-quarter p-0">
            <div class="buttons is-right">
              <o-button variant="primary" outlined inverted> Export CSV </o-button>
            </div>
          </div>
        </div>
      </o-notification>

      <div v-if="reviews.hasReviews">
        <o-pagination
          :total="reviews.count"
          :per-page="assessments.pageSize"
          :range-before="3"
          :range-after="3"
          order="centered"
          size="default"
          v-model:current="page">
        </o-pagination>
        
        <assessment-preview v-bind:id="`ass-${assessment.id}`"
          v-for="assessment in paginatedItems"
          :key="`ass-${assessment.id}`"
          :assessment="assessment"
        />

        <o-pagination class="mt-3 mb-5"
          :total="reviews.count"
          :per-page="assessments.pageSize"
          :range-before="3"
          :range-after="3"
          order="centered"
          size="default"
          v-model:current="page">
        </o-pagination>
      </div>
      <div v-else>
        <div class="subtitle has-text-centered mb-5">You have no assessments reviewed yet</div>
      </div>
      
    </div>
  </section>
</template>

<script>
import AssessmentPreview from "../components/AssessmentPreview.vue";

export default {
  name: "Store",
  components: {
    AssessmentPreview,
  },
  data() {
    return {
      currentPage: 1
    }
  },
  computed: {
    page: {
      get() {
        return this.currentPage
      },
      set(newPage) {
        this.currentPage = newPage
        this.fetchData()
      }
    },
    paginatedItems() {
      return this.assessments.getStoredAssessments
    }
  },
  methods: {
    // async changePage(newPage) {
    //   this.$router.push({name: 'search', params: {page: newPage}})
    // },
    async fetchData() {
      await this.assessments.loadStoredAssessments(this.currentPage)
    }
  },
  created() {
    this.$watch(
      () => this.reviews.count,
      () => {
        this.fetchData()
      },
      { immediate: true }
    )
  },
}
</script>

<style lang="scss" scoped>
.assessment-preview {
  width: 100%;
  &:nth-child(2n + 1) {
    background: #f5f5f5;
  }
}
.is-white {
  color: white
}
</style>
