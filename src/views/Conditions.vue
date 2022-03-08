<template>
  <div class="conditions container">
    <section>
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
      <div class="notification is-primary mb-6">
        <div class="mb-3">Your progress: {{localTot}}/{{listAssessments.length}}</div>
        <div class="buttons">
          <b-button type="is-primary" inverted @click="getNext">Next</b-button>
          <b-button
            type="is-primary"
            inverted
            outlined
            @click="showList = !showList"
            >{{ showListLabel }}</b-button
          >
        </div>
      </div>
      <div class="assessments-list" v-if="showList">
        <assessment-preview
          v-for="(assessment, idx) in renderedList"
          :key="`ass-${assessment.id}`"
          :idx="idx"
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
    </section>
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
import assessors from "../assets/data/assessors.json";
import originalAssessments from "../assets/data/assessments.csv";

export default {
  name: "Conditions",
  components: {
    AssessmentPreview,
    CFilter,
  },
  data() {
    return {
      originalAssessments: originalAssessments,
      proposals: proposals,
      assessors: assessors,
      prefilters: [
        { label: "Random", v: "randomAssessments" },
        { label: "Low reviewed (from other vCAs)", v: "lowReviewed" },
        { label: "No reviews (from other vCAs)", v: "noReviewed" },
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
      interval: false
    };
  },
  computed: {
    ...mapState({
      assessments: (state) => state.assessments.indexed,
      listAssessments: (state) => state.assessments.all
    }),
    fullAssessments() {
      const localAssessments = this.assessments
      return this.originalAssessments.map(item => ({
        ...item,
        ...localAssessments[item.id],
      }));
    },
    filteredAssessments() {
      return this.activeFilters.length
        ? this.customFilter(this.fullAssessments, this.activeFilters)
        : this.fullAssessments;
    },
    randomAssessments() {
      return shuffle(this.filteredAssessments);
    },
    lowReviewed() {
      return this.filteredAssessments
        .filter((el) => el.reviews <= 4)
        .sort((a, b) => a.reviews - b.reviews);
    },
    noReviewed() {
      return this.filteredAssessments.filter(
        (el) => (el.reviews === 0) || (!el.reviews)
      );
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
    localTot() {
      let tot = 0
      const keys = Object.keys(this.assessments);
      keys.forEach((key) => {
        let ass = this.assessments[key]
        if (ass.excellent || ass.good || ass.not_valid) {
          tot = tot + 1
        }
      });
      return tot
    },
    availableFilters() {
      return {
        proposer_mark: {
          key: "proposer_mark",
          label: "Flagged by proposers",
          nagation: false,
          comparision: (a, v) => a === v,
          value: "",
          values: {
            "Flagged": true,
            "Not flagged": false,
          },
        },
        proposal_id: {
          key: "proposal_id",
          label: "Proposal",
          nagation: false,
          comparision: (a, v, neg) => {
            return neg
            ? parseInt(a) !== parseInt(v)
            : parseInt(a) === parseInt(v)
          },
          value: false,
          values: this.proposalsById,
        },
        rating: {
          key: "rating",
          label: "Average Rating",
          nagation: false,
          comparision: (a, v, neg, el) => {
            v = Math.round((el.auditability_rating + el.feasibility_rating + el.impact_rating) / 3);
            return neg
              ? parseInt(a) !== v
              : parseInt(a) === v
          },
          value: false,
          values: { "1": 1, "2": 2, "3": 3, "4": 4, "5": 5 },
        },
        assessor: {
          key: "assessor",
          label: "Assessor",
          nagation: false,
          comparision: (a, v, neg) => {
            return neg
              ? a !== v
              : a === v
          },
          value: "",
          values: this.assessors,
        },
        lenLess: {
          key: "note",
          label: "Length less than",
          nagation: false,
          comparision: (a, v, _neg, el) => {
            v = el.auditability_note + el.feasibility_note + el.impact_note;
            return v ? v.length <= a : false;
          },
          value: false,
          values: { "40": 40, "90": 90, "180": 180, "270": 270, "600": 600 },
        },
        lenGreater: {
          key: "note",
          label: "Length greater than",
          nagation: false,
          comparision: (a, v, _neg, el) => {
            v = el.auditability_note + el.feasibility_note + el.impact_note;
            return v ? v.length >= a : false;
          },
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
    setList(el) {
      this.remoteUpdate()
      this.currentSlice = 100;
      this.currentIndex = 0;
      this.currentPrefilter = el;
      this.currentList = this[el.v];
    },
    updateList() {
      this.currentList = this[this.currentPrefilter.v];
    },
    getNext() {
      this.$router.push({
        name: "assessment",
        params: { id: this.currentList[this.currentIndex].id },
      });
      this.currentIndex = this.currentIndex + 1;
    },
    setNext(index) {
      this.currentIndex = index + 1;
    },
    updateFilter(prop, neg) {
      const newFilter = Object.assign({}, prop);
      newFilter.negation = neg;
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
        current.comparision(current.value, el[current.key], current.negation, el)
      );
      if (filters.length > 1) {
        return this.customFilter(filtered, newFilters);
      } else {
        return filtered;
      }
    },
    remoteUpdate() {
      this.$store.dispatch("assessments/getReviewsCount");
    },

  },
  mounted() {
    this.setList({ label: "All", v: "filteredAssessments" });
    EventBus.$on("next-assessment", this.getNext);
    EventBus.$on("set-assessment-index", this.setNext);
    EventBus.$on("update-list", this.updateList);
    this.remoteUpdate()
    this.interval = setInterval(() => {
      this.remoteUpdate()
      this.updateList()
    }, 10 * 60 * 1000)
  },
  destroyed() {
    EventBus.$off("next-assessment");
    EventBus.$off("set-assessment-index");
    EventBus.$off("update-list");
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
