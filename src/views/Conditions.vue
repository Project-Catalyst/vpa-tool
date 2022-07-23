<template>
  <div class="conditions container">
    <section>
      <div class="filters pt-4">
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
      <b-field class="pt-4 pb-4">
        <b-radio-button
          v-model="localActivePrefilter"
          v-for="(el, i) in prefilters"
          :native-value="el.v"
          :key="i"
          size="is-small"
          expanded
          >{{ el.label }}</b-radio-button
        >
      </b-field>
      <div class="notification is-primary mb-6 p-4">
        <span class="m-2" >Your progress: {{localTot}}/{{fullCount}}</span>
        <span class="m-2">Filtered results: {{filteredCount}}</span>
        <div class="buttons is-flex mt-3">
          <b-button type="is-primary" inverted @click="getNext">Next</b-button>
          <b-button
            type="is-primary"
            inverted
            outlined
            @click="toggleList"
            >{{ showListLabel }}</b-button
          >
          <div class="is-flex-grow-1">
            <b-button class="is-pulled-right" @click="exportCsv" v-if="profile.localDb">
              Export CSV
            </b-button>
          </div>
        </div>
      </div>
      <div class="assessments-list" v-if="listVisible">
        <assessment-preview
          v-for="assessment in renderedList"
          :key="`ass-${assessment.id}`"
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
import DownloadMixin from '@/mixins/download'
import proposals from "../assets/data/proposals.json";
import categories from "../assets/data/categories.json";
import assessors from "../assets/data/assessors.json";

export default {
  name: "Conditions",
  components: {
    AssessmentPreview,
    CFilter,
  },
  mixins: [DownloadMixin],
  data() {
    return {
      proposals: proposals,
      assessors: assessors,
      categories: categories,
      interval: false,
      filterVisible: false,
      negationFilters: {
        assessor: false,
        challenge: false,
        proposal: false,

      },
      prefilters: [
        { label: "Random", v: "random" },
        { label: "Low reviewed (from other vPAs)", v: "lowReviewed" },
        { label: "No reviews (from other vPAs)", v: "noReviewed" },
        { label: "All", v: "std" },
      ],
    };
  },
  computed: {
    ...mapState({
      activeFilters: (state) => state.assessments.activeFilters,
      currentSlice: (state) => state.assessments.currentSlice,
      listVisible: (state) => state.assessments.listVisible
    }),
    ...mapGetters("assessments", ["renderedList", "filteredCount", "fullCount"]),
    localActivePrefilter: {
      get() {
        return this.$store.state.assessments.activePrefilter.v
      },
      set(val) {
        let selected = this.prefilters.find((el) => el.v === val)
        this.$store.commit('assessments/setPrefilter', selected)
      }
    },
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
      return this.$store.state.assessments.all.length
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
          negative: this.negationFilters.proposal
        },
        challenge: {
          key: "challenge",
          label: "Challenge",
          comparison: 'same',
          type: 'autocomplete',
          value: false,
          values: this.categoriesByTitle,
          negative: this.negationFilters.challenge
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
          negative: this.negationFilters.assessor
        },
        lenLess: {
          key: "note",
          label: "Length less than",
          comparison: 'lengthLess',
          type: 'select',
          value: false,
          values: { "500": 500, "600": 700, "750": 750, "900": 900 },
        },
        lenGreater: {
          key: "note",
          label: "Length greater than",
          comparison: 'lengthGreater',
          type: 'select',
          value: false,
          values: { "600": 700, "750": 750, "900": 900, "1200": 1200 },
        },
        already_reviewed: {
          key: "reviewed",
          label: "Already reviewed",
          comparison: 'alreadyReviewed',
          type: 'select',
          value: "",
          values: {
            "Reviewed": true,
            "Not reviewed": false,
          },
        },
      };
    },
    showListLabel() {
      return (this.listVisible) ? 'Close list' : 'Show list'
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
