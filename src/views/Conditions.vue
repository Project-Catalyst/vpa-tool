<template>
  <div class="conditions container">
    <section>
      <div class="filters p-4">
        <b-button expanded @click="filterVisible = !filterVisible"
          >Choose Filters</b-button
        >
        <c-filter
          :filterVisible="'true'"
          :activeFilters="activeFilters"
          :availableFilters="availableFilters"
          @remove-filter="removeFilter"
          @update-filter="updateFilter"
        />
      </div>
      <b-field class="p-4">
        <b-radio-button
          v-model="activePrefilter"
          v-for="(el, i) in prefilters"
          v-on:input="setList(el)"
          :native-value="el.v"
          :key="i"
          size="is-small"
          expanded
          >{{ el.label }}</b-radio-button
        >
      </b-field>
      <div class="notification is-primary mb-6">
        <div class="mb-3">Your progress: {{localTot}}/{{fullCount}}</div>
        <div class="buttons">
          <b-button type="is-primary" inverted @click="getNext">Next</b-button>
          <b-button
            type="is-primary"
            inverted
            outlined
            @click="toggleList"
            >{{ showListLabel }}</b-button
          >
        </div>
      </div>
      <div class="assessments-list" v-if="listVisible">
        <assessment-preview
          v-for="(assessment, idx) in renderedList"
          :key="`ass-${assessment.id}`"
          :idx="idx"
          :assessment="assessment"
        />
        <div
          class="button"
          @click="incrementSlice"
          v-if="currentSlice < filteredCount"
        >
          Load more...
        </div>
      </div>
    </section>
    <router-view class="sub-view" />
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import AssessmentPreview from "@/components/AssessmentPreview";
import CFilter from "@/views/CFilter";
import proposals from "../assets/data/proposals.json";
import categories from "../assets/data/categories.json";
import assessors from "../assets/data/assessors.json";

export default {
  name: "Conditions",
  components: {
    AssessmentPreview,
    CFilter,
  },
  data() {
    return {
      proposals: proposals,
      assessors: assessors,
      categories: categories,
      interval: false,
      prefilters: [
        { label: "Random", v: "randomAssessments" },
        { label: "Low reviewed (from other vCAs)", v: "lowReviewed" },
        { label: "No reviews (from other vCAs)", v: "noReviewed" },
        { label: "All", v: "filteredAssessments" },
      ],
    };
  },
  computed: {
    ...mapState({
      assessments: (state) => state.assessments.indexed,
      reviewed: (state) => state.assessments.reviewed,
      listAssessments: (state) => state.assessments.all,
      activeFilters: (state) => state.assessments.activeFilters,
      activePrefilter: (state) => state.assessments.activePrefilter,
      currentIndex: (state) => state.assessments.currentIndex,
      currentSlice: (state) => state.assessments.currentSlice,
      listVisible: (state) => state.assessments.listVisible
    }),
    ...mapGetters("assessments", ["renderedList", "filteredCount", "fullCount"]),
    proposalsById() {
      return this.proposals.reduce(
        (obj, item) => Object.assign(obj, { [item.title]: item.id }),
        {}
      );
    },
    categoriesByTitle() {
      return this.categories.reduce(
        (obj, item) => Object.assign(obj, { [item.title]: item.title }),
        {}
      );
    },
    localTot() {
      return this.reviewed.length
    },
    availableFilters() {
      return {
        proposer_mark: {
          key: "proposer_mark",
          label: "Flagged by proposers",
          comparison: 'same',
          type: 'select',
          value: "",
          values: {
            "Flagged": true,
            "Not flagged": false,
          },
        },
        proposal_id: {
          key: "proposal_id",
          label: "Proposal",
          comparison: 'sameInt',
          type: 'autocomplete',
          value: false,
          values: this.proposalsById,
        },
        challenge: {
          key: "challenge",
          label: "Challenge",
          comparison: 'same',
          type: 'autocomplete',
          value: false,
          values: this.categoriesByTitle,
        },
        rating: {
          key: "rating",
          label: "Average Rating",
          comparison: 'sameAvg',
          type: 'select',
          value: false,
          values: { "1": 1, "2": 2, "3": 3, "4": 4, "5": 5 },
        },
        assessor: {
          key: "assessor",
          label: "Assessor",
          comparison: 'same',
          type: 'autocomplete',
          value: "",
          values: this.assessors,
        },
        lenLess: {
          key: "note",
          label: "Length less than",
          comparison: 'lengthLess',
          type: 'select',
          value: false,
          values: { "40": 40, "90": 90, "180": 180, "270": 270, "600": 600 },
        },
        lenGreater: {
          key: "note",
          label: "Length greater than",
          comparison: 'lengthGreater',
          type: 'select',
          value: false,
          values: { "90": 90, "180": 180, "270": 270, "600": 600 },
        },
      };
    },
    showListLabel() {
      return (this.showList) ? 'Close list' : 'Show list'
    }
  },
  methods: {
    setList() {
      this.remoteUpdate()
      this.$store.commit('assessments/setSlice', 100)
      this.$store.commit('assessments/setIndex', 0)
    },
    getNext() {
      this.$store.dispatch('assessments/getNext')
    },
    incrementSlice() {
      this.$store.commit('assessments/incrementSlice')
    },
    updateFilter(prop, value) {
      this.$store.commit('assessments/addFilter', {
        prop,
        value
      })
      this.setList();
    },
    removeFilter(f) {
      this.$store.commit('assessments/removeFilter', f)
      this.setList();
    },
    toggleList() {
      this.$store.commit('assessments/toggleList')
    },
    remoteUpdate() {
      this.$store.dispatch("assessments/getReviewsCount");
    },

  },
  mounted() {
    this.remoteUpdate()
    this.interval = setInterval(() => {
      this.remoteUpdate()
      //this.updateList()
    }, 10 * 60 * 1000)
  },
  destroyed() {
    clearInterval(this.interval)
  }
};
</script>
<style lang="scss" scoped>
.conditions {
  display: flex;
  flex-direction: column;
  .assessments-list {
    flex-grow: 1;
    //overflow: auto;
  }
}
</style>
