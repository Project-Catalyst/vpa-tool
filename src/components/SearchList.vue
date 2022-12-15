<script setup>
  import { ref } from 'vue';
  import { useAssessmentsStore } from '../store/assessments.js';
  import { useReviewsStore } from '../store/reviews.js';
  import { useFilterStore } from '../store/filters.js';

  const assessments = useAssessmentsStore();
  const reviews = useReviewsStore();
  const filters = useFilterStore();

</script>

<template>
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
              <o-select placeholder="Select a sorting method" expanded class="p-0 pl-2"
                v-model="selectedSorting"
                @update:modelValue="option => addSorting(option)">
                <option v-for="([key, value]) in filters.sortingOptions"
                  :key="key"
                  :value="[key, value]">
                  {{value}}
                </option>
              </o-select>
            </div>
          </div>
        </div>
      </o-notification>

      <div v-if="assessments.count !==0">
        <o-pagination
          :total="assessments.count"
          :per-page="assessments.pageSize"
          :range-before="3"
          :range-after="3"
          order="centered"
          size="default"
          v-model:current="currentPage">
        </o-pagination>
        
        <assessment-preview v-bind:id="`ass-${assessment.id}`"
          v-for="assessment in paginatedItems"
          :key="`ass-${assessment.id}`"
          :assessment="assessment"
        />

        <o-pagination class="mt-3 mb-5"
          :total="assessments.count"
          :per-page="assessments.pageSize"
          :range-before="3"
          :range-after="3"
          order="centered"
          size="default"
          v-model:current="currentPage">
        </o-pagination>
      </div>
      <div v-else>
        <div class="subtitle has-text-centered mb-5">No assessments found for this search</div>
      </div>
      
    </div>
  </section>
</template>

<script>
import AssessmentPreview from "./AssessmentPreview.vue";

export default {
  name: "SearchList",
  components: {
    AssessmentPreview,
  },
  created() {
    /** THIS HOOK CONTAINS ALL LOGIC TO TRIGGER DATA FETCH */
    this.$watch(  // watch the page changing
      () => this.$route.params,
      () => {
        this.fetchData()
      },
      { immediate: true }
    )
    this.$watch(  // watch the filters change
      () => this.filters.supabaseParam,
      () => {
        if(parseInt(this.$route.params.page)===1) {
          this.fetchData()
        } else {
          this.$router.push({name: 'search', params: {page: 1}})
        }
      },
      { immediate: true, deep: true }
    )
    this.$watch(  // watch sorting change
      () => this.filters.selectedSorting,
      (newVal, oldVal) => {
        if(newVal!==oldVal) {
          this.fetchData()
        }
      },
      { immediate: true, deep: true }
    )
  },
  data() {
    return {
      selectedSorting: this.filters.selectedSortingVmodel
    }
  },
  computed: {
    currentPage: {
      get() {
        return parseInt(this.$route.params.page)
      },
      set(newPage) {
        this.changePage(newPage)
      }
    },
    paginatedItems() {
      return this.assessments.getAssessments
    }
  },
  methods: {
    addSorting(option) {
      this.filters.setSorting(option)
    },
    async changePage(newPage) {
      this.$router.push({name: 'search', params: {page: newPage}})
    },
    async fetchData() {
      await this.assessments.loadAssessments(this.currentPage)
    }
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