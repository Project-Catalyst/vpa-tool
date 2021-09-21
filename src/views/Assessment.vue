<template>
  <b-modal class="assessment"
    :ref="'modal'"
    v-model="isOpen"
    :can-cancel="false"
    full-screen
    >
    <div class="card container custom-card" v-if="assessment">
      <!-- <div class="card-image">
        <figure class="image is-4by3">
          <img
            src="https://via.placeholder.com/1280x960"
            :alt="proposal.title"
          />
        </figure>
      </div> -->
      <div class="card-content" :key="`assessment-${assessment.id}`">
        <p class="title is-4">
          {{ proposal.title }} <span class="is-size-5 has-text-weight-bold">(<a :href="proposal.url" target="_blank">See proposal in IdeaScale</a>)</span>
        </p>
        <p class="subtitle is-5">{{ category.title }}</p>
        <p class="subtitle is-5">
          <strong>No. of vCAs reviews:</strong>
          {{ (assessment.reviews) ? assessment.reviews : 0 }}
        </p>
        <p class="is-6">
          <strong>Assessor:</strong>
          {{ assessment.assessor }}
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
            <b-rate size="is-medium" v-model="assessment.impact_rating" disabled />
            <p class="subtitle is-6 mb-2">{{ assessment.impact_note }}</p>
          </div>
          <div class="column is-one-quarter">
          </div>
          <div class="column is-three-quarters">
            <p class="title is-6 mb-4">Feasibility</p>
            <b-rate size="is-medium" v-model="assessment.feasibility_rating" disabled />
            <p class="subtitle is-6 mb-2">{{ assessment.feasibility_note }}</p>
          </div>
          <div class="column is-one-quarter">
          </div>
          <div class="column is-three-quarters">
            <p class="title is-6 mb-4">Auditability</p>
            <b-rate size="is-medium" v-model="assessment.auditability_rating" disabled />
            <p class="subtitle is-6 mb-2">{{ assessment.auditability_note }}</p>
          </div>
          <div class="column is-one-quarter">
          </div>
          <div class="column is-three-quarters">
            <b-checkbox
              class="always-opaque mb-3"
              v-model="assessment.proposer_mark"
              type="is-warning"
              disabled>
              Flagged by Proposer
            </b-checkbox>
            <b-message
              v-if="profile.info.proposersRationaleVisible && assessment.proposer_rationale"
              title="Proposer rationale" :closable="false">
              {{ assessment.proposer_rationale }}
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
                native-value="not_valid"
                size="is-large"
                type="is-danger is-light is-outlined">
                <b-icon icon="close"></b-icon>
                Not Valid
              </b-radio-button>
            </b-field>
            <b-button type="is-warning is-light" @click="uncheck()" outlined>Deselect</b-button>
          </section>
        </div>
      </div>
      <footer class="card-footer custom-footer">
        <router-link class="card-footer-item" :to="{ name: 'conditions' }">
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
import proposals from "../assets/data/proposals.json";
import categories from "../assets/data/categories.json";
import originalAssessments from "../assets/data/assessments.csv";

import { EventBus } from "./../EventBus";

export default {
  name: "Assessment",
  data() {
    return {
      originalAssessments: originalAssessments,
      proposals: proposals,
      categories: categories,
      isOpen: true
    };
  },
  computed: {
    ...mapGetters("assessments", ["getById"]),
    ...mapState({
      profile: (state) => state.profile
    }),
    mappedAssessments() {
      let result = {}
      this.originalAssessments.forEach(el => {
        result[el.id] = el
      })
      return result
    },
    assessment() {
      const fullAssessment = this.mappedAssessments[this.$route.params.id]
      const localAssessment = this.getById(this.$route.params.id)
      return {...fullAssessment, ...localAssessment}
    },
    proposal() {
      if (this.assessment) {
        let filtered = this.proposals.filter(
          (p) => p.id === parseInt(this.assessment.proposal_id)
        );
        if (filtered.length) {
          return filtered[0];
        }
      }
      return false;
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
        if (this.assessment.not_valid) return 'not_valid';
        return '';
      },
      set(val) {
        console.log(val)
        this.$store.commit('assessments/setReview', {
          id: this.$route.params.id,
          value: val
        });
        EventBus.$emit('update-list')
      }
    },
  },
  methods: {
    uncheck() {
      this.review = ''
    },
    self() {
      return this;
    },
    getNext() {
      EventBus.$emit("next-assessment");
    },
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
