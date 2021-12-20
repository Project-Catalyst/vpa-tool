<template>
  <b-modal class="assessment"
    :key="`assessment-${fullAssessment.id}`"
    :ref="'modal'"
    v-model="isOpen"
    :can-cancel="false"
    :animation="'no-animation'"
    full-screen
    >
    <div class="card container custom-card" v-if="fullAssessment">
      <div class="card-content">
        <p class="title is-4">
          {{ fullAssessment.title }} <span class="is-size-5 has-text-weight-bold">(<a :href="fullAssessment.url" target="_blank">See proposal in IdeaScale</a>)</span>
        </p>
        <p class="subtitle is-5">{{ category.title }}</p>
        <p class="subtitle is-5">
          <strong>No. of vCAs reviews:</strong>
          {{ (assessment.reviews) ? assessment.reviews : 0 }}
        </p>
        <p class="is-6">
          <strong>Assessor:</strong>
          {{ fullAssessment.assessor }}
        </p>

        <div class="columns is-multiline is-mobile">
          <div class="column is-three-quaters">
          </div>
          <div class="column is-one-quarter">
          </div>
          <div class="column is-three-quarters">
            <p class="title is-6 mb-4">
              Impact / Alignment
            </p>
            <b-rate size="is-medium" v-model="fullAssessment.impact_rating" disabled />
            <p class="subtitle is-6 mb-2">{{ fullAssessment.impact_note }}</p>
          </div>
          <div class="column is-one-quarter">
          </div>
          <div class="column is-three-quarters">
            <p class="title is-6 mb-4">Feasibility</p>
            <b-rate size="is-medium" v-model="fullAssessment.feasibility_rating" disabled />
            <p class="subtitle is-6 mb-2">{{ fullAssessment.feasibility_note }}</p>
          </div>
          <div class="column is-one-quarter">
          </div>
          <div class="column is-three-quarters">
            <p class="title is-6 mb-4">Auditability</p>
            <b-rate size="is-medium" v-model="fullAssessment.auditability_rating" disabled />
            <p class="subtitle is-6 mb-2">{{ fullAssessment.auditability_note }}</p>
          </div>
          <div class="column is-one-quarter">
          </div>
          <div class="column is-three-quarters">
            <b-checkbox
              class="always-opaque mb-3"
              v-model="fullAssessment.proposer_mark"
              type="is-warning"
              disabled>
              Flagged by Proposer
            </b-checkbox>
            <b-message
              v-if="profile.info.proposersRationaleVisible && fullAssessment.proposer_rationale"
              title="Proposer rationale" :closable="false">
              {{ fullAssessment.proposer_rationale }}
            </b-message>
          </div>
        </div>
        <div class="columns is-mobile is-centered">
          <section class="column is-narrow">
            <p class="title is-4">Your review:</p>
            <b-field>
              <b-radio-button v-model="review"
                native-value="excellent"
                size="is-large"
                type="is-success is-light is-outlined">
                <b-icon icon="heart"></b-icon>
                <span>Excellent</span>
              </b-radio-button>

              <b-radio-button v-model="review"
                native-value="good"
                size="is-large"
                type="is-primary is-light is-outlined">
                <b-icon icon="check"></b-icon>
                <span>Good</span>
              </b-radio-button>

              <b-radio-button v-model="review"
                native-value="filtered_out"
                size="is-large"
                type="is-danger is-light is-outlined">
                <b-icon icon="close"></b-icon>
                Filtered out
              </b-radio-button>
            </b-field>
            <b-button type="is-warning is-light" @click="uncheck()" outlined>Deselect</b-button>
          </section>
        </div>
      </div>
      <footer class="card-footer custom-footer">
        <router-link class="card-footer-item"
          :to="{ name: 'conditions' }">
          Overview
        </router-link>
        <a @click="getNext" class="card-footer-item">
          Next
        </a>
      </footer>
    </div>
  </b-modal>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import categories from "../assets/data/categories.json";

export default {
  name: "Assessment",
  data() {
    return {
      categories: categories,
      isOpen: true
    };
  },
  computed: {
    ...mapGetters("assessments", ["getById", "getFullById"]),
    ...mapState({
      profile: (state) => state.profile
    }),
    assessment() {
      return this.getById(this.$route.params.id)
    },
    fullAssessment() {
      return this.getFullById(this.$route.params.id)
    },
    category() {
      if (this.proposal) {
        let filtered = this.categories.filter(
          (c) => c.id === parseInt(this.proposal.category)
        );
        if (filtered.length) {
          return filtered[0];
        }
      }
      return false;
    },
    review: {
      get() {
        if (this.assessment.excellent) return 'excellent';
        if (this.assessment.good) return 'good';
        if (this.assessment.filtered_out) return 'filtered_out';
        return '';
      },
      set(val) {
        this.$store.commit('assessments/setReview', {
          id: this.$route.params.id,
          value: val
        });
      }
    },
  },
  methods: {
    uncheck() {
      this.review = ''
    },
    getNext() {
      this.$store.dispatch('assessments/getNext')
    }
  },
};
</script>

<style lang="scss" scoped>
.column {
  &.yellow {
    background: #ffef93;
  }
  &.red {
    background: #ff9393;
    width: 100% !important;
  }
  &.green {
    background: #baffb2;
  }
  &.not_related, &.other, &.other_rationale {
    width: 100% !important;
  }
}
.inline {
  display: inline-block;
}
.always-opaque {
  opacity: 1 !important;
}
.custom-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  padding: .10rem;
  background: #fff;
  width: 100%;
  z-index: 10;
}
.custom-card {
  padding-bottom: 60px;
}
.larger-tooltip {
  .tooltip-content {
    width: 500px;
  }
}
</style>
<style lang="scss">
.larger-tooltip .tooltip-content {
  width: 500px !important;
  max-width: 100vw !important;
}
</style>
