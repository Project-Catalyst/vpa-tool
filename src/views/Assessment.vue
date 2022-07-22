<template>
  <div class="assessment mt-4 mb-6"
    :key="`assessment-${fullAssessment.id}`"
    >
    <div class="card container custom-card" v-if="fullAssessment">
      <div class="card-content">
        <p class="title is-4">
          {{ fullAssessment.title }} <span class="is-size-5 has-text-weight-bold">(<a :href="fullAssessment.url" target="_blank">See proposal in IdeaScale</a>)</span>
        </p>
        <p class="subtitle is-5">{{ fullAssessment.challenge }}</p>
        <p class="subtitle is-5">
          <strong>No. of vPAs reviews:</strong>
          {{ (fullAssessment.reviews) ? fullAssessment.reviews : 0 }}
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
            <p class="title is-4">Your categorization of the assessment:</p>
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
            <b-field
              :type="(!navigationAvailable) ? 'is-danger' : ''"
              :message="(!navigationAvailable) ? 'Please fill out this field.' : ''"
              label="Provide your rationale for filtered out OR your feedback to PA (recommended):"
              class="mt-4"
              v-if="fullAssessment.reviewed">
              <b-input
                type="textarea"
                @keydown.native="saveStatus = 'Saving...'"
                v-model="debouncedRationale"></b-input>
            </b-field>
            <b-tag icon="content-save-outline" v-if="assessment.id && fullAssessment.reviewed">
              {{saveStatus}}
            </b-tag>
          </section>
        </div>
      </div>
      <footer class="card-footer custom-footer">
        <router-link class="card-footer-item"
          :to="{ name: 'conditions' }">
          Assessments list / Overview
        </router-link>
        <a @click="getNext" class="card-footer-item">
          Next
        </a>
      </footer>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import debounce from 'lodash.debounce';

export default {
  name: "Assessment",
  data() {
    return {
      isOpen: true,
      saveStatus: 'Feedback saved locally'
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
    rationaleRequired() {
      return this.review === 'filtered_out'
    },
    navigationAvailable() {
      /*
      if (this.review === 'filtered_out') {
        if (this.debouncedRationale) {
          if (this.debouncedRationale.length > 0) {
            return true
          }
        }
        return false
      }
      */
      return true
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
    debouncedRationale: {
      get() {
        return this.assessment.vpa_feedback;
      },
      set: debounce(function(val) {
        this.$store.commit('assessments/setVcaFeedback', {
          id: this.$route.params.id,
          value: val
        });
        this.saveStatus = 'Feedback saved locally'
      }, 500)
    }
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
.control .button {
  box-shadow: none !important;
}
</style>
