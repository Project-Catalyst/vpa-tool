<template>
  <div class="conditions container">
    <div class="filters p-4">
      <b-button expanded @click="filterVisible = !filterVisible"
        >Choose Filters</b-button
      >
      <c-filter
        :filterVisible="filterVisible"
        :activeFilters="activeFilters"
        :availableFilters="availableFilters"
        @remove-filter="removeFilter"
        @update-filter="updateFilter"
      />
    </div>
    <b-field class="p-4">
      <b-radio-button
        v-model="prefilter"
        v-for="(el, i) in prefilters"
        v-on:input="setList(el)"
        :native-value="el.v"
        :key="i"
        size="is-small"
        expanded
        >{{ el.label }}</b-radio-button
      >
    </b-field>
    <div class="button" @click="getNext">
      Next
    </div>
    <div class="button" @click="showList = !showList">Show list</div>
    <div class="assessments-list" v-if="showList">
      <assessment-preview
        v-for="assessment in renderedList"
        :key="`ass-${assessment.id}`"
        :assessment="assessment"
      />
      <div
        class="button"
        @click="currentSlice = currentSlice + 100"
        v-if="currentSlice < currentList.length"
      >
        Load more...
      </div>
    </div>
    <router-view class="sub-view" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import shuffle from "@/utils/shuffle";
import AssessmentPreview from "@/components/AssessmentPreview";
import CFilter from "@/views/CFilter";
import { EventBus } from "./../EventBus";
import proposals from "../assets/data/proposals.json";
import questions from "../assets/data/questions.json";

export default {
  name: "Conditions",
  components: {
    AssessmentPreview,
    CFilter,
  },
  data() {
    return {
      proposals: proposals,
      questions: questions,
      prefilters: [
        { label: "Random", v: "randomAssessments" },
        { label: "Low reviewed", v: "lowReviewed" },
        { label: "No reviews", v: "noReviewed" },
        { label: "All", v: "filteredAssessments" },
      ],
      filterVisible: false,
      activeFilters: [],
      currentPrefilter: false,
      currentList: [],
      currentIndex: 0,
      currentSlice: 100,
      showList: false,
      prefilter: "filteredAssessments",
    };
  },
  computed: {
    ...mapState({
      assessments: (state) => state.assessments.all,
    }),
    filteredAssessments() {
      return this.activeFilters.length
        ? this.customFilter(this.assessments, this.activeFilters)
        : this.assessments;
    },
    randomAssessments() {
      return shuffle(this.filteredAssessments);
    },
    lowReviewed() {
      return this.filteredAssessments
        .filter((el) => el.no_assessments <= 4)
        .sort((a, b) => a.no_assessments - b.assessments);
    },
    noReviewed() {
      return this.filteredAssessments.filter((el) => el.no_assessments === 0);
    },
    renderedList() {
      return this.currentList.slice(0, this.currentSlice);
    },
    proposalsById() {
      return this.proposals.reduce(
        (obj, item) => Object.assign(obj, { [item.title]: item.id }),
        {}
      );
    },
    questionsById() {
      return this.questions.reduce(
        (obj, item) => Object.assign(obj, { [item.title]: item.id }),
        {}
      );
    },
    availableFilters() {
      return {
        proposer_flag: {
          key: "proposer_flag",
          label: "Flagged by proposers",
          comparision: (a, v) => a === v,
          value: false,
          values: {
            All: false,
            Flagged: "1",
            "Not flagged": "0",
          },
        },
        proposal_id: {
          key: "proposal_id",
          label: "Proposal",
          comparision: (a, v) => a === v,
          value: false,
          values: this.proposalsById,
        },
        question_id: {
          key: "question_id",
          label: "Question",
          comparision: (a, v) => a === v,
          value: false,
          values: this.questionsById,
        },
        rating: {
          key: "rating",
          label: "Rating",
          comparision: (a, v) => a === v,
          value: false,
          values: { "1": 1, "2": 2, "3": 3, "4": 4, "5": 5 },
        },
        lenLess: {
          key: "note",
          label: "Length less than",
          comparision: (a, v) => {
            return v ? v.length <= a : false;
          },
          value: false,
          values: { "90": 90, "180": 180, "270": 270, "10000": 10000 },
        },
        lenGreater: {
          key: "note",
          label: "Length greater than",
          comparision: (a, v) => {
            return v ? v.length >= a : false;
          },
          value: false,
          values: { "90": 90, "180": 180, "270": 270, "10000": 10000 },
        },
      };
    },
  },
  methods: {
    setList(el) {
      this.currentSlice = 100;
      this.currentIndex = 0;
      this.currentPrefilter = el;
      this.currentList = this[el.v];
    },
    getNext() {
      this.$router.push({
        name: "assessment",
        params: { id: this.currentList[this.currentIndex].id },
      });
      this.currentIndex = this.currentIndex + 1;
    },
    updateFilter(prop, value) {
      const newFilter = Object.assign({}, prop);
      newFilter.value = value;
      this.activeFilters.push(newFilter);
      this.setList(this.currentPrefilter);
    },
    removeFilter(f) {
      const idx = this.activeFilters.indexOf(f);
      if (idx > -1) {
        this.activeFilters.splice(idx, 1);
        this.setList(this.currentPrefilter);
      }
    },
    customFilter(data, filters) {
      const [current, ...newFilters] = filters;
      const filtered = data.filter((el) =>
        current.comparision(current.value, el[current.key])
      );
      if (filters.length > 1) {
        return this.customFilter(filtered, newFilters);
      } else {
        return filtered;
      }
    },
  },
  mounted() {
    this.setList({ label: "All", v: "filteredAssessments" });
    EventBus.$on("next-assessment", this.getNext);
  },
};
</script>
<style lang="scss" scoped>
.conditions {
  display: flex;
  flex-direction: column;
  .assessments-list {
    flex-grow: 1;
    overflow: auto;
  }
}
</style>
