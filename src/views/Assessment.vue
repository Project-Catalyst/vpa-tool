<template>
  <b-modal class="assessment"
    :ref="'modal'"
    v-model="isOpen"
    :can-cancel="false"
    full-screen
    >
    <div class="card container custom-card">
      <!-- <div class="card-image">
        <figure class="image is-4by3">
          <img
            src="https://via.placeholder.com/1280x960"
            :alt="proposal.title"
          />
        </figure>
      </div> -->
      <div class="card-content">
        <p class="title is-4">
          {{ assessment.title }} <span class="is-size-5 has-text-weight-bold">(<a :href="assessment.url" target="_blank">See proposal in IdeaScale</a>)</span>
        </p>
        <p class="subtitle is-6">{{ category.title }}</p>

        <div class="columns is-multiline is-mobile">
          <div class="column is-three-quarters">
            <p class="is-6">
              <strong>Question:</strong>
              {{ question.title }}
            </p>
          </div>
          <div class="column is-one-quarter">
            <p class="is-6">
              <strong>Assessor:</strong>
              {{ assessment.assessor }}
            </p>
          </div>
          <div class="column is-three-quarters">
            <p class="title is-6">Impact / Alignment Note</p>
            <p class="subtitle is-6">{{ assessment.impact_note }}</p>
          </div>
          <div class="column is-one-quarter">
            <p class="title is-6">
              Impact / Alignment Rating:
              <span class="inline">
                <b-rate v-model="assessment.impact_rating" disabled />
              </span>
            </p>
          </div>
          <div class="column is-three-quarters">
            <p class="title is-6">Feasibility Note</p>
            <p class="subtitle is-6">{{ assessment.feasibility_note }}</p>
          </div>
          <div class="column is-one-quarter">
            <p class="title is-6">
              Feasibility Rating:
              <span class="inline">
                <b-rate v-model="assessment.feasibility_rating" disabled />
              </span>
            </p>
          </div>
          <div class="column is-three-quarters">
            <p class="title is-6">Auditability Note</p>
            <p class="subtitle is-6">{{ assessment.auditability_note }}</p>
          </div>
          <div class="column is-one-quarter">
            <p class="title is-6">
              Auditability Rating:
              <span class="inline">
                <b-rate v-model="assessment.auditability_rating" disabled />
              </span>
            </p>
          </div>
          <div class="column is-full">
            <p class="is-6">
              <strong>No of reviews by vCAs:</strong>
              {{ (assessment.reviews) ? assessment.reviews : 0 }}
            </p>
          </div>
          <div
            class="column is-half"
            v-for="(c, i) in criteria"
            :key="i"
            :class="[c.color, c.key]"
          >
            <b-field :label="(c.type === 'text') ? c.name : ''">
              <b-checkbox v-if="(c.type === 'boolean')" v-model="self()[c.key]">
                {{ c.name }}
                <b-tooltip
                  :label="c.info"
                  class="larger-tooltip"
                  size="is-large"
                  multilined>
                    <b-icon icon="information-outline"></b-icon>
                </b-tooltip>
              </b-checkbox>
              <b-input
                type="textarea"
                v-model="self()[c.key]"
                v-if="(c.type === 'text')"
              ></b-input>
            </b-field>
          </div>
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
import { mapGetters } from "vuex";
import proposals from "../assets/data/proposals.json";
import categories from "../assets/data/categories.json";
import questions from "../assets/data/questions.json";
import criteria from "../assets/data/criteria.json";
import dynamicComputed from "@/utils/dynamicComputed";

import { EventBus } from "./../EventBus";

export default {
  name: "Assessment",
  data() {
    return {
      proposals: proposals,
      categories: categories,
      questions: questions,
      criteria: criteria,
      isOpen: true
    };
  },
  asyncComputed: {
    // ideaImageSrc: {
    //   // The `get` function is the same as the function you would
    //   // pass directly as the value to `blogPostContent` if you
    //   // didn't need to specify a default value.
    //   get() {
    //     return this.axios.get(this.proposal.url).then((response) => {
    //       console.log(response);
    //       return "https://via.placeholder.com/1280x960";
    //     });
    //   },
    //   // The computed proporty `blogPostContent` will have
    //   // the value 'Loading...' until the first time the promise
    //   // returned from the `get` function resolves.
    //   default: "https://via.placeholder.com/1280x960",
    // },
  },
  computed: {
    ...mapGetters("assessments", ["getById"]),
    ...dynamicComputed(criteria, "assessment"),
    assessment() {
      return this.getById(this.$route.params.id);
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
    question() {
      if (this.proposal) {
        let filtered = this.questions.filter(
          (q) => q.id === parseInt(this.assessment.question_id)
        );
        if (filtered.length) {
          return filtered[0];
        }
      }
      return false;
    },
  },
  methods: {
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
