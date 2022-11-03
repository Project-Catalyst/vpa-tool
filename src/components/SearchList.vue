<script setup>
  import { ref } from 'vue';
  import { useAssessmentsStore } from '../store/assessments.js';
  import { useReviewsStore } from '../store/reviews.js';

  const assessments = useAssessmentsStore();
  const reviews = useReviewsStore();

  const sortingOptions = ['Randomize', 'Alphabetically', 'Higher Ratings', 'Most reviewed']

  function getNext() {
    console.log("getNext")
  }

</script>

<template>
  <section>

    <!-- header -->
    <o-notification id="header" variant="primary">
      <div class="columns is-multiline is-vcentered">
        <div class="label column is-full has-text-centered is-size-4 is-white m-0 p-0">Search Results</div>
        <div class="column is-three-quarters p-0">
          <p class="" ><b>Your progress:</b> {{reviews.count}} assessments reviewed</p>
          <p class=""><b>Filtered results:</b> {{assessments.count}}/{{assessments.total}} assessments</p> 
        </div>
        <div class="column is-one-quarter p-0 columns is-multiline">
          <div class="column is-full p-0">
            <p><b>Sorting Options</b></p>
          </div>
          <div class="column is-full p-0 mb-2">
            <o-select placeholder="Select a sorting method" expanded class="p-0 pl-2">
              <option v-for="(sortingMethod, index) in sortingOptions"
                :key="index"
                :value="sortingMethod">
                {{sortingMethod}}
              </option>
            </o-select>
          </div>
        </div>
      </div>
    </o-notification>

    <!-- Assessment's preview list -->
    <o-pagination
      :total="assessments.total"
      v-model:current="paginationCurrentPage"
      :per-page="paginationItemsPerPage"
      :range-before="3"
      :range-after="3"
      order="centered"
      size="default"
      @update:current="changePage()">
    </o-pagination>
    
    <!-- <o-loading v-model:active="isLoading"></o-loading> -->
    <assessment-preview
      v-for="assessment in paginatedItems"
      :key="`ass-${assessment.id}`"
      :assessment="assessment"
    />

    <o-pagination class="mt-3 mb-5"
      :total="assessments.total"
      v-model:current="paginationCurrentPage"
      :per-page="paginationItemsPerPage"
      :range-before="3"
      :range-after="3"
      order="centered"
      size="default"
      @update:current="changePage()">
    </o-pagination>
  </section>
</template>

<script>
import AssessmentPreview from "./AssessmentPreview.vue";
import $ from "jquery";
// import Sortings from "../components/Sortings.vue";

export default {
  name: "SearchList",
  components: {
    AssessmentPreview,
  },
  data() {
    return {
      paginationCurrentPage: 1,
      paginationItemsPerPage: this.assessments.fetchSize,
    }
  },
  mounted() {
    this.assessments.loadAssessments(this.paginationCurrentPage)
  },
  computed: {
    isLoading() {
      return !this.assessments.available
    },
    paginatedItems() {
      return this.assessments.getAssessments
    }
  },
  methods: {
    async changePage() {
      await this.assessments.loadAssessments(this.paginationCurrentPage)
      $([document.documentElement, document.body]).animate({
          scrollTop: $("#header").offset().top
      }, 1000);
    }
  }
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